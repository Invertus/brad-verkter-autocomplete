# @bradsearch/brad-verkter-autocomplete

BradSearch autocomplete component for Verkter storefronts. Framework-agnostic React component that wraps the BradSearch autocomplete web component.

## Installation

```bash
npm install @bradsearch/brad-verkter-autocomplete
```

## Quick Start

```jsx
import { BradSearchAutocomplete } from '@bradsearch/brad-verkter-autocomplete';

function SearchBar() {
  return (
    <BradSearchAutocomplete
      publicKey="your-api-key"
      showTaxes={true}
      storeCode="lt_store"
      categoryFilterCodes={['f71a39ed758a2aba322bd3a9212e01', 'b6f2c76b997fff72c8a41e1531e5ab']}
    />
  );
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `publicKey` | `string` | Yes | - | BradSearch API token |
| `showTaxes` | `boolean` | Yes | - | Whether to display prices with taxes |
| `storeCode` | `string` | Yes | - | Store code for locale resolution (e.g. `lt_store`) |
| `apiUrl` | `string` | No | `https://api.bradsearch.com/api/v1/verkter-lt/query` | BradSearch API endpoint URL |
| `categoryFilterCodes` | `string[]` | Yes | - | Filter codes used for category click navigation |
| `scriptUrl` | `string` | No | CDN latest | BradSearch autocomplete script URL |
| `searchInputSelector` | `string` | No | `input[name="search_query"]` | CSS selector for the search input |
| `redirectUrl` | `string` | No | `/search.html?query=bradsearch-placeholder` | Search results page URL template |
| `onSearchResultClick` | `function` | No | Built-in handler | Custom handler for search result clicks |

## Magento PWA Studio Integration

```jsx
// 1. In venia-ui/lib/components/SearchBar create new file, e.g bradSearchAutocomplete.js

import React from 'react';
import { shape, string } from 'prop-types';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { BradSearchAutocomplete as BradSearchAutocompleteBase } from '@bradsearch/brad-verkter-autocomplete';

// hardcoded codes used for backwards category filter compatability
const CATEGORY_FILTER_CODES = ['f71a39ed758a2aba322bd3a9212e01', 'b6f2c76b997fff72c8a41e1531e5ab'];

const BradSearchAutocomplete = ({ storeConfig }) => {
    const [{ pricesWithTax }] = useAppContext();

    const {
        bradsearch_autocomplete_public_key: publicKey,
        store_code: storeCode
    } = storeConfig || {};

    if (!publicKey) return null;

    return (
        <BradSearchAutocompleteBase
            publicKey={publicKey}
            showTaxes={pricesWithTax}
            storeCode={storeCode}
            categoryFilterCodes={CATEGORY_FILTER_CODES}
        />
    );
};

BradSearchAutocomplete.propTypes = {
    storeConfig: shape({
        bradsearch_autocomplete_public_key: string,
        store_code: string
    })
};

export default BradSearchAutocomplete;

// 2. In venia-ui/lib/components/SearchBar/searchBar.js  - here check if bradsearch is enabled and display the component. Also, override form submit

import { Form } from 'informed';
import { bool, shape, string } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import { useSearchBar } from '@magento/peregrine/lib/talons/SearchBar';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useStyle } from '../../classify';
import Autocomplete from './autocomplete';
import BradSearchAutocomplete from './bradSearchAutocomplete';
import SearchField from './searchField';
import defaultClasses from './searchBar.module.css';

const SearchBar = React.forwardRef((props, ref) => {
    const { isOpen } = props;
    const talonProps = useSearchBar();
    const {
        containerRef,
        setSearchTerm,
        handleChange,
        handleFocus,
        handleSubmit,
        initialValues,
        isAutoCompleteOpen,
        setIsAutoCompleteOpen,
        valid,
        setSearchTermLoading,
        searchTermLoading
    } = talonProps;

    // Get storeConfig for BradSearch configuration
    const [{ storeConfig }] = useAppContext();

    const bradSearchEnabled = storeConfig?.bradsearch_autocomplete_enabled === '1' || storeConfig?.bradsearch_autocomplete_enabled === true;

    // No-op submit handler for BradSearch - form submission is handled by Brad's web component
    const bradSearchSubmit = () => {}

    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const placeholder = formatMessage({
        id: 'search.placeholder',
        defaultMessage: 'Search among over 70 000 tools'
    });

    return (
        <div className={classes.root} data-cy="SearchBar-root" ref={ref}>
            <div ref={containerRef} className={classes.container}>
                <Form
                    autoComplete="off"
                    className={classes.form}
                    initialValues={initialValues}
                    onSubmit={bradSearchEnabled ? bradSearchSubmit : handleSubmit}
                >
                    {bradSearchEnabled ? (
                        <BradSearchAutocomplete storeConfig={storeConfig} />
                    ) : (
                        <div className={classes.autocomplete}>
                            <Autocomplete
                                setVisible={setIsAutoCompleteOpen}
                                valid={valid}
                                visible={isAutoCompleteOpen}
                                setSearchTerm={setSearchTerm}
                                setSearchTermLoading={setSearchTermLoading}
                            />
                        </div>
                    )}
                    <div className={classes.search}>
                        <SearchField
                            placeholder={placeholder}
                            isSearchOpen={isOpen}
                            onChange={handleChange}
                            onFocus={handleFocus}
                            searchTermLoading={bradSearchEnabled ? false : searchTermLoading}
                        />
                    </div>
                </Form>
            </div>
        </div>
    );
});

export default SearchBar;

SearchBar.propTypes = {
    classes: shape({
        autocomplete: string,
        container: string,
        form: string,
        root: string,
        root_open: string,
        search: string
    }),
    isOpen: bool
};


// 3. packages/peregrine/lib/talons/Header/storeSwitcher.gql.js - add configs

bradsearch_autocomplete_enabled
bradsearch_autocomplete_public_key

// 4. packages/peregrine/lib/store/reducers/app.js - add default values (for local development can keep it disabled)

bradsearch_autocomplete_enabled: true
bradsearch_autocomplete_public_key: ''

```

## Adding New Locales

Edit `src/config/locales.js` to add store code mappings:

```js
const LOCALE_MAP = {
  lt_store: { locale: 'lt-LT', translations: { ... } },
  lv_store: { locale: 'lv-LV', translations: { ... } },
  ee_store: { locale: 'et-EE', translations: { ... } },
};
```

## Customization

The package exports `styles` and `overrideStyles` for reference. To customize, pass your own `scriptUrl` or fork the config files.

## Exports

- `BradSearchAutocomplete` - Main React component
- `LOCALE_MAP` - Locale/translation mappings
- `styles` - Default style configuration
- `overrideStyles` - Default CSS overrides
- `buildApiConfig` - API config builder function
- `DEFAULT_SCRIPT_URL` - Default script CDN URL
- `DEFAULT_API_URL` - Default API endpoint URL
