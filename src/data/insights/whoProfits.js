/*
 * 009 — Who profits when you buy or sell?
 * Figures from arcadea-reels videos/009-who-profits/sources.md and
 * insights-page.md (research 13 Oct 2026).
 *
 * Before this goes live (see insights-page.md, "Before it goes live"):
 * - Legal read: the page names News Corp and REA Group, quotes a real
 *   headline and discusses a conflict of interest.
 * - Confirm Brisbane 2023 (+13.0%) against CoreLogic's 2 Jan 2024 release,
 *   or drop it from BRISBANE_YEARS and say so in the footnote.
 * - H1 FY26 figures come from secondary pages: swap in REA's own release.
 * - Company and masthead logos are used at Jayden's direction (14 Oct 2026);
 *   several are fair use on Wikipedia, so include them in the legal read.
 * - The story is "who benefits either way", never "who is to blame": keep the
 *   "no evidence of editors being told..." lines and the reader-reading framing.
 */
import { baseDetails } from './shared';

export const VIDEO = {
    youtubeId: 'a49RtqW4Xa0',
    poster: 'https://i.ytimg.com/vi/a49RtqW4Xa0/maxresdefault.jpg',
    title: 'Who profits when you buy or sell?',
    duration: '4:03',
};

// News Corp FY2026 Form 10-K
export const REA_STAKE = 62;

// News Corp's voting (Class B) shares: after the September 2025 family
// settlement, LGC Holdco holds about 33.1%, with voting control resting solely
// with Lachlan Murdoch (News Corp 8-K, Exhibit 99.1, 8 Sept 2025). Class A
// shares carry no general vote.
export const MURDOCH_VOTING = 33.1;

// The same story site, both directions. Both ran in The Courier-Mail and on
// realestate.com.au News (realestate.com.au blocks automated access; the
// December story was read via a republished copy).
export const HEADLINES = [
    {
        mood: 'Excitement',
        date: 'December 2025',
        text: 'Brisbane home prices to rise another 10pc despite rate rise fears',
        detail: "A forecast from realestate.com.au's own report: Brisbane prices to reach a record high in 2026.",
    },
    {
        mood: 'Fear',
        date: 'October 2026',
        text: 'Brisbane auction clearance rate slumps to nation-low 24pc',
        detail: 'Ray White Group data for one weekend of auctions.',
    },
];

// News Corp FY2026 segment EBITDA, US$m (Q4 FY2026 earnings release).
// Shares are of total segment EBITDA, which is after corporate costs.
export const SEGMENTS_TOTAL = 1627;
export const SEGMENTS = [
    { label: 'Digital Real Estate Services', sub: 'Property: REA Group and Move (realtor.com)', usd: 741, key: 'property' },
    { label: 'Dow Jones', sub: "The Wall Street Journal, Barron's", usd: 663 },
    { label: 'Book Publishing', sub: 'HarperCollins', usd: 287 },
    { label: 'News Media', sub: 'News Corp Australia, News UK, New York Post', usd: 139, key: 'news' },
    { label: 'Other', sub: 'Corporate costs', usd: -203 },
];
export const segmentShare = (usd) => (usd / SEGMENTS_TOTAL) * 100;

// Average Premiere+ price rises
export const PREMIERE_RISES = [
    { year: 'FY25', rise: 10 },
    { year: 'FY26', rise: 7 },
    { year: 'FY27', rise: 8, planned: true },
];

// National buy listings vs REA residential revenue: listings up, down, flat
export const LISTINGS_VS_REVENUE = [
    { period: 'FY24', listings: 7, revenue: 24, revenueAud: 'A$996m' },
    { period: 'H1 FY26', listings: -6, revenue: 7, revenueAud: 'A$658m' },
    { period: 'FY26', listings: 0, revenue: 12, revenueAud: 'A$1,290m' },
];

// Brisbane region auctions, Domain (preliminary weekly results).
// Clearance rate = sold ÷ auctions with a reported result.
export const AUCTION_WEEKS = [
    { value: 'june', label: '14–20 June', long: '14–20 June 2026', reported: 121, sold: 31 },
    { value: 'october', label: '4–10 October', long: '4–10 October 2026', reported: 155, sold: 29 },
];

// Brisbane dwellings, Cotality Home Value Index, October 2026
export const BRISBANE = {
    year: 5.9,
    fromPeak: -5.4,
    sales: -27.2,
    tenYear: 105.3,
    tenYearAnnual: 7.5, // (2.053)^(1/10) − 1 = 7.46%
};

// Brisbane dwellings, calendar-year change (CoreLogic / Cotality January releases)
export const BRISBANE_YEARS = [
    { year: '2018', change: 0.2 },
    { year: '2019', change: 0.3 },
    { year: '2020', change: 3.6 },
    { year: '2021', change: 27.4 },
    { year: '2022', change: -1.1 },
    { year: '2023', change: 13.0 }, // TODO: confirm against CoreLogic's 2 Jan 2024 release
    { year: '2024', change: 11.2 },
    { year: '2025', change: 14.5 },
    { year: '12 mths to Sep 2026', short: 'To Sep 26', change: 5.9 },
];

export const DISCLOSURE = 'Arcadea is a licensed real estate agency. Agents earn when homes sell too, so check our numbers as well.';

export const UPDATED = '14 October 2026';

export const DISCLAIMER = 'General information only. Seek independent advice. Past performance is not a reliable indicator of future performance. Figures as at 30 September 2026 unless stated.';

