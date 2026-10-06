/*
 * 005 — Stamp duty: new vs established (first home buyers).
 * Arcadea's arithmetic from Queensland Revenue Office rates current at
 * October 2026 (see arcadea-reels videos/005-stamp-duty-new-vs-established/
 * sources.md). Re-check the rates before each promotion: they change.
 *
 * Duty is charged per $100, or part of $100, over each threshold. Out of
 * scope: foreign buyer additional duty, vacant land, regional grants, and
 * when duty is paid (it depends on how the transaction is lodged).
 */
import { baseDetails } from './shared';

export const VIDEO = {
    src: '/videos/insights/first-home-stamp-duty.mp4',
    poster: '/images/insights/first-home-stamp-duty-poster.jpg',
    title: 'Stamp duty: new vs established',
    duration: '1:33',
};

export const RATES_AS_AT = 'October 2026';

/** [threshold, base duty, $ per $100 over the threshold] */
const GENERAL_RATES = [
    [1000000, 38025, 5.75],
    [540000, 17325, 4.5],
    [75000, 1050, 3.5],
    [5000, 0, 1.5],
];

const HOME_CONCESSION_RATES = [
    [1000000, 30850, 5.75],
    [540000, 10150, 4.5],
    [350000, 3500, 3.5],
    [0, 0, 1.0],
];

function dutyFrom(table, value) {
    const bracket = table.find(([threshold]) => value > threshold);
    if (!bracket) return 0;
    const [threshold, base, per100] = bracket;
    return base + Math.ceil((value - threshold) / 100) * per100;
}

/** General rates: investors, new or established. */
export const investorDuty = (value) => dutyFrom(GENERAL_RATES, value);

/** Home concession rates: buying a home to live in. */
export const homeDuty = (value) => dutyFrom(HOME_CONCESSION_RATES, value);

/**
 * First home concession on an established home (contracts from 9 June 2024):
 * $17,350 off home-concession duty up to $709,999.99, then $1,735 less for
 * each $10,000 band, down to $1,735 at $790,000–$799,999.99, and nil from
 * $800,000.
 */
export function firstHomeConcession(value) {
    if (value >= 800000) return 0;
    if (value < 710000) return 17350;
    const band = Math.floor((value - 700000) / 10000);
    return 17350 - band * 1735;
}

export const firstHomeEstablishedDuty = (value) => Math.max(0, homeDuty(value) - firstHomeConcession(value));

/** First home (new home) concession: nil duty, no value cap (contracts from 1 May 2025). */
export const firstHomeNewDuty = () => 0;

export const GRANT = { amount: 30000, under: 750000 };

export const BUYERS = [
    { key: 'investor', label: 'Investor', sub: 'New or established', duty: investorDuty },
    { key: 'home', label: 'Home buyer', sub: 'Not a first home', duty: homeDuty },
    { key: 'fhbEst', label: 'First home buyer', sub: 'Established home', duty: firstHomeEstablishedDuty },
    { key: 'fhbNew', label: 'First home buyer', sub: 'New home', duty: firstHomeNewDuty },
];

// The four prices in the video's comparison table
export const PRESETS = [650000, 750000, 850000, 1200000];

export const PRICE_RANGE = { min: 400000, max: 1500000, step: 10000 };

export const DISCLOSURE = 'Arcadea markets new property in Queensland and may benefit.';

export const UPDATED = '6 October 2026';

export const DISCLAIMER = `Illustrative only. General information, not financial, tax or legal advice. Duty figures are Arcadea's arithmetic from Queensland Revenue Office rates at ${RATES_AS_AT}; rates and concessions change, and your duty depends on your circumstances. Check with the QRO or your conveyancer before you buy.`;

export const DETAILS = baseDetails({
    disclosure: DISCLOSURE,
    figures: `Duty is calculated from the Queensland Revenue Office's published general rates, home concession rates and first home concession table at ${RATES_AS_AT}, rounding each part of $100 up. "Home buyer" means a home concession buyer who will live in the home. The figures don't cover foreign buyer additional duty, vacant land, or every eligibility rule, and nothing here says when duty is paid.`,
});

export const SOURCES = [
    {
        title: 'Transfer duty rates',
        publisher: 'Queensland Revenue Office (updated 25 Jun 2026)',
        url: 'https://qro.qld.gov.au/duties/transfer-duty/calculate/rates/',
        checked: '6 Oct 2026',
    },
    {
        title: 'Home concession rates and first home concession',
        publisher: 'Queensland Revenue Office (updated 31 Jul 2026)',
        url: 'https://qro.qld.gov.au/duties/transfer-duty/calculate/concession-rates/',
        checked: '6 Oct 2026',
    },
    {
        title: 'First home (new home) concession',
        publisher: 'Queensland Revenue Office (31 Jul 2026)',
        url: 'https://qro.qld.gov.au/duties/transfer-duty/concessions/homes/first-home-new-home/',
        checked: '6 Oct 2026',
    },
    {
        title: 'First Home Owner Grant: eligibility',
        publisher: 'Queensland Revenue Office (updated 5 Aug 2026)',
        url: 'https://qro.qld.gov.au/property-concessions-grants/first-home-grant/eligibility/',
        checked: '6 Oct 2026',
    },
];
