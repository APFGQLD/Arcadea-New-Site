/*
 * Content + chart data for the "New vs Established on the Gold Coast"
 * showcase page. Every figure is transcribed from the page brief, which in
 * turn comes from the full report — change numbers there first, then here.
 *
 * Returns are after-tax annual IRR on the investor's own cash, 9-year hold,
 * unless stated. irr39 / irr47 = investor's marginal rate incl. Medicare.
 */

// Direct-download link to the report PDF on Google Drive (the file must stay
// shared as "Anyone with the link"). While null, the download button renders
// disabled with an "available soon" note.
export const REPORT_URL = 'https://drive.google.com/uc?export=download&id=1YUnUA1fyfHu3XbUzeqcNn7b-426-ALPR';
export const REPORT_TITLE =
    'New vs Established Investment Property on the Gold Coast After the 2026 Tax Reforms';

export const PRODUCTS = [
    'Established apartment',
    'New off-the-plan apartment',
    'Established house',
    'New house-and-land',
];

export const SHORT_LABEL = {
    'Established apartment': 'Est. apartment',
    'New off-the-plan apartment': 'Off-the-plan apt',
    'Established house': 'Est. house',
    'New house-and-land': 'House-and-land',
};

export const HERO_STATS = [
    {
        // Rendered as "$208k–$282k"
        from: 208, to: 282, prefix: '$', suffix: 'k',
        label: 'Modelled 9-year tax refunds on a new $1.6M apartment, against $17k–$23k for an established one',
        footnote: '39% / 47% taxpayer',
    },
    {
        from: 118, to: 184, prefix: '+$', suffix: 'k',
        label: 'Extra modelled profit from a new off-the-plan unit over an established unit, same $1.6M budget',
        footnote: '9-year hold after settlement',
    },
    {
        to: 226, prefix: '$', suffix: 'k',
        label: 'Modelled value growth during a 3-year build on a $1.6M unit, secured with a $160k deposit',
        footnote: 'At 4.5% a year; not guaranteed',
    },
];

export const KEY_MESSAGES = [
    {
        icon: 'shield',
        title: 'New builds keep negative gearing',
        body: 'From 1 July 2027, established properties bought after Budget night lose negative gearing against salary. Eligible new builds keep it, with no end date.',
    },
    {
        icon: 'lock',
        title: "Lock in today's price",
        body: "Off-the-plan buyers secure today's price with a 10% deposit and hold the unit through the build. In a rising market, the growth before settlement is theirs.",
    },
    {
        icon: 'receipt',
        title: "Depreciation you can't get on second-hand",
        body: "Brand-new buyers claim full plant and equipment depreciation. Second-hand residential buyers haven't been able to since 2017.",
    },
    {
        icon: 'trending',
        title: 'New beats established for apartment buyers',
        body: 'At a $1.6M budget, a new off-the-plan unit returned 5.6%–6.8% a year in our model, against 3.9%–4.0% for an established unit.',
    },
    {
        icon: 'torch',
        title: 'An Olympic city, a building boom',
        body: 'The Gold Coast co-hosts the 2032 Games, with a new arena planned in Southport and venues in Broadbeach. Contracts signed now settle around 2029.',
    },
];

/* ---------- Chart 1 + Chart 4: returns by budget ---------- */
export const RETURNS_BY_BUDGET = [
    { budget: 1200000, product: 'Established apartment', irr39: 3.9, irr47: 4.0, profit39: 173890, profit47: 177593 },
    { budget: 1200000, product: 'New off-the-plan apartment', irr39: 5.7, irr47: 6.8, profit39: 265193, profit47: 314844 },
    { budget: 1200000, product: 'Established house', irr39: 7.4, irr47: 7.5, profit39: 359009, profit47: 359656 },
    { budget: 1200000, product: 'New house-and-land', irr39: 6.7, irr47: 7.8, profit39: 291410, profit47: 334927 },
    { budget: 1600000, product: 'Established apartment', irr39: 3.9, irr47: 4.0, profit39: 229138, profit47: 234635 },
    { budget: 1600000, product: 'New off-the-plan apartment', irr39: 5.6, irr47: 6.8, profit39: 347486, profit47: 418764 },
    { budget: 1600000, product: 'Established house', irr39: 7.1, irr47: 7.2, profit39: 461417, profit47: 465339 },
    { budget: 1600000, product: 'New house-and-land', irr39: 6.4, irr47: 7.6, profit39: 370010, profit47: 436697 },
    { budget: 2000000, product: 'Established apartment', irr39: 3.8, irr47: 3.9, profit39: 284385, profit47: 291678 },
    { budget: 2000000, product: 'New off-the-plan apartment', irr39: 5.5, irr47: 6.6, profit39: 429779, profit47: 514473 },
    { budget: 2000000, product: 'Established house', irr39: 6.7, irr47: 6.9, profit39: 551859, profit47: 558183 },
    { budget: 2000000, product: 'New house-and-land', irr39: 6.1, irr47: 7.3, profit39: 444187, profit47: 527318 },
];

