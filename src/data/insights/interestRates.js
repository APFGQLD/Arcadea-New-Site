/*
 * 006 — Four years of rates, one repayment.
 * Figures from arcadea-reels videos/006-four-years-of-rates/sources.md.
 *
 * Closest of the six pages to financial advice: keep "Illustrative only. Not
 * financial advice. Speak to a lender or broker." prominent, and nothing on
 * where rates go next. When the RBA's F6 table adds August and September,
 * update MORTGAGE_RATE_NOW (6.24%, July 2026) or keep it clearly dated.
 */
import { baseDetails } from './shared';

export const VIDEO = {
    src: '/videos/insights/interest-rates-repayments.mp4',
    poster: '/images/insights/interest-rates-repayments-poster.jpg',
    title: 'Four years of rates, one repayment',
    duration: '1:21',
};

// RBA cash rate target at the end of each quarter, Mar 2022 to Sep 2026
export const CASH_RATE = [
    { q: 'Mar 2022', rate: 0.1 },
    { q: 'Jun 2022', rate: 0.85 },
    { q: 'Sep 2022', rate: 2.35 },
    { q: 'Dec 2022', rate: 3.1 },
    { q: 'Mar 2023', rate: 3.6 },
    { q: 'Jun 2023', rate: 4.1 },
    { q: 'Sep 2023', rate: 4.1 },
    { q: 'Dec 2023', rate: 4.35 },
    { q: 'Mar 2024', rate: 4.35 },
    { q: 'Jun 2024', rate: 4.35 },
    { q: 'Sep 2024', rate: 4.35 },
    { q: 'Dec 2024', rate: 4.35 },
    { q: 'Mar 2025', rate: 4.1 },
    { q: 'Jun 2025', rate: 3.85 },
    { q: 'Sep 2025', rate: 3.6 },
    { q: 'Dec 2025', rate: 3.6 },
    { q: 'Mar 2026', rate: 4.1 },
    { q: 'Jun 2026', rate: 4.35 },
    { q: 'Sep 2026', rate: 4.6 },
];

// Cash rate decisions by year: 17 rises, 3 cuts
export const MOVES = [
    { year: '2022', rises: 8, cuts: 0, note: 'May to December' },
    { year: '2023', rises: 5, cuts: 0, note: 'To 4.35% in November' },
    { year: '2024', rises: 0, cuts: 0, note: 'Held at 4.35%' },
    { year: '2025', rises: 0, cuts: 3, note: 'February, May, August' },
    { year: '2026', rises: 4, cuts: 0, note: 'To 4.60% on 30 September' },
];

// Average variable owner-occupier rate, outstanding loans (RBA table F6)
export const MORTGAGE_RATE_THEN = { label: 'April 2022', rate: 2.86 };
export const MORTGAGE_RATE_NOW = { label: 'July 2026', rate: 6.24 };
export const SEPTEMBER_RISE = 0.25;
export const BUFFER = 3; // APRA serviceability buffer, percentage points

export const LOANS = [500000, 600000, 750000];
export const TERM_YEARS = 30;

/** Monthly principal-and-interest repayment on a new loan (unrounded). */
export function monthlyRepayment(loan, ratePct, years = TERM_YEARS) {
    const r = ratePct / 1200;
    const n = years * 12;
    return (loan * r) / (1 - Math.pow(1 + r, -n));
}

export const DISCLOSURE = 'Arcadea markets new property in Queensland and may benefit.';

export const UPDATED = '6 October 2026';

export const DISCLAIMER = 'Illustrative only. Not financial advice. Speak to a lender or broker. Repayments are for a new 30-year principal-and-interest loan at each rate; your repayment depends on your loan, balance, remaining term and lender. Nothing here is a forecast of interest rates.';

export const DETAILS = baseDetails({
    disclosure: DISCLOSURE,
    figures: 'Cash rate figures are the RBA\'s cash rate target. Mortgage rates are the RBA\'s average variable rate on outstanding owner-occupier loans (table F6), which runs a couple of months behind: the July 2026 figure is before September\'s rise. Repayments are Arcadea\'s calculation using the standard loan repayment formula, monthly, for a new loan; differences are calculated before rounding.',
});

export const SOURCES = [
    {
        title: 'Cash rate target',
        publisher: 'Reserve Bank of Australia',
        url: 'https://www.rba.gov.au/statistics/cash-rate/',
        checked: '6 Oct 2026',
    },
    {
        title: 'Statistical table F6: housing lending rates',
        publisher: 'Reserve Bank of Australia',
        url: 'https://www.rba.gov.au/statistics/tables/xls/f06hist.xlsx',
        checked: '6 Oct 2026',
    },
    {
        title: 'APRA maintains current macroprudential policy settings',
        publisher: 'Australian Prudential Regulation Authority, 28 May 2026',
        url: 'https://www.apra.gov.au/news-and-publications/apra-maintains-current-macroprudential-policy-settings-highly-uncertain',
        checked: '6 Oct 2026',
    },
];
