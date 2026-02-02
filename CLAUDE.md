# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React component package (`@invertus/brad-verkter-autocomplete`) that wraps the BradSearch autocomplete web component for Verkter storefronts. Framework-agnostic, designed for Magento PWA Studio integration.

## Architecture

The component dynamically loads the BradSearch web component script and injects a `<bradsearch-autocomplete>` custom element with configuration passed as HTML attributes.

**Key files:**
- `src/BradSearchAutocomplete.js` - Main React component handling script loading, web component initialization, and search result click events
- `src/config/locales.js` - Store code to locale/translation mappings (add new locales here)
- `src/config/apiConfig.js` - BradSearch API configuration builder and field mappings
- `src/config/styles.js` / `overrideStyles.js` - Theme tokens and CSS overrides

**Data flow:**
1. Component receives props (publicKey, storeCode, apiUrl, etc.)
2. `useScriptLoader` hook loads the BradSearch script from CDN
3. `buildAttributes` utility converts config objects to HTML attributes
4. Web component is injected into the DOM
5. `bradsearch-search-result-click` events are handled for navigation

## Development

No build step - source files are published directly. Requires React >=16.8.0 as peer dependency.

```bash
npm install  # Install peer dependencies for local testing
```

## Adding New Locales

Edit `src/config/locales.js`:

```js
const LOCALE_MAP = {
    lt_store: { locale: 'lt-LT', translations: { ... } },
    // Add new store codes here
};
```

## Integration Notes

- The component is SSR-safe (`isServer` check prevents DOM access during server rendering)
- Search input selector defaults to `input[name="search_query"]`
- Click handling supports facet, category, and product result types
- `categoryFilterCodes` prop is required for category click navigation to work
