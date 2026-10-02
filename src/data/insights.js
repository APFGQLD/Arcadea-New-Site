/*
 * Research reports listed on the /insights index, newest first. The first
 * entry is shown as the large featured card; the rest go in the grid.
 *
 * To add a report: build its page, add its route in App.jsx under
 * /insights/<slug>, then add an entry here.
 *
 *   path       Route of the report page
 *   date       Publication date (YYYY-MM-DD)
 *   image      Card photo (pre-sized into public/images/insights/)
 *   imageAlt   Alt text for the photo
 */
import { REPORT_TITLE as NVE_TITLE } from './newVsEstablishedData';

export const INSIGHTS = [
    {
        path: '/insights/new-vs-established-gold-coast',
        title: NVE_TITLE,
        category: 'Research report',
        date: '2026-09-29',
        summary:
            'We modelled new and established Gold Coast apartments and houses under the 2026 negative gearing and CGT rules. Same $1.6M budget, four products, every cost and tax counted.',
        image: '/images/insights/gold-coast-skyline-1400.jpg',
        imageAlt: 'Gold Coast skyline at dusk',
    },
];
