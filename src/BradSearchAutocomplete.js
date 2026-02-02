import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import useScriptLoader from './hooks/useScriptLoader';
import buildAttributes from './utils/buildAttributes';
import { buildApiConfig, DEFAULT_SCRIPT_URL } from './config/apiConfig';
import styles from './config/styles';
import overrideStyles from './config/overrideStyles';
import LOCALE_MAP from './config/locales';

const isServer = !globalThis.document;

const BradSearchAutocomplete = ({
    publicKey,
    showTaxes,
    storeCode,
    categoryFilterCodes,
    apiUrl,
    scriptUrl = DEFAULT_SCRIPT_URL,
    searchInputSelector = 'input[name="search_query"]',
    redirectUrl = '/search.html?query=bradsearch-placeholder',
    onSearchResultClick,
}) => {
    const containerRef = useRef(null);
    const componentInitializedRef = useRef(false);

    const localeConfig = LOCALE_MAP[storeCode] || LOCALE_MAP.lt_store;

    const options = useMemo(() => ({
        width: '1000px',
        customItemClick: true,
        cardView: 'list',
        threshold: 3,
        showHeader: true,
        columns: {
            tablet: 2,
            desktop: 3,
        },
        highlights: true,
        condensed: false,
        modalSelector: searchInputSelector,
        locale: localeConfig.locale,
        priceWithTaxes: showTaxes,
        currency: 'EUR',
    }), [showTaxes, searchInputSelector, localeConfig.locale]);

    const config = useMemo(() => ({
        'api-config': buildApiConfig({ publicKey, apiUrl }),
        'redirect-url': redirectUrl,
        'search-input-selector': searchInputSelector,
        options,
        translations: localeConfig.translations,
        styles,
        'override-styles': overrideStyles,
    }), [publicKey, apiUrl, redirectUrl, searchInputSelector, options, localeConfig.translations]);

    const initializeComponent = useCallback(() => {
        if (!containerRef.current || componentInitializedRef.current) return;

        const attributes = buildAttributes(config);
        containerRef.current.innerHTML = `<bradsearch-autocomplete id="bradsearch-autocomplete" ${attributes}></bradsearch-autocomplete>`;
        componentInitializedRef.current = true;
    }, [config]);

    useScriptLoader(
        !isServer && publicKey ? scriptUrl : null,
        initializeComponent
    );

    // Reset on unmount
    useEffect(() => {
        return () => {
            componentInitializedRef.current = false;
        };
    }, []);

    // Update options on existing component
    useEffect(() => {
        if (!componentInitializedRef.current || !containerRef.current) return;

        const webComponent = containerRef.current.querySelector('bradsearch-autocomplete');
        if (webComponent) {
            webComponent.setAttribute('options', JSON.stringify(options));
        }
    }, [options]);

    // Handle search result clicks
    useEffect(() => {
        if (isServer) return;

        const handleClick = (event) => {
            if (onSearchResultClick) {
                onSearchResultClick(event);
                return;
            }

            const { section, item, query, filters } = event.detail;

            if (!('value' in item)) return;

            const encodedQuery = encodeURIComponent(query);

            if (section === 'facet') {
                const encodedValue = encodeURIComponent(`${item.value}|${item.value}`);
                window.location.href = `${globalThis.location?.origin || ''}/search.html?query=${encodedQuery}&manufacturer%5Bfilter%5D=${encodedValue}`;
            } else if (section === 'category') {
                const foundCode = categoryFilterCodes.find(code =>
                    filters[code]?.some(filterItem => filterItem.value === item.value)
                );

                if (foundCode) {
                    const encodedValue = encodeURIComponent(`${item.value}|${item.value}`);
                    window.location.href = `${globalThis.location?.origin || ''}/search.html?query=${encodedQuery}&${foundCode}%5Bfilter%5D=${encodedValue}`;
                }
            }
        };

        document.addEventListener('bradsearch-search-result-click', handleClick);
        return () => document.removeEventListener('bradsearch-search-result-click', handleClick);
    }, [onSearchResultClick, categoryFilterCodes]);

    if (isServer) return null;

    return <div ref={containerRef} id="bradsearch-autocomplete-container" style={{ position: 'relative' }} />;
};

export default BradSearchAutocomplete;
