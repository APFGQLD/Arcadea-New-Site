/*
 * Copy and figures for /campaigns/commercial-industrial, transcribed from
 * LANDING-PAGE-BRIEF.md (the "7 Reasons Why Industrial Property Is the Best
 * Investment" deck). Change numbers there first, then here.
 *
 * Compliance (Arcadea holds no AFSL):
 * - General information only. "can", "may", "potentially", "where eligible".
 * - Commercial vs residential property only: never shares, bonds, funds or
 *   any other financial product.
 * - Scenarios carry "Illustrative only" and their assumptions.
 * - Every statistic has a source and a date.
 * - Research logos are attribution ("Sources"), never endorsement.
 * - The three press headlines marked unverified in the deck (CBRE 16 Oct
 *   2026, The Australian 8 Sep 2026, JLL 29 Sep 2026) are left out until
 *   they're confirmed.
 *
 * Before launch:
 * - BOOKING_URL, CONTACT.phone: still placeholders.
 * - Three "Who's driving demand" cards use AI-generated placeholder photos
 *   (files named *-PLACEHOLDER): replace with real project photography.
 */

export const UPDATED = '26 November 2026';

/** Set to the Calendly / Cal.com link when it's ready; the page then shows the booking embed. */
export const BOOKING_URL = '';

export const CONTACT = {
    email: 'info@arcadea.com.au',
    // TODO: confirm the number for campaign enquiries. Hidden while empty.
    phone: '',
};

export const PRICE = { from: 399000, to: 999000 };

/* ------------------------------------------------------------------ */
/*  Images                                                              */
/* ------------------------------------------------------------------ */

const DIR = '/images/campaigns/commercial-industrial';

/** { name, widths } → the props <Photo> needs (built by scripts/build-campaign-images.js). */
const img = (name, widths, alt, position) => ({ name: `${DIR}/${name}`, widths, alt, position });
const PHOTO = [640, 1024, 1600];
const TILE = [480, 800];

export const IMAGES = {
    hero: img('hero', [800, 1200, 1536], '', '50% 55%'),
    townhouses: img('residential-townhouses', PHOTO, 'A row of new residential townhouses'),
    forSale: img('residential-for-sale', PHOTO, 'A "for sale" sign outside a house'),
    businessOwner: img('business-owner', PHOTO, 'A business owner standing inside their warehouse'),
};

/* ------------------------------------------------------------------ */
/*  Hero                                                                */
/* ------------------------------------------------------------------ */

export const HERO_STATS = [
    { value: '5–8%', label: 'Indicative rental yields' },
    { value: '3–5 yrs', label: 'Typical commercial lease terms' },
    { value: 'SMSF', label: 'Superannuation investment opportunities' },
    { value: 'Net leases', label: 'Tenant-funded outgoings, where recoverable' },
];

/* ------------------------------------------------------------------ */
/*  01 The shift in residential                                         */
/* ------------------------------------------------------------------ */

export const POLICY_CHANGES = [
    {
        title: 'Negative gearing',
        body: 'From 1 July 2027, negative gearing is restricted to new residential builds. Holdings in place at the Budget announcement are grandfathered.',
    },
    {
        title: 'SMSF borrowing',
        body: 'New restrictions apply to borrowing for residential property inside an SMSF.',
    },
    {
        title: 'Capital gains tax',
        body: 'The 50% discount is replaced by inflation indexation and a 30% minimum tax for affected investors. This applies to commercial assets too, not just housing.',
    },
];

export const KPMG_FORECASTS = [
    { label: 'National, 2026', value: '−1.1%' },
    { label: 'Sydney, 2026', value: '−4.4%' },
    { label: 'Melbourne, 2026', value: '−5.0%' },
    { label: 'National, 2027', value: '+3.4%' },
];

export const DOWNTURN = [
    { value: '−6.7%', label: 'National dwelling values since March' },
    { value: '−$63,400', label: 'Fall in the median Australian dwelling value' },
    { value: '−8.1%', label: 'Capital city values in seven months' },
    { value: '−23%', label: 'Sales volumes compared with a year earlier' },
    { value: '7', label: 'Consecutive months of national price declines' },
    { value: '40 yrs', label: 'The largest and fastest downturn in four decades' },
];

/* ------------------------------------------------------------------ */
/*  02 Industrial is booming                                            */
/* ------------------------------------------------------------------ */

