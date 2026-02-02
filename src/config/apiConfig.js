const DEFAULT_SCRIPT_URL = 'https://cdn.bradsearch.com/autocomplete/latest/bradsearch-autocomplete.min.js';

export function buildApiConfig({ publicKey, apiUrl }) {
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

export { DEFAULT_SCRIPT_URL };
