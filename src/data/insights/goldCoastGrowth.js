/*
 * 003 — Gold Coast: planning for a million people.
 * Figures from arcadea-reels videos/003-gold-coast-supply/sources.md.
 *
 * Kept off this page on purpose (see the overview doc): the Property
 * Council's price and rent growth figures, any claim that a supply gap means
 * prices will rise, and any claim that the past decade under-built
 * (approvals roughly kept pace with population growth).
 */
import { GENERAL_ADVICE, baseDetails } from './shared';

export const VIDEO = {
    src: '/videos/insights/gold-coast-growth-plan.mp4',
    poster: '/images/insights/gold-coast-growth-plan-poster.jpg',
    title: 'Gold Coast: planning for a million people',
    duration: '2:05',
};

// Gold Coast (C) estimated resident population at 30 June (QGSO / ABS).
// r = revised, p = preliminary.
export const POPULATION = [
    { year: '2015', people: 561629 },
    { year: '2016', people: 575303 },
    { year: '2017', people: 589101 },
    { year: '2018', people: 602443 },
    { year: '2019', people: 614435 },
    { year: '2020', people: 626342 },
    { year: '2021', people: 633598 },
    { year: '2022', people: 645181, note: 'revised' },
    { year: '2023', people: 664129, note: 'revised' },
    { year: '2024', people: 679286, note: 'revised' },
    { year: '2025', people: 691230, note: 'preliminary' },
];

export const TEN_YEAR_GROWTH = 129601; // 691,230 − 561,629
export const LAST_YEAR_GROWTH = 11944; // +1.76%

// City of Gold Coast Local Growth Management Strategy (LGMS)
export const PLAN = {
    residents: 1000000,
    homes: 185000,
    perYear: 9250, // 185,000 ÷ 20
};

// Residential building approvals, Gold Coast City, years to 30 June (ABS via .id)
export const APPROVALS = [
    { year: '2016–17', homes: 6891 },
    { year: '2017–18', homes: 6106 },
    { year: '2018–19', homes: 5012 },
    { year: '2019–20', homes: 4479 },
    { year: '2020–21', homes: 5216 },
    { year: '2021–22', homes: 5590 },
    { year: '2022–23', homes: 5932 },
    { year: '2023–24', homes: 4614 },
    { year: '2024–25', homes: 4099 },
    { year: '2025–26', homes: 7586 },
];
export const APPROVALS_AVERAGE = 5553;

// Property Council of Australia / Urbis (industry research)
export const ATTACHED_TARGET = 5643; // apartments + townhouses a year, regional plan 2021–31
export const ATTACHED_DELIVERED_MAX = 1881; // "under a third": 5,643 ÷ 3
export const APARTMENTS_AT_RISK = 58; // % due 2027–28 at moderate or high risk

// QGSO 2023 projections, Gold Coast SA4 (slightly larger than the council area)
export const PROJECTIONS = [
    { label: '2021', sub: 'Base year', people: 649491 },
    { label: '2046, low', people: 885735 },
    { label: '2046, medium', people: 1007115 },
    { label: '2046, high', people: 1151185 },
];

export const DISCLOSURE = 'Arcadea markets new property on the Gold Coast and may benefit.';

export const UPDATED = '6 October 2026';

export const DISCLAIMER = `${GENERAL_ADVICE} The growth strategy is a plan with in-principle support, not adopted rules, and population projections are not forecasts of prices or rents.`;

export const DETAILS = baseDetails({
    disclosure: DISCLOSURE,
    figures: "Population figures are QGSO's estimates from ABS data; the 2022–24 figures are revised and 2025 is preliminary. Approvals are ABS building approvals as published by .id. The Property Council of Australia is an industry advocacy body, and its findings (research by Urbis) are attributed to it. The 2046 projections are for the Gold Coast SA4 region, which is slightly larger than the council area. Maps join stations and stops in order rather than following the exact track.",
});

export const SOURCES = [
    {
        title: 'Estimated resident population by local government area, Qld, 2001–2025p',
        publisher: 'Queensland Government Statistician’s Office (ABS data)',
        url: 'https://www.qgso.qld.gov.au/issues/5496/estimated-resident-population-local-government-area-qld-2001-2025p.csv',
        checked: '2 Oct 2026',
    },
    {
        title: 'Local Growth Management Strategy',
        publisher: 'City of Gold Coast, GC Have Your Say',
        url: 'https://gchaveyoursay.com.au/lgms',
        checked: '6 Oct 2026',
    },
    {
        title: "Gold Coast can't stop growth, needs 185,000 new homes",
        publisher: 'ABC News, 16 Feb 2026',
        url: 'https://www.abc.net.au/news/2026-02-16/gold-coast-cant-stop-growth-needs-185000-new-homes/106349254',
        checked: '6 Oct 2026',
    },
    {
        title: 'Building approvals, City of Gold Coast',
        publisher: '.id community profile, from ABS Building Approvals (8731.0)',
        url: 'https://profile.id.com.au/gold-coast/building-approvals',
        checked: '2 Oct 2026',
    },
    {
        title: 'Gold Coast apartment supply has no wind in the sails',
        publisher: 'Property Council of Australia (industry body), research by Urbis',
        url: 'https://www.propertycouncil.com.au/media-releases/gold-coast-apartment-supply-has-no-wind-in-the-sails',
        checked: '2 Oct 2026',
    },
    {
        title: 'Southport declared a Priority Development Area',
        publisher: 'Queensland Government, ministerial media statement',
        url: 'https://statements.qld.gov.au/statements/73385',
        checked: '6 Oct 2026',
    },
    {
        title: 'Southport Priority Development Area',
        publisher: 'Economic Development Queensland',
        url: 'https://www.edq.qld.gov.au/projects/southport/',
        checked: '6 Oct 2026',
    },
    {
        title: 'Queensland Government population projections, 2023 edition',
        publisher: 'Queensland Government open data',
        url: 'https://queensland.opendatasoft.com/explore/dataset/queensland-government-population-projection-2023-edition/',
        checked: '2 Oct 2026',
    },
];

export const ATTRIBUTIONS = [
    'Rail and light rail stops © OpenStreetMap contributors (openstreetmap.org/copyright), ODbL.',
    'Gold Coast boundary © Australian Bureau of Statistics, ASGS 2021, CC BY 4.0.',
];