export const INDUSTRIAL_STATS = [
    { value: '+4.8%', label: 'Annual industrial face rent growth', source: 'CBRE, Q3 2026', logo: 'cbre.svg' },
    { value: '+6.0%', label: 'National industrial capital growth', source: 'PCA/MSCI, June 2026' },
    { value: '+9.7%', label: 'Industrial estate capital growth', source: 'PCA/MSCI, June 2026' },
    { value: '+14.2%', label: 'Industrial estate total return', source: 'PCA/MSCI, June 2026' },
    { value: '$29.58B', label: 'Industrial transactions in 2025', source: 'Ray White Research' },
];

/** Cumulative industrial capital growth, % (KPMG and PCA/MSCI via Ray White). */
export const CAPITAL_GROWTH = [
    { label: 'Jun 24', value: 0.0 },
    { label: 'Sep 24', value: 0.5 },
    { label: 'Dec 24', value: 2.3 },
    { label: 'Mar 25', value: 2.8 },
    { label: 'Dec 25', value: 6.9 },
    { label: 'Jun 26', value: 12.7 },
];

export const LEASING_STATS = [
    { value: '+4.8%', label: 'Annual national face rent growth', source: 'CBRE, Q3 2026', logo: 'cbre.svg' },
    { value: '+1.3%', label: 'Annual super-prime net effective rent growth', source: 'CBRE, Q3 2026', logo: 'cbre.svg' },
    { value: '3.2M m²', label: 'National take-up, year to date', source: 'Colliers, Q3 2026', logo: 'colliers.svg' },
    { value: '+20%', label: 'Quarterly gross take-up growth', source: 'JLL, Q3 2026', logo: 'jll.svg' },
    { value: '+4.0%', label: 'Forecast prime rental growth in 2027', source: 'Cushman & Wakefield, Q4 2026', forecast: true },
];

/** National prime net face rent, $/m² (Cushman & Wakefield, The Occupier Reset, Q4 2026). */
export const PRIME_RENT = [
    { label: '2020', value: 112 },
    { label: '2021', value: 124 },
    { label: '2022', value: 151 },
    { label: '2023', value: 185 },
    { label: '2024', value: 197 },
    { label: '2025', value: 204 },
    { label: 'Q3 2026', value: 207 },
];

export const RESEARCH_HEADLINES = [
    { logo: 'knight-frank.svg', publisher: 'Knight Frank', date: '20 Aug 2026', headline: 'Leasing rebounds as shrinking supply supports future rental growth.' },
    { logo: 'cbre.svg', publisher: 'CBRE', date: '13 Oct 2026', headline: 'Face rents rise 4.8% annually as effective rents improve.' },
    { logo: 'jll.svg', publisher: 'JLL', date: '14 Oct 2026', headline: 'Record 1.49 million m² quarterly industrial take-up.' },
];

/* ------------------------------------------------------------------ */
/*  03 The seven reasons                                                */
/* ------------------------------------------------------------------ */

export const SMSF_SCENARIO = {
    rows: [
        ['Purchase price', '$500,000'],
        ['SMSF equity', '$200,000'],
        ['Borrowed (LRBA)', '$300,000'],
        ['Property exposure', '$500,000'],
        ['Annual rent at 6.5%, before financing and other costs', '$32,500'],
    ],
    tenYears: [
        { label: 'Property value', from: '$500,000', to: '≈ $814,000', note: 'At 5% p.a.' },
        { label: 'Loan balance', from: '$300,000', to: '≈ $134,000', note: 'Reduced by rent' },
    ],
    footnote:
        'Illustrative only. Assumes 6.5% yield and 5% p.a. growth, which are not forecasts. Excludes acquisition costs, lender requirements and SMSF liquidity requirements.',
};

export const SMSF_BENEFITS = [
    { title: 'Rental income', body: 'A potential income stream for your SMSF, taxed at concessional super rates.' },
    { title: 'Loan reduction', body: 'Tenant rent can help pay down the loan and build equity.' },
    { title: 'Capital appreciation', body: 'Potential long-term growth in the property’s value.' },
    { title: 'Greater exposure', body: 'Borrowing lets $200,000 of super control a $500,000 asset, which magnifies losses as well as gains.' },
];

export const TAX_BENEFITS = [
    'Interest expense deductions',
    'Negative gearing, where eligible',
    'Building capital works deductions',
    'Eligible plant and equipment depreciation',
    'Property management expense deductions',
    'Repairs and maintenance deductions',
    'Potential GST input tax credits',
    'Concessional SMSF taxation',
];

