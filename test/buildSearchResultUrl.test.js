import buildSearchResultUrl from '../src/utils/buildSearchResultUrl';

const DEFAULT_REDIRECT_URL = '/search.html?query=bradsearch-placeholder';

function legacyUrl(origin, query, filterKey, value) {
    return origin + '/search.html?query=' + encodeURIComponent(query)
        + '&' + filterKey + '%5Bfilter%5D=' + encodeURIComponent(`${value}|${value}`);
}

describe('buildSearchResultUrl', () => {
    it('keeps the old URL for single-locale stores using the default redirectUrl', () => {
        expect(buildSearchResultUrl(DEFAULT_REDIRECT_URL, 'https://shop.example.com/some-category.html', 'drill', 'manufacturer', 'Bosch'))
            .toBe(legacyUrl('https://shop.example.com', 'drill', 'manufacturer', 'Bosch'));
    });

    it('uses the store view path from redirectUrl', () => {
        expect(buildSearchResultUrl('/ru/search.html?query=bradsearch-placeholder', 'https://shop.example.com/ru/', 'дрель', 'manufacturer', 'Bosch'))
            .toBe('https://shop.example.com/ru/search.html?query=%D0%B4%D1%80%D0%B5%D0%BB%D1%8C&manufacturer%5Bfilter%5D=Bosch%7CBosch');
    });

    it('builds category links with the category filter code', () => {
        expect(buildSearchResultUrl('/ru/search.html?query=bradsearch-placeholder', 'https://shop.example.com/ru/', 'drill', 'abc123', 'Drills & Drivers'))
            .toBe('https://shop.example.com/ru/search.html?query=drill&abc123%5Bfilter%5D=Drills%20%26%20Drivers%7CDrills%20%26%20Drivers');
    });

    it('accepts an absolute redirectUrl', () => {
        expect(buildSearchResultUrl('https://shop.example.com/ru/search.html?query=bradsearch-placeholder', 'https://shop.example.com/', 'drill', 'manufacturer', 'Bosch'))
            .toBe('https://shop.example.com/ru/search.html?query=drill&manufacturer%5Bfilter%5D=Bosch%7CBosch');
    });
});