export const BUDGETS = [1200000, 1600000, 2000000];

/* ---------- Chart 2: off-the-plan leverage ---------- */
export const LEVERAGE_SERIES = [
    { key: 'grows', label: 'Market grows 4.5% a year', values: [1600000, 1672000, 1747240, 1825866] },
    { key: 'flat', label: 'Market flat', values: [1600000, 1600000, 1600000, 1600000] },
    { key: 'falls', label: 'Market falls 3% a year', values: [1600000, 1552000, 1505440, 1460277] },
];
export const LEVERAGE_YEARS = [2026, 2027, 2028, 2029];

/* ---------- Chart 3: tax refunds vs CGT ---------- */
export const TAX_PICTURE = [
    { product: 'Established apartment', refunds39: 17212, refunds47: 22709, cgt39: 0, cgt47: 0 },
    { product: 'New off-the-plan apartment', refunds39: 207942, refunds47: 281620, cgt39: 209434, cgt47: 211834 },
    { product: 'Established house', refunds39: 15127, refunds47: 19647, cgt39: 2917, cgt47: 3515 },
    { product: 'New house-and-land', refunds39: 196827, refunds47: 265914, cgt39: 200347, cgt47: 202747 },
];

/* ---------- Chart 5: Olympic host cities ---------- */
export const OLYMPIC_CITIES = [
    { host: 'Barcelona', games: 1992, hostGrowth: 131, comparison: 'Spain', comparisonGrowth: 83 },
    { host: 'Homebush', hostNote: 'next to Sydney Olympic Park', games: 2000, hostGrowth: 70, comparison: 'Sydney', comparisonGrowth: 50 },
];

/* ---------- Chart 6: 2032 run-up scenarios ---------- */
export const SCENARIOS = [
    { key: 'Base case', definition: 'Long-run growth assumptions, as in the charts above. Modelled on a 9-year hold only.' },
    { key: 'Run-up then flat', definition: 'Units grow 8% and houses 7% a year until the Games, then 1% a year for 3 years, then long-run growth.' },
    { key: 'Run-up then dip', definition: 'The same run-up, then prices fall 5% a year (units) or 3% (houses) for 2 years.' },
];

export const SCENARIO_RETURNS = [
    { scenario: 'Base case', hold: 9, product: 'Established apartment', irr39: 3.9, irr47: 4.0 },
    { scenario: 'Base case', hold: 9, product: 'New off-the-plan apartment', irr39: 5.6, irr47: 6.8 },
    { scenario: 'Base case', hold: 9, product: 'Established house', irr39: 7.1, irr47: 7.2 },
    { scenario: 'Base case', hold: 9, product: 'New house-and-land', irr39: 6.4, irr47: 7.6 },
    { scenario: 'Run-up then flat', hold: 9, product: 'Established apartment', irr39: 6.9, irr47: 7.0 },
    { scenario: 'Run-up then flat', hold: 9, product: 'New off-the-plan apartment', irr39: 7.7, irr47: 8.8 },
    { scenario: 'Run-up then flat', hold: 9, product: 'Established house', irr39: 5.7, irr47: 5.8 },
    { scenario: 'Run-up then flat', hold: 9, product: 'New house-and-land', irr39: 6.3, irr47: 7.5 },
    { scenario: 'Run-up then dip', hold: 9, product: 'Established apartment', irr39: 4.1, irr47: 4.2 },
    { scenario: 'Run-up then dip', hold: 9, product: 'New off-the-plan apartment', irr39: 5.7, irr47: 6.9 },
    { scenario: 'Run-up then dip', hold: 9, product: 'Established house', irr39: 4.5, irr47: 4.5 },
    { scenario: 'Run-up then dip', hold: 9, product: 'New house-and-land', irr39: 5.6, irr47: 6.8 },
    { scenario: 'Run-up then flat', hold: 4, product: 'Established apartment', irr39: 10.4, irr47: 10.6 },
    { scenario: 'Run-up then flat', hold: 4, product: 'New off-the-plan apartment', irr39: 12.5, irr47: 13.6 },
    { scenario: 'Run-up then flat', hold: 4, product: 'Established house', irr39: 9.2, irr47: 9.4 },
    { scenario: 'Run-up then flat', hold: 4, product: 'New house-and-land', irr39: 9.0, irr47: 10.4 },
    { scenario: 'Run-up then dip', hold: 4, product: 'Established apartment', irr39: 10.4, irr47: 10.6 },
    { scenario: 'Run-up then dip', hold: 4, product: 'New off-the-plan apartment', irr39: 9.6, irr47: 10.7 },
    { scenario: 'Run-up then dip', hold: 4, product: 'Established house', irr39: 9.2, irr47: 9.4 },
    { scenario: 'Run-up then dip', hold: 4, product: 'New house-and-land', irr39: 9.0, irr47: 10.4 },
];

