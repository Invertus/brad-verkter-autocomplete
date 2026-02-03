const DEFAULT_SCRIPT_URL = 'https://cdn.js.bradsearch.com/bradsearch-scripts/v6.0.6/bradautocomplete.umd.js';
const DEFAULT_API_URL = 'https://api.bradsearch.com/api/v1/verkter-lt/query';

export function buildApiConfig({ publicKey, apiUrl = DEFAULT_API_URL }) {
    return {
        limit: 6,
        token: publicKey,
        url: apiUrl,
        fields: {
            name: {
                type: "text_keyword",
                filterable: false
            },
            brand: {
                type: "text_keyword",
                filterable: true,
                label: "Brands",
                count: 4,
                facetsVisibility:"desktop"
            },
            categoryDefault: {
                type: "text_keyword",
                filterable: true,
                label: "Kategorijos",
                count: 4,
                facetsVisibility:"desktop"
            }
        },
        mapping: {
            title: 'name',
            link: 'productUrl',
            imageUrl: 'imageUrl',
            price: 'price',
            basePrice: 'basePrice',
            priceTaxExcluded: 'priceTaxExcluded',
            basePriceTaxExcluded: 'basePriceTaxExcluded',
            reference: 'sku',
            brand: null,
        },
    };
}

export { DEFAULT_SCRIPT_URL, DEFAULT_API_URL };
