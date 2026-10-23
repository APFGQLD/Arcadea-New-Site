/*
 * 010 — Same number, different fear.
 * Figures from arcadea-reels videos/010-same-dip/sources.md and the page
 * brief in insights-page.md.
 *
 * A property article: the Dow appears once (section 4) as a reference point
 * for how the same number feels. Keep shares to that section, and never say
 * or imply property is the better investment.
 *
 * Still open from the brief:
 * - confirm the 2022–23 fall (−8.9%, January 2023 trough, October 2023
 *   record) against CoreLogic's own November 2023 release
 * - confirm 2023 (+13.0%, behind the Dec 2023 point) against the
 *   2 January 2024 release
 * - swap the Dow and AUD/USD figures (Yahoo Finance) for S&P Dow Jones
 *   Indices and RBA table F11
 */
import { baseDetails } from './shared';

// A YouTube Short, so it plays in the 9:16 reel frame
export const VIDEO = {
    youtubeId: 'PdcjCKr4Vn4',
    vertical: true,
    poster: 'https://i.ytimg.com/vi/PdcjCKr4Vn4/hqdefault.jpg',
    title: 'Same number, different fear',
    duration: '1:13',
};

// Cotality Home Value Index, October 2026 (results to 30 Sept 2026)
export const FROM_PEAK = -5.4; // % below the May 2026 peak
export const FIVE_YEARS = 55.4; // % change, 30 Sept 2021 to 30 Sept 2026
export const RENTS = { houses: 6.7, units: 5.9 }; // % change, year to Sept 2026
export const YIELD = 3.5; // gross rental yield, dwellings

// Brisbane dwelling values, Sept 2021 = 100. Worked back from the Oct 2026
// release with the calendar-year changes from each January release. The
// points aren't evenly spaced in time.
export const BRISBANE_INDEX = [
    { label: 'Sep 2021', index: 100 },
    { label: 'Dec 2021', index: 109.1 },
    { label: 'Dec 2022', index: 107.9 },
    { label: 'Dec 2023', index: 121.9 },
    { label: 'Dec 2024', index: 135.6 },
    { label: 'Dec 2025', index: 155.2 },
    { label: 'May 2026', index: 164.3, note: 'Peak' },
    { label: 'Jun 2026', index: 163.1 },
    { label: 'Aug 2026', index: 157.8 },
    { label: 'Sep 2026', index: 155.4 },
];

// CoreLogic monthly index, November 2023 release
export const PAST_FALL = -8.9; // % from the June 2022 peak to January 2023

// Dow Jones Industrial Average, price only, 30 Sept 2021 to 30 Sept 2026:
// 33,843.92 → 50,906.05 (+50.4% US$), × (0.7180 ÷ 0.6989) AUD/USD = +54.5% A$
export const DOW_AUD = 54.5;

// Illustrative leverage example
export const HOME_PRICE = 800000;
export const DEPOSIT_SHARE = 0.2;
export const FALL = 0.05;

export const DISCLOSURE = 'Arcadea markets new property in Queensland and may benefit.';

export const UPDATED = '23 October 2026';

export const DISCLAIMER = 'General information only. Seek independent advice. Past performance is not a reliable indicator of future performance. Value comparisons are price change only; they exclude rent, dividends and costs. Figures as at 30 September 2026 unless stated.';

export const DETAILS = baseDetails({
    disclosure: DISCLOSURE,
    figures: "Brisbane figures are Cotality's (formerly CoreLogic) Home Value Index for dwellings, to 30 September 2026. The five-year chart is worked back from the October 2026 release using each year's published calendar-year change, so its points are year-ends plus 2026 months, not evenly spaced, and they hide 2022's mid-year peak and trough. The Dow Jones is the index's closing price on 30 September 2021 and 2026, converted to Australian dollars at the AUD/USD rate on each date. Both are price changes only: rent, dividends, purchase and holding costs aren't counted. The deposit example is Arcadea's arithmetic, not a market figure.",
});

export const SOURCES = [
    {
        title: 'Home Value Index, October 2026',
        publisher: 'Cotality',
        url: 'https://discover.cotality.com/hubfs/Article-Reports/COTALITY%20HVI%20OCT%202026%20FINAL.pdf',
        checked: '23 Oct 2026',
    },
    {
        title: 'Home Value Index, November 2023 (Brisbane’s 2022–23 fall and record high), as reported',
        publisher: 'CoreLogic, via The Expatriate',
        url: 'https://www.theexpatriate.com.au/expat-property-news/corelogic-market-update-october-home-value-index-hvi-report-1st-november-2023',
        checked: '23 Oct 2026',
    },
    {
        title: 'Home Value Index, January 2026 (calendar-year changes)',
        publisher: 'Cotality',
        url: 'https://discover.cotality.com/hubfs/Article-Reports/COTALITY%20HVI%20Jan%202026%20FINAL.pdf',
        checked: '13 Oct 2026',
    },
    {
        title: 'Home Value Index, January 2025 (calendar-year changes)',
        publisher: 'CoreLogic',
        url: 'https://jamiehill.com.au/wp-content/uploads/2025/01/CoreLogic-HVI-Jan-2025.pdf',
        checked: '13 Oct 2026',
    },
    {
        title: 'Home Value Index, January 2023 (calendar-year changes)',
        publisher: 'CoreLogic',
        url: 'https://www.bhgre.com.au/wp-content/uploads/2023/01/CL_HVI_Jan2023.pdf',
        checked: '13 Oct 2026',
    },
    {
        title: 'Dow Jones Industrial Average, daily closes',
        publisher: 'Yahoo Finance',
        url: 'https://finance.yahoo.com/quote/%5EDJI/history/',
        checked: '23 Oct 2026',
    },
    {
        title: 'Exchange rates (table F11)',
        publisher: 'Reserve Bank of Australia',
        url: 'https://www.rba.gov.au/statistics/historical-data.html#exchange-rates',
        checked: '23 Oct 2026',
    },
];
