const DEFAULT_TRANSLATIONS = {
    noData: 'No results found',
    categories: 'Categories',
    buttonLoadMore: 'Show more results',
    loading: 'Searching...',
    error: 'An error occurred',
    sku: 'Product code',
    brand: 'Brand',
    suggestionTryDifferentKeywords: 'Try different keywords',
    suggestionCheckSpelling: 'Check your spelling',
    suggestionUseBroaderTerms: 'Use broader search terms',
    priceNoTax: 'excl. VAT',
    priceWithTax: 'incl. VAT',
    didYouMeanPrefix: 'Sorry, no results found',
    didYouMeanShowing: 'Showing',
    didYouMeanResultsFor: 'results for',
    didYouMean: 'Try these searches',
};

const LOCALE_MAP = {
    lt_store: { locale: 'lt-LT', translations: DEFAULT_TRANSLATIONS },
    lv_store: { locale: 'lv-LV', translations: DEFAULT_TRANSLATIONS },
    ee_store: { locale: 'et-EE', translations: DEFAULT_TRANSLATIONS },
    fi_store: { locale: 'fi-FI', translations: DEFAULT_TRANSLATIONS },
    dk_store: { locale: 'da-DK', translations: DEFAULT_TRANSLATIONS },
    en_store: { locale: 'en-US', translations: DEFAULT_TRANSLATIONS },
    en_fr:    { locale: 'fr-FR', translations: DEFAULT_TRANSLATIONS },
    // Legacy codes (aliases for backward compatibility)
    et_store: { locale: 'et-EE', translations: DEFAULT_TRANSLATIONS },
    da_store: { locale: 'da-DK', translations: DEFAULT_TRANSLATIONS },
    no_store: { locale: 'nb-NO', translations: DEFAULT_TRANSLATIONS },
    pl_store: { locale: 'pl-PL', translations: DEFAULT_TRANSLATIONS },
    sv_store: { locale: 'sv-SE', translations: DEFAULT_TRANSLATIONS },
};

export default LOCALE_MAP;