export const RISKS = [
    { title: "Growth isn't guaranteed.", body: "If prices don't rise during the build, a new unit's modelled return falls from 5.6% to 3.4% (39% taxpayer), below an established unit." },
    { title: 'Settlement valuations can fall short.', body: 'Lenders lend on the lower of price or valuation, so a fall during the build means more cash at settlement.' },
    { title: 'Some value is lost at resale.', body: 'The next buyer of a former new build gets neither negative gearing nor the 50% CGT discount; our models assume an 8% discount on resale.' },
    { title: 'Stamp duty may fall due at contract.', body: 'Queensland duty is usually assessed from the contract date; confirm timing with your conveyancer.' },
    { title: 'High-rise has no home warranty cover.', body: 'The Queensland Home Warranty Scheme excludes apartment buildings over 3 storeys.' },
    { title: 'Levies can rise.', body: 'Body corporate levies set before completion often increase in the first few years.' },
];

export const FAQS = [
    {
        q: 'What changed in 2026?',
        a: 'From 1 July 2027, rental losses on established residential property bought after 12 May 2026 can only be offset against residential property income and gains, not salary. Eligible new builds keep full negative gearing. The 50% CGT discount is replaced by inflation indexation, and new-build investors can choose whichever gives the lower tax.',
    },
    {
        q: 'Do I still get negative gearing on a new apartment?',
        a: 'Yes, if it qualifies as a new build that adds to housing supply, such as an off-the-plan apartment. The final definition sits in legislation that is not yet law, so it could still change.',
    },
    {
        q: 'Why does buying off-the-plan help returns?',
        a: "You secure today's price with a 10% deposit. If values rise during the build, that growth is yours when the unit settles, and you claim full depreciation on a brand-new asset.",
    },
    {
        q: 'Are houses a better investment than apartments?',
        a: 'In our base case, houses return more for most investors, because land drives growth. For top-bracket investors, a new off-the-plan unit sits within about a point of the best house result, and it moves ahead of the established house if values grow faster than about 5.2% a year during the build.',
    },
    {
        q: 'How long should I hold?',
        a: 'The typical Australian resale is held about 9 years, which is what we model. Short holds of around 4 years magnify stamp duty, selling costs and any resale discount.',
    },
    {
        q: 'Will the 2032 Olympics lift prices?',
        a: "Past host cities show pre-Games rises are common but inconsistent, and concentrated near venues and new infrastructure. It's a potential tailwind, not a guarantee.",
    },
];

export const DISCLAIMER =
    'This page contains general information only and does not take into account your objectives, financial situation or needs. It is not financial, tax or legal advice. All returns shown are modelled scenarios based on stated assumptions, including growth rates, interest rates, rents and costs, and are not forecasts or guarantees of future performance. Property values can fall as well as rise. The 2026 tax reforms are partly subject to legislation that is not yet law. Seek independent financial, tax and legal advice before making any investment decision.';

// Fuller disclaimer shown at the bottom of the page, after the short
// DISCLAIMER paragraph above. Have this reviewed alongside the rest of the
// page before it goes live — in particular "Our interest", which should
// reflect how Arcadea is actually paid.
export const DISCLAIMER_UPDATED = '29 September 2026';

