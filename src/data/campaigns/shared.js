/*
 * Campaign landing pages under /campaigns. `seo` is read by each page in the
 * browser and by prerender.js, so crawlers and link previews see the same
 * title, description and share image as visitors.
 */

export const CAMPAIGNS = {
    commercialIndustrial: {
        path: '/campaigns/commercial',
        seo: {
            title: 'Commercial & Industrial Property',
            description:
                'Seven reasons commercial and industrial property is drawing investors, SMSF trustees and business owners. Small-format warehouses from $399,000 with a 5% first-year lease in place. General information only.',
            image: '/images/campaigns/commercial-industrial/og.jpg',
        },
    },
};
