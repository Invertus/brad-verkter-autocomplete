# @bradsearch/brad-verkter-autocomplete

BradSearch autocomplete component for Verkter storefronts. Framework-agnostic React component that wraps the BradSearch autocomplete web component.

## Installation

```bash
npm install @invertus/brad-verkter-autocomplete
```

## Quick Start

```jsx
import { BradSearchAutocomplete } from '@invertus/brad-verkter-autocomplete';

function SearchBar() {
  return (
    <BradSearchAutocomplete
      publicKey="your-api-key"
      showTaxes={true}
      storeCode="lt_store"
      apiUrl="https://api.bradsearch.com/api/v1/verkter-lt/query"
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
| `apiUrl` | `string` | Yes | - | BradSearch API endpoint URL |
| `categoryFilterCodes` | `string[]` | Yes | - | Filter codes used for category click navigation |
| `scriptUrl` | `string` | No | CDN latest | BradSearch autocomplete script URL |
| `searchInputSelector` | `string` | No | `input[name="search_query"]` | CSS selector for the search input |
| `redirectUrl` | `string` | No | `/search.html?query=bradsearch-placeholder` | Search results page URL template |
| `onSearchResultClick` | `function` | No | Built-in handler | Custom handler for search result clicks |

## Magento PWA Studio Integration

```jsx
import { BradSearchAutocomplete } from '@invertus/brad-verkter-autocomplete';
import { useQuery } from '@apollo/client';
import { gql } from 'graphql-tag';

const STORE_CONFIG_QUERY = gql`
  query StoreConfig {
    storeConfig {
      bradsearch_autocomplete_public_key
      store_code
      bradsearch_autocomplete_script_url
    }
    pricesWithTax @client
  }
`;

function SearchBar() {
  const { data } = useQuery(STORE_CONFIG_QUERY);
  const storeConfig = data?.storeConfig;

  if (!storeConfig) return null;

  return (
    <BradSearchAutocomplete
      publicKey={storeConfig.bradsearch_autocomplete_public_key}
      showTaxes={data.pricesWithTax}
      storeCode={storeConfig.store_code}
      apiUrl="https://api.bradsearch.com/api/v1/verkter-lt/query"
      categoryFilterCodes={['f71a39ed758a2aba322bd3a9212e01', 'b6f2c76b997fff72c8a41e1531e5ab']}
      scriptUrl={storeConfig.bradsearch_autocomplete_script_url}
    />
  );
}
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
