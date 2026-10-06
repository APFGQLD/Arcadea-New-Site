/*
 * Shared copy for the Arcadea Insights pages. Each page's figures live in its
 * own file in this folder, transcribed from the reels repo:
 * arcadea-reels/docs/insight-pages-overview.md and videos/<id>/sources.md.
 * Change numbers there first, then here.
 */

export const LICENCE = 'Licensed Real Estate Agent No. 4857148.';

export const GENERAL_ADVICE = 'General information only. Not financial, tax or legal advice.';

/** Every insight page, for "Read next" links. */
export const INSIGHTS = {
    newVsEstablished: {
        path: '/insights/new-vs-established-gold-coast',
        poster: '/images/insights/new-vs-established-poster.jpg',
        duration: '1:16',
        date: 'Sep 2026',
        tag: 'Investors',
        title: 'New vs established after the 2026 tax changes',
        blurb: 'Same $1.6M budget, four products, every cost and tax modelled under the new negative gearing and CGT rules.',
    },
    defenceHousing: {
        path: '/insights/defence-housing-townsville',
        poster: '/images/insights/defence-housing-townsville-poster.jpg',
        duration: '1:25',
        date: 'Oct 2026',
        tag: 'Investors',
        title: 'Defence housing in Townsville',
        blurb: 'How a Defence Housing Australia lease works, what the fee covers, and what stays with you.',
    },
    goldCoastGrowth: {
        path: '/insights/gold-coast-growth-plan',
        poster: '/images/insights/gold-coast-growth-plan-poster.jpg',
        duration: '2:05',
        date: 'Oct 2026',
        tag: 'Gold Coast',
        title: 'Gold Coast: planning for a million people',
        blurb: '185,000 new homes by 2046, approvals at a ten-year high, and where the plan says growth should go.',
    },
    migration: {
        path: '/insights/interstate-migration-queensland',
        poster: '/images/insights/interstate-migration-queensland-poster.jpg',
        duration: '1:24',
        date: 'Oct 2026',
        tag: 'Queensland',
        title: "Who's moving to Queensland, and from where",
        blurb: 'Queensland gained more people from other states than anywhere else. Most came from New South Wales.',
    },
    stampDuty: {
        path: '/insights/first-home-stamp-duty-new-vs-established',
        poster: '/images/insights/first-home-stamp-duty-poster.jpg',
        duration: '1:33',
        date: 'Oct 2026',
        tag: 'First home buyers',
        title: 'Stamp duty: new vs established',
        blurb: 'A first home buyer pays no transfer duty on a new home in Queensland, at any price.',
    },
    rates: {
        path: '/insights/interest-rates-repayments-2022-2026',
        poster: '/images/insights/interest-rates-repayments-poster.jpg',
        duration: '1:21',
        date: 'Oct 2026',
        tag: 'All buyers',
        title: 'Four years of rates, one repayment',
        blurb: '17 rises and 3 cuts. What the cash rate did to a $600,000 home loan repayment.',
    },
};

/** The notes under "Important information", shared by every page. */
export const baseDetails = ({ disclosure, figures }) => [
    {
        title: 'General information, not personal advice',
        body: "Nothing on this page is a recommendation to buy, sell or hold any property or financial product. It doesn't take into account your objectives, financial situation or needs, so consider whether it's appropriate for you before acting on it.",
    },
    {
        title: 'About the figures',
        body: figures,
    },
    {
        title: 'Not a forecast',
        body: 'Nothing here is a forecast of prices, rents, returns or interest rates. Property values can fall as well as rise, and past figures are not a reliable guide to the future.',
    },
    {
        title: 'Our interest',
        body: `${disclosure} Please keep this in mind when reading this page.`,
    },
    {
        title: 'Accuracy and third-party sources',
        body: "We've taken care preparing this page, but we don't guarantee it is complete, accurate or current, and we may not update it. Third-party sources are listed for reference only; we don't control or endorse them. To the extent permitted by law, Arcadea Property accepts no liability for any loss arising from reliance on this information.",
    },
    {
        title: 'Get independent advice',
        body: 'Before making any decision, speak with the right professional for your situation: a licensed financial adviser, a registered tax agent, a solicitor or conveyancer, or a mortgage broker or lender.',
    },
];
