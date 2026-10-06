/*
 * 004 — Who's moving to Queensland, and from where.
 * Figures from arcadea-reels videos/004-moving-to-queensland/sources.md.
 * Year ending 31 March 2026, ABS. The origin, Sydney and Brisbane figures
 * are the ABS's provisional regional estimates and may be revised.
 *
 * Use state wording ("New South Wales and Victoria"): Melbourne on its own
 * isn't broken out here. Nothing on why people move, or on prices or rents.
 */
import { GENERAL_ADVICE, baseDetails } from './shared';

export const VIDEO = {
    src: '/videos/insights/interstate-migration-queensland.mp4',
    poster: '/images/insights/interstate-migration-queensland-poster.jpg',
    title: "Who's moving to Queensland, and from where",
    duration: '1:24',
};

// Net interstate migration by state, year to March 2026
export const BY_STATE = [
    { code: 'QLD', name: 'Queensland', net: 14718 },
    { code: 'WA', name: 'Western Australia', net: 10314 },
    { code: 'VIC', name: 'Victoria', net: 82 },
    { code: 'TAS', name: 'Tasmania', net: -98 },
    { code: 'SA', name: 'South Australia', net: -1208 },
    { code: 'ACT', name: 'Australian Capital Territory', net: -1401 },
    { code: 'NT', name: 'Northern Territory', net: -1589 },
    { code: 'NSW', name: 'New South Wales', net: -20818 },
];

// Moves to and from Queensland, by the other state (four quarters to March 2026)
export const BY_ORIGIN = [
    { code: 'NSW', name: 'New South Wales', moved_in: 45439, moved_out: 35514, net: 9925 },
    { code: 'VIC', name: 'Victoria', moved_in: 26088, moved_out: 20687, net: 5401 },
    { code: 'NT', name: 'Northern Territory', moved_in: 4984, moved_out: 3619, net: 1365 },
    { code: 'ACT', name: 'Australian Capital Territory', moved_in: 4174, moved_out: 3257, net: 917 },
    { code: 'SA', name: 'South Australia', moved_in: 6168, moved_out: 5354, net: 814 },
    { code: 'TAS', name: 'Tasmania', moved_in: 3869, moved_out: 5157, net: -1288 },
    { code: 'WA', name: 'Western Australia', moved_in: 7399, moved_out: 9815, net: -2416 },
];

export const TOTAL_IN = 98121;
export const TOTAL_OUT = 83403;
export const NET = 14718;

export const SYDNEY = { moved_in: 20385, moved_out: 13304, net: 7081 };

export const SETTLED = [
    { name: 'Rest of Queensland', net: 8594, moved_in: 55468, moved_out: 46874 },
    { name: 'Greater Brisbane', net: 6124, moved_in: 42653, moved_out: 36529 },
];

// Queensland net interstate migration, years to March
export const TREND = [
    { year: '2016', net: 10546 },
    { year: '2017', net: 15786 },
    { year: '2018', net: 23867 },
    { year: '2019', net: 22860 },
    { year: '2020', net: 23346 },
    { year: '2021', net: 36854 },
    { year: '2022', net: 40057 },
    { year: '2023', net: 30911 },
    { year: '2024', net: 30022 },
    { year: '2025', net: 24319 },
    { year: '2026', net: 14718 },
];

export const STREAK = { quarters: 180, since: 'June 1981', lowest: 589, lowestQuarter: 'March quarter 2010' };

export const DISCLOSURE = 'Arcadea markets new property in Queensland and may benefit.';

export const UPDATED = '6 October 2026';

export const DISCLAIMER = `${GENERAL_ADVICE} The ABS describes these migration figures as provisional; they may be revised. They say nothing about why people move, or about prices or rents.`;

export const DETAILS = baseDetails({
    disclosure: DISCLOSURE,
    figures: 'All figures are net interstate migration for the year to 31 March 2026 unless stated. State totals are from the ABS release; the origin, Sydney and Brisbane figures add up four quarters of the ABS\'s provisional regional internal migration estimates, which the ABS says are for timely insight and may be revised. The flows reconcile to the published state totals.',
});

export const SOURCES = [
    {
        title: 'National, state and territory population, March 2026',
        publisher: 'Australian Bureau of Statistics, released 17 Sep 2026',
        url: 'https://www.abs.gov.au/statistics/people/population/national-state-and-territory-population/latest-release',
        checked: '6 Oct 2026',
    },
    {
        title: 'Regional internal migration estimates, provisional, March 2026 (Table 3)',
        publisher: 'Australian Bureau of Statistics',
        url: 'https://www.abs.gov.au/statistics/people/population/national-state-and-territory-population/mar-2026/Regional%20internal%20migration%20estimates%2C%20provisional.xlsx',
        checked: '6 Oct 2026',
    },
    {
        title: 'National, state and territory population, March 2026: Table 2 (net interstate migration, Queensland)',
        publisher: 'Australian Bureau of Statistics',
        url: 'https://www.abs.gov.au/statistics/people/population/national-state-and-territory-population/mar-2026/310102.xlsx',
        checked: '6 Oct 2026',
    },
    {
        title: 'Population growth highlights and trends, Queensland, 2026 edition',
        publisher: 'Queensland Government Statistician’s Office',
        url: 'https://www.qgso.qld.gov.au/issues/3071/population-growth-highlights-trends-qld-2026-edn.pdf',
        checked: '6 Oct 2026',
    },
];

export const ATTRIBUTIONS = ['State outlines: Natural Earth (public domain).'];