export const DISCLAIMER_DETAILS = [
    {
        title: 'General information, not personal advice',
        body: "Nothing on this page is a recommendation to buy, sell or hold any property or financial product. It doesn't take into account your objectives, financial situation or needs, so consider whether it's appropriate for you before acting on it.",
    },
    {
        title: 'How the figures were modelled',
        body: 'All returns, refunds, profits and values are outputs of a financial model, not actual results. Unless stated, they assume an 80% loan, interest-only at 6.75%, a 9-year hold after settlement, the report\'s growth, rent and cost assumptions, marginal tax rates of 39% or 47% including Medicare, and an 8% discount when a former new build is resold. Change any assumption and the results change, sometimes significantly.',
    },
    {
        title: 'Not a forecast or guarantee',
        body: 'Property values, rents, interest rates and costs can move against you. Values can fall, including during an off-the-plan build, which can mean more cash is needed at settlement. Scenarios labelled illustrative are examples, not predictions.',
    },
    {
        title: 'Tax and the law can change',
        body: 'The 2026 negative gearing and CGT reforms are partly subject to legislation that is not yet law, and the final definition of an eligible new build could change. Your tax outcome depends on your own circumstances. Queensland duty, home warranty and body corporate rules are summarised here, not stated in full.',
    },
    {
        title: 'Past performance',
        body: 'Historical figures, including price growth in past Olympic host cities, are not a reliable indicator of future performance and are not a forecast for the Gold Coast.',
    },
    {
        title: 'Our interest',
        body: 'Arcadea Property markets new and off-the-plan residential property, including projects shown on this website, and may benefit if you buy one. Please keep this in mind when reading this page.',
    },
    {
        title: 'Accuracy and third-party sources',
        body: "We've taken care preparing this page, but we don't guarantee it is complete, accurate or current, and we may not update it. Third-party sources are listed for reference only; we don't control or endorse them. To the extent permitted by law, Arcadea Property accepts no liability for any loss arising from reliance on this information.",
    },
    {
        title: 'Get independent advice',
        body: 'Before making any decision, speak with a licensed financial adviser, a registered tax agent, a solicitor or conveyancer, and a mortgage broker or lender about your own situation.',
    },
];

export const SOURCES = [
    { title: 'Tax explainers: negative gearing and capital gains tax', publisher: 'Budget 2026–27 factsheet', url: 'https://budget.gov.au/content/factsheets/download/tax-explainers-negative-gearing-capital-gains-tax.pdf' },
    { title: 'Negative gearing and CGT bill pass parliament', publisher: 'Smart Property Investment', url: 'https://www.smartpropertyinvestment.com.au/tax-and-legal/27889-negative-gearing-and-cgt-bill-pass-parliament' },
    { title: 'Transfer duty', publisher: 'Queensland Revenue Office', url: 'https://qro.qld.gov.au/duties/transfer-duty/' },
    { title: 'Understanding the Queensland Home Warranty Scheme', publisher: 'QBCC', url: 'https://www.qbcc.qld.gov.au/news/understanding-queensland-home-warranty-scheme-guide-property-owners' },
    { title: 'Cotality Pain & Gain report coverage', publisher: 'PropertyUpdate', url: 'https://propertyupdate.com.au/housing-resale-profits-retreat-from-record-as-downturn-begins-to-bite-latest-cotality-pain-gain-report/' },
    { title: 'House prices go for gold in Olympic host cities', publisher: 'Mortgage Strategy', url: 'https://www.mortgagestrategy.co.uk/news/house-prices-go-for-gold-in-olympic-host-cities/' },
    { title: 'Hosting the Olympics: a win for the housing market?', publisher: 'YourMoney', url: 'https://www.yourmoney.com/investing/hosting-the-olympics-a-win-for-the-housing-market/' },
    { title: 'The anticipated legacies of mega sporting events', publisher: 'Applied Economics (Taylor & Francis)', url: 'https://www.tandfonline.com/doi/full/10.1080/00036846.2022.2118223' },
    { title: "How do the Olympic Games impact your home's value?", publisher: 'Strategic Property Analytics', url: 'https://www.strategicpropertyanalytics.com/blog/looking-under-the-hood-126-how-do-the-olympic-games-impact-your-home-s-value' },
    { title: 'Olympic and Paralympic Games Brisbane 2032', publisher: 'City of Gold Coast', url: 'https://www.goldcoast.qld.gov.au/Invest-do-business/Olympic-and-Paralympic-Games-Brisbane-2032' },
];