export const DETAILS = baseDetails({
    disclosure: DISCLOSURE,
    figures: "News Corp figures are US dollars for the year to 30 June 2026; segment shares are Arcadea's calculation from the earnings release. The Murdoch voting stake is as announced in September 2025. REA Group figures are Australian dollars for its financial years. Headlines are quoted as published; we describe how they could be read, not why they were written. Auction figures are Domain's preliminary weekly results for its Brisbane region, which includes the Gold Coast and Sunshine Coast; other providers count auctions differently. Brisbane values are Cotality's dwelling index; the 10-year annual rate is Arcadea's calculation from the 10-year change.",
});

export const SOURCES = [
    {
        title: 'News Corp FY2026 Form 10-K',
        publisher: 'News Corp, via the US SEC',
        url: 'https://www.sec.gov/Archives/edgar/data/0001564708/000156470826000175/nws-20260630.htm',
        checked: '13 Oct 2026',
    },
    {
        title: 'News Corp Form 8-K and press release on the Murdoch family settlement',
        publisher: 'News Corp, via the US SEC, 8 September 2025',
        url: 'https://www.sec.gov/Archives/edgar/data/1564708/000110465925088268/tm2521115d2_ex99-1.htm',
        checked: '14 Oct 2026',
    },
    {
        title: 'News Corp Q4 FY2026 earnings release',
        publisher: 'News Corp, via the US SEC',
        url: 'https://www.sec.gov/Archives/edgar/data/0001564708/000156470826000171/release-q4fy2026.htm',
        checked: '13 Oct 2026',
    },
    {
        title: 'REA Group FY24 results',
        publisher: 'REA Group, ASX announcement, 9 August 2024',
        url: 'https://announcements.asx.com.au/asxpdf/20240809/pdf/066g4jwslw472h.pdf',
        checked: '14 Oct 2026',
    },
    {
        title: 'REA Group FY25 results',
        publisher: 'REA Group, ASX announcement, 6 August 2025',
        url: 'https://announcements.asx.com.au/asxpdf/20250806/pdf/06mkwwcvs4r9qb.pdf',
        checked: '13 Oct 2026',
    },
    {
        title: 'REA Group ends FY26 with flat listings and double-digit yield growth',
        publisher: 'Online Marketplaces, on REA Group FY26 results, 6 August 2026',
        url: 'https://www.onlinemarketplaces.com/articles/rea-group-ends-fy26-with-flat-listings-and-double-digit-yield-growth/',
        checked: '13 Oct 2026',
    },
    {
        title: 'REA Group Appendix 4D and interim financial report, H1 FY26',
        publisher: 'REA Group, via Listcorp, 6 February 2026',
        url: 'https://www.listcorp.com/asx/rea/rea-group/news/appendix-4d-and-interim-financial-report-h1-fy26-3311154.html',
        checked: '13 Oct 2026',
    },
    {
        title: 'PropTrack Home Price Index tracker',
        publisher: 'Property Investment Professionals',
        url: 'https://propertyinvestmentprofessionals.com.au/research-insights/proptrack-home-price-index-tracker',
        checked: '13 Oct 2026',
    },
    {
        title: 'Brisbane home prices to rise another 10pc despite rate rise fears',
        publisher: 'The Courier-Mail, on realestate.com.au News, 19 December 2025',
        url: 'https://www.realestate.com.au/news/brisbane-home-prices-to-rise-another-10pc-despite-rate-rise-fears/',
        checked: '14 Oct 2026',
    },
    {
        title: 'Brisbane auction clearance rate slumps to nation-low 24pc',
        publisher: 'The Courier-Mail, on realestate.com.au News, October 2026 (Ray White Group data)',
        url: 'https://www.realestate.com.au/news/brisbane-auction-clearance-rate-slumps-to-nationlow-24pc/',
        checked: '13 Oct 2026',
    },
    {
        title: 'Brisbane auction results, 14–20 June 2026',
        publisher: 'Domain',
        url: 'https://www.domain.com.au/auction-results/brisbane/2026-06-20/',
        checked: '13 Oct 2026',
    },
    {
        title: 'Brisbane auction results, 4–10 October 2026',
        publisher: 'Domain',
        url: 'https://www.domain.com.au/auction-results/brisbane/',
        checked: '13 Oct 2026',
    },
    {
        title: 'Real estate advertising, News Corp, Nine, REA Group and Domain',
        publisher: 'Crikey, 23 September 2024',
        url: 'https://www.crikey.com.au/2024/09/23/real-estate-advertising-news-corp-nine-rea-group-domain/',
        checked: '13 Oct 2026',
    },
    {
        title: "Murdoch's News Corp has moved into the mortgage business. Where are the regulators?",
        publisher: 'The Conversation',
        url: 'https://theconversation.com/murdochs-news-corp-has-moved-into-the-mortgage-business-where-are-the-regulators-259039',
        checked: '13 Oct 2026',
    },
    {
        title: 'Home Value Index, October 2026',
        publisher: 'Cotality',
        url: 'https://discover.cotality.com/hubfs/Article-Reports/COTALITY%20HVI%20OCT%202026%20FINAL.pdf',
        checked: '13 Oct 2026',
    },
    {
        title: 'Home Value Index, January 2021 (2020 results)',
        publisher: 'CoreLogic',
        url: 'https://www.bhgre.com.au/wp-content/uploads/2021/01/CL_HVI_Jan2021.pdf',
        checked: '13 Oct 2026',
    },
    {
        title: 'Home Value Index, January 2025 (2024 results)',
        publisher: 'CoreLogic',
        url: 'https://jamiehill.com.au/wp-content/uploads/2025/01/CoreLogic-HVI-Jan-2025.pdf',
        checked: '13 Oct 2026',
    },
    {
        title: 'Home Value Index, January 2026 (2025 results)',
        publisher: 'Cotality',
        url: 'https://discover.cotality.com/hubfs/Article-Reports/COTALITY%20HVI%20Jan%202026%20FINAL.pdf',
        checked: '13 Oct 2026',
    },
];
