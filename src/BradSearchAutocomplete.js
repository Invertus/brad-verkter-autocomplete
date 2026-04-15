import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import useScriptLoader from './hooks/useScriptLoader';
import buildAttributes from './utils/buildAttributes';
import deepMerge from './utils/deepMerge';
import { buildApiConfig, DEFAULT_SCRIPT_URL, DEFAULT_API_URL } from './config/apiConfig';
import defaultStyles from './config/styles';
import defaultOverrideStyles from './config/overrideStyles';
import LOCALE_MAP from './config/locales';

const isServer = !globalThis.document;

const BradSearchAutocomplete = ({
    publicKey,
    showTaxes,
    storeCode,
    categoryFilterCodes,
    apiUrl = DEFAULT_API_URL,
    scriptUrl = DEFAULT_SCRIPT_URL,
    searchInputSelector = 'input[name="search_query"]',
    redirectUrl = '/search.html?query=bradsearch-placeholder',
    onSearchResultClick,
    adminConfig = null,
}) => {
    const containerRef = useRef(null);
    const componentInitializedRef = useRef(false);

    const localeConfig = LOCALE_MAP[storeCode] || LOCALE_MAP.lt_store;

    // Resolve effective values: adminConfig overrides props/defaults
    const effectiveScriptUrl = adminConfig?.scriptUrl || scriptUrl;
    const effectiveApiUrl = adminConfig?.apiConfig?.url || apiUrl;
    const effectiveSearchInputSelector = adminConfig?.searchInputSelector || searchInputSelector;
    const effectiveRedirectUrl = adminConfig?.redirectUrl || redirectUrl;
    const effectiveCategoryFilterCodes = adminConfig?.categoryFilterCodes || categoryFilterCodes;

    const options = useMemo(() => {
        const defaults = {
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
            modalSelector: effectiveSearchInputSelector,
            locale: localeConfig.locale,
            priceWithTaxes: showTaxes,
            currency: 'EUR',
        };
        return deepMerge(defaults, adminConfig?.options || {});
    }, [showTaxes, effectiveSearchInputSelector, localeConfig.locale, adminConfig?.options]);

    const apiConfigMerged = useMemo(() => {
        const defaults = buildApiConfig({ publicKey, apiUrl: effectiveApiUrl });
        return deepMerge(defaults, adminConfig?.apiConfig || {});
    }, [publicKey, effectiveApiUrl, adminConfig?.apiConfig]);

    const translations = useMemo(
        () => deepMerge(localeConfig.translations, adminConfig?.translations || {}),
        [localeConfig.translations, adminConfig?.translations]
    );

    const styles = useMemo(
        () => deepMerge(defaultStyles, adminConfig?.styles || {}),
        [adminConfig?.styles]
    );

    const overrideStyles = adminConfig?.overrideStyles !== undefined
        ? adminConfig.overrideStyles
        : defaultOverrideStyles;

    const config = useMemo(() => ({
        'api-config': apiConfigMerged,
        'redirect-url': effectiveRedirectUrl,
        'search-input-selector': effectiveSearchInputSelector,
        options,
        translations,
        styles,
        'override-styles': overrideStyles,
    }), [apiConfigMerged, effectiveRedirectUrl, effectiveSearchInputSelector, options, translations, styles, overrideStyles]);

    const initializeComponent = useCallback(() => {
        if (!containerRef.current || componentInitializedRef.current) return;

        const attributes = buildAttributes(config);
        containerRef.current.innerHTML = `<bradsearch-autocomplete id="bradsearch-autocomplete" ${attributes}></bradsearch-autocomplete>`;
        componentInitializedRef.current = true;
    }, [config]);

    useScriptLoader(
        !isServer && publicKey ? effectiveScriptUrl : null,
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

            var origin = (globalThis.location && globalThis.location.origin) || '';

            if (section === 'facet') {
                const encodedValue = encodeURIComponent(`${item.value}|${item.value}`);
                window.location.href = origin + '/search.html?query=' + encodedQuery + '&manufacturer%5Bfilter%5D=' + encodedValue;
            } else if (section === 'category') {
                const foundCode = effectiveCategoryFilterCodes.find(function(code) {
                    return filters[code] && filters[code].some(function(filterItem) {
                        return filterItem.value === item.value;
                    });
                });

                if (foundCode) {
                    const encodedValue = encodeURIComponent(`${item.value}|${item.value}`);
                    window.location.href = origin + '/search.html?query=' + encodedQuery + '&' + foundCode + '%5Bfilter%5D=' + encodedValue;
                }
            }
        };

        document.addEventListener('bradsearch-search-result-click', handleClick);
        return () => document.removeEventListener('bradsearch-search-result-click', handleClick);
    }, [onSearchResultClick, effectiveCategoryFilterCodes]);

    if (isServer) return null;

    return <div ref={containerRef} id="bradsearch-autocomplete-container" style={{ position: 'relative' }} />;
};

export default BradSearchAutocomplete;
