export default function buildSearchResultUrl(redirectUrl, currentHref, query, filterKey, value) {
    const searchPage = new URL(redirectUrl, currentHref);
    const encodedValue = encodeURIComponent(`${value}|${value}`);

    return searchPage.origin + searchPage.pathname
        + '?query=' + encodeURIComponent(query)
        + '&' + filterKey + '%5Bfilter%5D=' + encodedValue;
}