export const SUPER_TAX = [
    { value: '15%', label: 'Generally applicable SMSF accumulation-phase earnings tax' },
    { value: '10%', label: 'Effective CGT rate on eligible assets held over 12 months in accumulation phase' },
    { value: '0%', label: 'Potentially, on eligible retirement-phase investment earnings' },
];

export const YIELD_COMPARISON = {
    rows: [
        { label: 'Residential', yieldLabel: 'Indicative gross yield 3–4.5%', rate: '4%', annual: 20000, weekly: 385 },
        { label: 'Commercial & industrial', yieldLabel: 'Indicative yield 5–8%, often quoted net', rate: '6.5%', annual: 32500, weekly: 625 },
    ],
    headline: '62.5%',
    footnote:
        'Illustrative only. A $500,000 property at 4% (residential) and 6.5% (commercial). Before financing costs and any non-recoverable expenses. Yields vary by location, asset and lease.',
};

export const OUTGOINGS = [
    ['Council rates', 'Owner', 'Generally tenant'],
    ['Water', 'Owner or tenant', 'Generally tenant'],
    ['Building insurance', 'Owner', 'Generally tenant'],
    ['Body corporate levies', 'Owner', 'Often recoverable'],
    ['Routine maintenance', 'Owner', 'Often tenant'],
    ['Common area maintenance', 'Owner', 'Often recoverable'],
    ['Structural repairs', 'Owner', 'Generally owner'],
];

export const NET_INCOME = {
    rows: [
        { label: 'Residential', rent: 20000, costs: 6000, net: 14000, netYield: '2.80%' },
        { label: 'Commercial', rent: 32500, costs: 1625, net: 30875, netYield: '6.18%' },
    ],
    headline: '120%',
    extra: '+$16,875 a year',
    footnote:
        'Illustrative only. A $500,000 property, before interest, tax, vacancy and major capital expenditure. Which outgoings are recoverable depends on the lease.',
};

export const TENANCY = [
    ['Lease term', '6–12 month fixed terms', '3–5 year initial terms'],
    ['Turnover', 'More frequent', 'Potentially longer tenant retention'],
    ['Rules', 'Residential rental regulations', 'Negotiated commercial lease terms'],
    ['Rent reviews', 'Regulated', 'Contractual'],
    ['Tenant investment', 'Limited', 'May invest substantially in fit-outs'],
];

export const ESCALATION = {
    years: [
        { label: 'Year 1', value: 32500 },
        { label: 'Year 2', value: 33800 },
        { label: 'Year 3', value: 35152 },
        { label: 'Year 4', value: 36558 },
        { label: 'Year 5', value: 38020 },
    ],
    headline: '17%',
    footnote:
        'Illustrative only. A 4% fixed annual increase on $32,500. Actual reviews depend on the negotiated lease, and longer leases don’t remove the risk of tenant default or vacancy.',
};

export const REASONS_TO_STAY = [
    'Machinery and equipment',
    'Office fit-outs',
    'Storage systems',
    'Signage and brand presence',
    'Operational set-up',
];

export const MANAGEMENT = [
    ['Management fees', '6–8%', '3–5%'],
    ['Lease terms', '6–12 months', '3–5 years'],
    ['Renewals', 'More frequent', 'Less frequent'],
    ['Day-to-day maintenance', 'Generally the owner', 'Often the tenant'],
    ['Fit-outs', 'Limited', 'Often tenant-funded'],
    ['Outgoings', 'Largely owner-funded', 'Often tenant-recoverable'],
];

export const OWN_PREMISES_STEPS = [
    'Your SMSF purchases and owns the property.',
    'Your business occupies the premises under a commercial lease.',
    'Your business pays market rent to your SMSF.',
    'Your SMSF receives the rent and any long-term capital growth.',
];

/* ------------------------------------------------------------------ */
/*  04 Small-format warehouses                                          */
/* ------------------------------------------------------------------ */

export const STRATA_STATS = [
    { value: '+89%', label: 'Median warehouse sale price growth over five years (+14% p.a.)', source: 'Urbis, Oct 2026', logo: 'urbis.svg' },
    { value: '+69%', label: 'Median warehouse rental growth over five years (+11% p.a.)', source: 'Urbis, Oct 2026', logo: 'urbis.svg' },
    { value: '+140%', label: 'Strata industrial unit transaction growth, Newcastle & Hunter', source: 'Colliers, May 2026', logo: 'colliers.svg' },
    { value: '+36%', label: 'Industrial transaction volume growth, Newcastle & Hunter', source: 'Colliers, May 2026', logo: 'colliers.svg' },
];

