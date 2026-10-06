/*
 * 002 — Defence housing in Townsville.
 * Figures from arcadea-reels videos/002-defence-housing-townsville/sources.md.
 *
 * Kept off this page on purpose (see the overview doc): Singapore troops
 * living in investment properties (not supported), "5.7%++" yields, "no
 * maintenance", migration claims over 100,000 or "#1 for overseas
 * migration", superlatives, and vacancy rates without a current REIQ figure.
 */
import { GENERAL_ADVICE, baseDetails } from './shared';

export const VIDEO = {
    src: '/videos/insights/defence-housing-townsville.mp4',
    poster: '/images/insights/defence-housing-townsville-poster.jpg',
    title: 'Defence housing in Townsville',
    duration: '1:25',
};

// Illustrative weekly rent from the video (not a specific property)
export const EXAMPLE_RENT = 600;

export const FEES = [
    { value: 16.5, label: '16.5% · most houses' },
    { value: 13, label: '13% · with a body corporate' },
];

// TODO before go-live: confirm this wording (overview doc, "Still to check")
export const DISCLOSURE = 'Arcadea sells DHA-leased property and may benefit.';

export const UPDATED = '6 October 2026';

export const DISCLAIMER = `${GENERAL_ADVICE} The rent and fee example is illustrative, not a specific property. DHA's lease terms, fees and the owner's costs are summarised from DHA's published information; the lease itself sets out the detail.`;

export const DETAILS = baseDetails({
    disclosure: DISCLOSURE,
    figures: "Defence and DHA figures are as published by the Minister for Defence Personnel, the Queensland Government and Defence Housing Australia, checked on the dates shown in the sources. The migration figure is the ABS's estimate for the year to 31 March 2026, which may be revised. The $600 a week example is simple arithmetic on an illustrative rent.",
});

export const SOURCES = [
    {
        title: '400 new homes to be delivered for Defence personnel in Townsville',
        publisher: 'Minister for Defence Personnel, media release, 3 Dec 2024',
        url: 'https://www.minister.defence.gov.au/media-releases/2024-12-03/400-new-homes-be-delivered-defence-personnel-townsville',
        checked: '2 Oct 2026',
    },
    {
        title: 'Defence Jobs Queensland: Facilities',
        publisher: 'Queensland Government',
        url: 'https://www.defenceindustries.qld.gov.au/land/facilities',
        checked: '2 Oct 2026',
    },
    {
        title: 'Spotlight on Townsville, QLD',
        publisher: 'Defence Housing Australia',
        url: 'https://www.dha.gov.au/investing/investor-resources/investor-news/spotlight-townsville-qld',
        checked: '2 Oct 2026',
    },
    {
        title: 'Lease your property to DHA',
        publisher: 'Defence Housing Australia',
        url: 'https://www.dha.gov.au/investing/how-to-invest/lease-your-property-to-dha',
        checked: '2 Oct 2026',
    },
    {
        title: 'Guaranteed rent',
        publisher: 'Defence Housing Australia',
        url: 'https://www.dha.gov.au/investing/why-invest-with-dha/guaranteed-rent',
        checked: '2 Oct 2026',
    },
    {
        title: 'Long-term rental lease',
        publisher: 'Defence Housing Australia',
        url: 'https://www.dha.gov.au/investing/long-term-rental-lease',
        checked: '2 Oct 2026',
    },
    {
        title: 'Service fee',
        publisher: 'Defence Housing Australia',
        url: 'https://www.dha.gov.au/investing/benefits-of-investing/service-fee',
        checked: '2 Oct 2026',
    },
    {
        title: 'Investor frequently asked questions',
        publisher: 'Defence Housing Australia',
        url: 'https://www.dha.gov.au/investing/investor-resources/investor-frequently-asked-questions',
        checked: '2 Oct 2026',
    },
    {
        title: 'National, state and territory population, March 2026',
        publisher: 'Australian Bureau of Statistics, released 17 Sep 2026',
        url: 'https://www.abs.gov.au/statistics/people/population/national-state-and-territory-population/latest-release',
        checked: '6 Oct 2026',
    },
];