/** Ten-year annualised total returns, Victoria, to 2025. */
export const VIC_RETURNS = [
    { label: 'Industrial', value: 13 },
    { label: 'Office', value: 9 },
    { label: 'Retail', value: 7 },
];

export const UNIT_FEATURES = [
    'High-clearance warehouse',
    'Roller door access',
    'Air-conditioned office (option)',
    'On-site parking',
    'Flexible layouts',
    '3-phase power (option)',
    'NBN',
];

export const UNIT_IDEAL_FOR = [
    'Trades and services',
    'E-commerce and distribution',
    'Automotive services',
    'Light manufacturing',
    'Business services',
    'Storage and logistics',
];

export const SME_STATS = [
    { value: '98.8%', label: 'Of industrial business growth comes from businesses with 0–19 employees' },
    { value: '+35%', label: 'Growth in occupied industrial lots under 1,000 m²' },
    { value: '3–5 yrs', label: 'Of zoned industrial land capacity left (Urbis estimate), about 70% less than the government’s 14 years' },
    { value: '<2%', label: 'Of zoned industrial land available in Melbourne’s inner and middle regions' },
    { value: '5–10 yrs', label: 'For new precinct structure plans to be approved' },
    { value: '24%', label: 'Of Melbourne’s employment growth (2026–2036) forecast from primary and industrial sectors', forecast: true },
];

export const SMALL_FORMAT_RESEARCH = [
    {
        logo: 'arealytics.svg',
        publisher: 'Arealytics',
        meta: 'Oct 2026 · South East Queensland',
        points: [
            '324 verified sales of 100–399 m² units, January–June 2026.',
            '+21.7% price premium for high-spec 100–199 m² units ($5,873/m² vs $4,824/m²).',
            '+11.2% premium for high-spec 200–299 m² units.',
        ],
    },
    {
        logo: 'bawdens.png',
        publisher: 'Bawdens',
        meta: 'June 2026 · Sydney SME space under 750 m²',
        points: ['+6% annual net face rent growth, from $196 to $208/m² p.a.'],
    },
    {
        logo: 'colliers.svg',
        publisher: 'Colliers',
        meta: 'Q1 2026',
        points: [
            '+3.6% annual prime rent growth ($196/m², up from $189).',
            '65% development precommitment.',
            'New supply 15–20% below the five-year average (2026–2030 forecast).',
            '+5–7% p.a. forecast capital value growth (2026–2030).',
        ],
    },
    {
        logo: 'cbre.svg',
        publisher: 'CBRE',
        meta: 'Q3 2026',
        points: [
            'Year-to-date investment turnover exceeded the full year 2025.',
            'Construction costs and financing continue to constrain new development.',
        ],
    },
];

/* ------------------------------------------------------------------ */
/*  05 Who's driving demand                                             */
/* ------------------------------------------------------------------ */

export const DEMAND_FACTORS = [
    'AI-enabled micro businesses',
    'E-commerce and drop-shipping growth',
    'Logistics and last-mile fulfilment',
    'Office plus operations under one roof',
    'A more efficient business model',
];

export const BUSINESS_TYPES = [
    { title: 'Online retail & drop shipping', image: img('use-online-retail', TILE, 'Orders being packed for dispatch', '50% 40%') },
    // AI-generated placeholder: replace before launch
    { title: 'Fulfilment & distribution', image: img('use-fulfilment-PLACEHOLDER', [480], 'A forklift moving stock inside a warehouse unit'), placeholder: true },
    { title: 'Light manufacturing & assembly', image: img('use-light-manufacturing', TILE, 'Light manufacturing work in a small industrial unit') },
    // AI-generated placeholder: replace before launch
    { title: 'Trade & service businesses', image: img('use-trade-PLACEHOLDER', [480], 'A trade workshop inside a warehouse unit'), placeholder: true },
    // AI-generated placeholder: replace before launch
    { title: 'Showrooms', image: img('use-showroom-PLACEHOLDER', [480], 'A showroom fitted out inside a warehouse unit'), placeholder: true },
    { title: 'Admin & operations hubs', image: img('use-admin-office', TILE, 'A mezzanine office above a warehouse floor', '50% 35%') },
];

/* ------------------------------------------------------------------ */
/*  06 Current opportunities                                            */
/* ------------------------------------------------------------------ */

export const LOCATIONS = [
    { town: 'Townsville', state: 'QLD', slug: 'townsville-qld', widths: TILE },
    { town: 'Moreton Bay', state: 'QLD', slug: 'moreton-bay-qld', widths: TILE },
    { town: 'Albury', state: 'NSW', slug: 'albury-nsw', widths: TILE },
    { town: 'Warnervale', state: 'NSW', slug: 'warnervale-nsw', widths: TILE },
    { town: 'Newcastle', state: 'NSW', slug: 'newcastle-nsw', widths: TILE },
    { town: 'Warrnambool', state: 'VIC', slug: 'warrnambool-vic', widths: TILE },
    { town: 'Bendigo', state: 'VIC', slug: 'bendigo-vic', widths: TILE },
    { town: 'Ballarat', state: 'VIC', slug: 'ballarat-vic', widths: TILE },
    { town: 'Dandenong', state: 'VIC', slug: 'dandenong-vic', widths: [480] },
].map((l) => ({ ...l, image: img(`loc-${l.slug}`, l.widths, `${l.town}, ${l.state}`) }));

/* ------------------------------------------------------------------ */
/*  Lead form                                                           */
/* ------------------------------------------------------------------ */

export const INTEREST_OPTIONS = ['SMSF trustee', 'Business owner', 'Property investor', 'Other'];
export const BUDGET_OPTIONS = ['Under $500k', '$500k–$750k', '$750k+'];

/* ------------------------------------------------------------------ */
/*  Fine print                                                          */
/* ------------------------------------------------------------------ */

export const DISCLAIMER =
    'The information on this page is general in nature and does not take into account your objectives, financial situation or needs. It is not financial, tax or legal advice. Figures are illustrative or sourced from third-party research as cited and may change. Past performance and forecasts are not reliable indicators of future returns. Seek independent advice from a licensed financial adviser, accountant or SMSF specialist before making any investment decision.';

export const SMSF_NOTE =
    'An SMSF can only borrow to buy property through a compliant limited recourse borrowing arrangement (LRBA), and must meet lender requirements, keep enough liquidity to pay its costs and members’ benefits, and satisfy the sole purpose test and other SMSF rules. Any lease to a related business must be on arm’s-length terms at market rent. Losses within an SMSF generally can’t be offset against personal income. Get independent advice from a licensed financial adviser, accountant or SMSF specialist before acting.';

export const SOURCES = [
    'Australian Taxation Office, 29 June 2026',
    'Property Council of Australia, 1 July 2026',
    'KPMG, Residential Property Market Outlook, August 2026',
    'Commonwealth Bank, May 2026',
    'Cotality; ABC News; Reuters; news.com.au, November 2026',
    'CBRE, Australian Industrial & Logistics, Q3 2026',
    'PCA/MSCI Australia Property Index, June 2026',
    'Ray White Research (incl. KPMG and PCA/MSCI data)',
    'Colliers, Industrial Research, Q1 2026, May 2026 (Newcastle & Hunter) and Q3 2026',
    'JLL, Industrial Research, Q3 2026',
    'Knight Frank, 20 August 2026',
    'Cushman & Wakefield, The Occupier Reset, Q4 2026',
    'Urbis, Industrial Market Outlook, October 2026',
    'Arealytics, South East Queensland small-format sales, October 2026',
    'Bawdens, Sydney SME industrial, June 2026',
];

/** Research logos shown in the "Research referenced" strip. */
export const RESEARCH_LOGOS = [
    ['kpmg.svg', 'KPMG'],
    ['commonwealth-bank-horizontal.png', 'Commonwealth Bank'],
    ['cotality.png', 'Cotality'],
    ['abc-news.svg', 'ABC News'],
    ['reuters.svg', 'Reuters'],
    ['newscomau.png', 'news.com.au'],
    ['cbre.svg', 'CBRE'],
    ['jll.svg', 'JLL'],
    ['knight-frank.svg', 'Knight Frank'],
    ['colliers.svg', 'Colliers'],
    ['urbis.svg', 'Urbis'],
    ['arealytics.svg', 'Arealytics'],
    ['bawdens.png', 'Bawdens'],
];
