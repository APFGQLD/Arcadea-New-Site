import React, { useRef, useState } from 'react';
import {
    QuestionMarkCircleIcon,
    ScaleIcon,
    ArrowTrendingDownIcon,
    NewspaperIcon,
    BoltIcon,
    HomeIcon,
    BuildingOffice2Icon,
    ArrowPathIcon,
    EyeIcon,
} from '@heroicons/react/24/outline';
import {
    InsightPage,
    InsightHero,
    ShortVersion,
    Section,
    Panel,
    Callout,
    LiveNote,
    KeyFigures,
    BarList,
    Prose,
    Checklist,
    InsightCTA,
    RelatedInsights,
    FinePrint,
} from '../../components/insights/InsightKit';
import { Segmented, ChartDataTable, InsightLineChart, Legend } from '../../components/InsightCharts';
import useInView from '../../hooks/useInView';
import { INSIGHTS } from '../../data/insights/shared';
import {
    VIDEO,
    REA_STAKE,
    MURDOCH_VOTING,
    HEADLINES,
    SEGMENTS,
    SEGMENTS_TOTAL,
    segmentShare,
    PREMIERE_RISES,
    LISTINGS_VS_REVENUE,
    AUCTION_WEEKS,
    BRISBANE,
    BRISBANE_YEARS,
    DISCLOSURE,
    UPDATED,
    DISCLAIMER,
    DETAILS,
    SOURCES,
} from '../../data/insights/whoProfits';

const skylineSet = (format) =>
    [800, 1400, 2000].map((w) => `/images/insights/gold-coast-skyline-${w}.${format} ${w}w`).join(', ');

const HERO_IMAGE = {
    src: '/images/insights/gold-coast-skyline-1400.jpg',
    sources: [
        { type: 'image/avif', srcSet: skylineSet('avif') },
        { type: 'image/webp', srcSet: skylineSet('webp') },
    ],
    position: '50% 40%',
};

const pct = (n) => `${n.toFixed(1)}%`;
const signed = (n) => (n === 0 ? 'Flat' : `${n > 0 ? '+' : '−'}${Math.abs(n)}%`);
const signed1 = (n) => (Math.abs(n) < 0.05 ? '0.0%' : `${n > 0 ? '+' : '−'}${Math.abs(n).toFixed(1)}%`);
const usdM = (n) => `${n < 0 ? '−' : ''}US$${Math.abs(n).toLocaleString('en-AU')}m`;
const clearance = (w) => Math.round((w.sold / w.reported) * 100);

// x labels for the yearly line chart, with the 10-year average as a flat dashed line
const YEAR_CHART = BRISBANE_YEARS.map((y) => ({
    x: y.short || y.year,
    label: y.year,
    change: y.change,
    average: BRISBANE.tenYearAnnual,
}));

const PROPERTY = SEGMENTS.find((s) => s.key === 'property');
const NEWS = SEGMENTS.find((s) => s.key === 'news');
const FY26 = LISTINGS_VS_REVENUE.find((r) => r.period === 'FY26');
const listingsWord = (n) => (n > 0 ? 'rose' : n < 0 ? 'fell' : 'held flat');

const logo = (file) => `/images/insights/logos/${file}`;

const REA_BRANDS = [
    { name: 'realestate.com.au', src: logo('realestate-com-au.png') },
    { name: 'PropTrack', src: logo('proptrack.png'), dark: true },
    { name: 'Mortgage Choice', src: logo('mortgage-choice.png'), dark: true, className: 'is-padded' },
];

const MASTHEADS = [
    { name: 'The Australian', src: logo('the-australian.png') },
    { name: 'The Daily Telegraph', src: logo('daily-telegraph.svg') },
    { name: 'Herald Sun', src: logo('herald-sun.svg') },
    { name: 'The Courier-Mail', src: logo('courier-mail.svg') },
    { name: 'The Advertiser', src: logo('the-advertiser.svg') },
    { name: 'Gold Coast Bulletin', src: logo('gold-coast-bulletin.svg') },
    { name: 'news.com.au', src: logo('news-com-au.svg') },
];

const OVERSEAS = [
    { name: 'The Times', src: logo('the-times.svg') },
    { name: 'The Sun', src: logo('the-sun.svg') },
    { name: 'New York Post', src: logo('new-york-post.svg') },
];

/** A company or masthead logo, on a white tile. */
const Logo = ({ name, src, className = '' }) => (
    <img className={`ins-logo ${className}`} src={src} alt={name} title={name} loading="lazy" decoding="async" />
);

/**
 * News Corp → REA Group and its brands, and News Corp's mastheads. Each tile
 * pops in as the tree scrolls into view (the two branches in step), then its
 * logo bobs gently. `--n` is a tile's place in the entrance order.
 */
const OwnershipTree = () => {
    const ref = useRef(null);
    const inView = useInView(ref, 0.2);
    const step = (n) => ({ '--n': n + 1 });
    const kids = (items, from) =>
        items.map((m, i) => (
            // White logos (PropTrack, Mortgage Choice) sit on a dark tile
            <li key={m.name} className={`ins-owner-pop ${m.dark ? 'is-dark' : ''}`} style={step(from + i)}>
                <Logo {...m} />
            </li>
        ));
    const overseasFrom = 3 + Math.max(REA_BRANDS.length, MASTHEADS.length);

    return (
        <div className={`ins-owners ${inView ? 'is-in' : ''}`} ref={ref}>
            <div className="ins-owner is-family ins-owner-pop" style={step(-1)}>
                <strong>Murdoch family trusts</strong>
                <small>About {MURDOCH_VOTING}% of News Corp&apos;s voting shares, voted by Lachlan Murdoch</small>
            </div>
            <span className="ins-owner-stem" aria-hidden="true" />
            <div className="ins-owner is-root ins-owner-pop" style={step(0)}>
                <Logo name="News Corp" src={logo('news-corp.svg')} className="is-lg" />
            </div>
            <span className="ins-owner-stem" aria-hidden="true" />
            <div className="ins-owner-branches">
                <div className="ins-owner-branch tone-accent">
                    <span className="ins-owner-tag ins-owner-pop" style={step(1)}>{REA_STAKE}% owned by News Corp</span>
                    <div className="ins-owner ins-owner-pop" style={step(2)}>
                        <Logo name="REA Group" src={logo('rea-group.svg')} className="is-md" />
                    </div>
                    <ul className="ins-owner-kids" aria-label="REA Group owns">
                        {kids(REA_BRANDS, 3)}
                    </ul>
                </div>
                <div className="ins-owner-branch tone-primary">
                    <span className="ins-owner-tag ins-owner-pop" style={step(1)}>Owned by News Corp</span>
                    <div className="ins-owner ins-owner-pop" style={step(2)}>
                        <Logo name="News Corp Australia" src={logo('news-corp-australia.svg')} className="is-md" />
                    </div>
                    <ul className="ins-owner-kids" aria-label="News Corp Australia mastheads include">
                        {kids(MASTHEADS, 3)}
                    </ul>
                </div>
            </div>
            <div className="ins-owner-overseas">
                <span className="ins-owner-tag tone-neutral ins-owner-pop" style={step(overseasFrom)}>
                    Overseas, also owned by News Corp
                </span>
                <ul className="ins-owner-kids" aria-label="News Corp mastheads overseas include">
                    {kids(OVERSEAS, overseasFrom + 1)}
                </ul>
            </div>
        </div>
    );
};

/** REA Group's shareholding as a pie that sweeps in. */
const SharePie = () => {
    const ref = useRef(null);
    const inView = useInView(ref, 0.3);
    // A circle with a stroke as wide as its diameter draws a pie slice
    const r = 25;
    const c = 2 * Math.PI * r;
    const slices = [
        { label: 'News Corp', value: REA_STAKE, tone: 'accent' },
        { label: 'Other shareholders', value: 100 - REA_STAKE, tone: 'neutral' },
    ];
    let offset = 0;
    return (
        <div className={`ins-pie ${inView ? 'is-in' : ''}`} ref={ref}>
            <svg
                viewBox="0 0 100 100"
                role="img"
                aria-label={`REA Group shareholding: News Corp ${REA_STAKE}%, other shareholders ${100 - REA_STAKE}%`}
            >
                {slices.map((s, i) => {
                    const len = (s.value / 100) * c;
                    const el = (
                        <circle
                            key={s.label}
                            className={`ins-pie-slice tone-${s.tone}`}
                            cx="50"
                            cy="50"
                            r={r}
                            strokeDasharray={`${inView ? len : 0} ${c}`}
                            strokeDashoffset={-offset}
                            style={{ '--i': i }}
                        />
                    );
                    offset += len;
                    return el;
                })}
            </svg>
            <ul className="ins-pie-legend">
                {slices.map((s) => (
                    <li key={s.label} className={`tone-${s.tone}`}>
                        <span className="ins-pie-swatch" />
                        <strong>{s.value}%</strong>
                        <span>{s.label}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

/** Clearance rate as a ring that fills to the week's rate. */
const ClearanceRing = ({ rate }) => {
    const ref = useRef(null);
    const inView = useInView(ref, 0.3);
    const r = 52;
    const c = 2 * Math.PI * r;
    return (
        <figure className="ins-ring-wrap" ref={ref}>
            <div className="ins-ring">
                <svg viewBox="0 0 128 128" aria-hidden="true">
                    <circle className="ins-ring-track" cx="64" cy="64" r={r} />
                    <circle
                        className="ins-ring-fill"
                        cx="64"
                        cy="64"
                        r={r}
                        strokeDasharray={c}
                        strokeDashoffset={inView ? c * (1 - rate / 100) : c}
                    />
                </svg>
                <div className="ins-ring-label">
                    <strong>{rate}%</strong>
                </div>
            </div>
            <figcaption>Clearance rate</figcaption>
        </figure>
    );
};

const Auctions = () => {
    const [week, setWeek] = useState('october');
    const w = AUCTION_WEEKS.find((x) => x.value === week);
    const max = Math.max(...AUCTION_WEEKS.map((x) => x.reported));
    return (
        <Panel
            controls={
                <Segmented
                    label="Week"
                    options={AUCTION_WEEKS.map((x) => ({ value: x.value, label: x.label }))}
                    value={week}
                    onChange={setWeek}
                />
            }
            footnote="Clearance rate = homes sold ÷ auctions with a reported result. Domain's preliminary weekly results; its Brisbane region includes the Gold Coast and Sunshine Coast. Different providers (Domain, Ray White, Cotality, PropTrack) count auctions differently, so their rates differ."
            table={
                <ChartDataTable
                    caption="Brisbane region auctions, Domain"
                    columns={['Week', 'Auctions with a result', 'Sold', 'Clearance rate']}
                    rows={AUCTION_WEEKS.map((x) => [x.long, x.reported, x.sold, `${clearance(x)}%`])}
                />
            }
        >
            <LiveNote>
                {w.long}: <strong>{w.sold} sold</strong> from {w.reported} auctions, a clearance rate of{' '}
                <strong>{clearance(w)}%</strong>.
            </LiveNote>
            <div className="ins-auction">
                <BarList
                    max={Math.ceil(max / 20) * 20}
                    items={[
                        { label: 'Auctions with a result', value: w.reported, tone: 'neutral' },
                        { label: 'Sold', value: w.sold, tone: 'accent', highlight: true },
                    ]}
                    ariaLabel={`${w.long}: ${w.reported} auctions with a result, ${w.sold} sold`}
                />
                <ClearanceRing rate={clearance(w)} />
            </div>
        </Panel>
    );
};

/** The incentive loop: story → feeling → listing → owner, and round again. */
const LOOP = [
    { icon: NewspaperIcon, title: 'The story', body: 'A News Corp masthead reports on housing. Some weeks it reads like a boom, some weeks like a slump.' },
    { icon: BoltIcon, title: 'The feeling', body: 'Excitement says buy before prices rise. Fear says sell before they fall.' },
    { icon: HomeIcon, title: 'The listing', body: 'Either way, a home goes up for sale, most often on realestate.com.au, and the agent pays REA Group to list it.' },
    { icon: BuildingOffice2Icon, title: 'The owner', body: `News Corp owns ${REA_STAKE}% of REA Group, and Murdoch family trusts hold about a third of News Corp's votes.` },
];

const IncentiveLoop = () => (
    <ol className="ins-loop" aria-label="The loop: the story, the feeling, the listing, the owner, then back to the story">
        {LOOP.map((step, i) => {
            const Icon = step.icon;
            return (
                <li key={step.title} className="reveal reveal-up" style={{ transitionDelay: `${i * 120}ms` }}>
                    <span className="ins-loop-num">{i + 1}</span>
                    <Icon className="ins-loop-icon" aria-hidden="true" />
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                </li>
            );
        })}
        <li className="ins-loop-back reveal reveal-up" style={{ transitionDelay: `${LOOP.length * 120}ms` }}>
            <ArrowPathIcon aria-hidden="true" />
            <span>And round again: the stories run on realestate.com.au too, right beside the listings.</span>
        </li>
    </ol>
);

/** How each kind of headline could be read; a description, not a claim about intent. */
const READINGS = {
    Excitement: 'Buy now, before prices rise again.',
    Fear: 'List now, before prices fall further.',
};

/** Two real headlines, one each way, from the same masthead on the same site. */
const HeadlinePair = () => (
    <div className="ins-headlines">
        {HEADLINES.map((h, i) => (
            <figure
                key={h.text}
                className={`ins-headline reveal reveal-up ${h.mood === 'Fear' ? 'tone-negative' : 'tone-accent'}`}
                style={{ transitionDelay: `${i * 120}ms` }}
            >
                <span className="ins-headline-mood">{h.mood}</span>
                <blockquote>&ldquo;{h.text}&rdquo;</blockquote>
                <figcaption>
                    The Courier-Mail, on realestate.com.au · {h.date}
                    <span>{h.detail}</span>
                </figcaption>
                <p className="ins-headline-reading">
                    <EyeIcon aria-hidden="true" />
                    <span>How a reader might take it: <em>{READINGS[h.mood]}</em></span>
                </p>
            </figure>
        ))}
    </div>
);

const WhoProfitsPage = () => (
    <InsightPage seo={INSIGHTS.whoProfits.seo} noindex>
        <InsightHero
            eyebrow="Buyers and sellers · Property news · October 2026"
            title="Who profits when"
            accent="you buy or sell?"
            subtitle="The Murdoch family's News Corp publishes many of the newspapers that cover housing, and owns most of realestate.com.au, where most homes are advertised for sale. Boom headline or slump headline, the listing still gets paid for. Here's how it fits together, and what Brisbane's numbers actually say."
            image={HERO_IMAGE}
            video={VIDEO}
            notice={<><strong>General information only.</strong> Seek independent advice. Figures as at 30 September 2026 unless stated.</>}
            stats={[
                { value: REA_STAKE, suffix: '%', label: 'Of REA Group, owner of realestate.com.au, held by News Corp', foot: 'News Corp FY2026' },
                { value: +segmentShare(PROPERTY.usd).toFixed(1), decimals: 1, suffix: '%', label: `Of News Corp's FY2026 segment earnings came from property. News: ${pct(segmentShare(NEWS.usd))}`, foot: 'Segment EBITDA' },
                { value: FY26.revenue, prefix: '+', suffix: '%', label: 'REA residential revenue in FY26 with flat listings. It also rose when listings rose, and when they fell', foot: 'REA Group results' },
            ]}
        />

        <ShortVersion
            items={[
                `The Murdoch family's News Corp owns ${REA_STAKE}% of REA Group, which runs realestate.com.au, and publishes many of Australia's biggest newspapers.`,
                "Property earns News Corp far more than news: about 45% of its FY2026 segment earnings, against about 8% for its whole news division.",
                'Boom headlines and slump headlines both run on realestate.com.au, beside the listings. Excitement and fear can both end in a home being listed.',
                "REA's revenue has grown whether listings rose, held flat or fell, because the price of a listing keeps going up.",
                "Brisbane values are about 5% below their May peak but still up 5.9% over the year. Cooled isn't crashed.",
            ]}
        />

        <Section
            id="the-loop"
            number={1}
            title="One group, both ends of the story"
            lede={
                <p>
                    The paper that tells you how the housing market feels and the website where you sell your home
                    belong to the same group. That creates a loop, and it pays out whichever way the story goes.
                </p>
            }
        >
            <IncentiveLoop />
            <Callout icon={ScaleIcon} tone="neutral" title="Who benefits, not who's to blame">
                <p>
                    This is how the incentives line up. We&apos;re not saying stories are written to drive listings,
                    and we found no evidence of editors being told to scare people into selling. It&apos;s simply worth
                    knowing who&apos;s behind the headline.
                </p>
            </Callout>
        </Section>

        <Section
            id="who-owns-what"
            number={2}
            title="Who owns what"
            lede={
                <>
                    <p>
                        When you list on realestate.com.au, the listing fee goes to REA Group. REA Group is{' '}
                        <strong>{REA_STAKE}% owned by News Corp</strong>. REA also owns PropTrack, which publishes a home
                        price index, and Mortgage Choice.
                    </p>
                    <p>
                        News Corp publishes many of Australia&apos;s biggest mastheads, plus The Times, The Sun and the
                        New York Post overseas. Since September 2025, about {MURDOCH_VOTING}% of its voting shares have
                        been held by Murdoch family trusts and voted by Lachlan Murdoch.
                    </p>
                </>
            }
        >
            <Panel footnote="Simplified. Selected mastheads shown. News Corp's Class A shares carry no general vote; the voting stake is of its Class B shares. Sources: News Corp FY2026 Form 10-K; News Corp 8-K, 8 September 2025.">
                <OwnershipTree />
            </Panel>
            <Panel footnote="Source: News Corp FY2026 Form 10-K.">
                <h3 className="ins-panel-title">Who owns REA Group</h3>
                <SharePie />
            </Panel>
        </Section>

        <Section
            id="how-big"
            number={3}
            title="News is the megaphone. Property is the money."
            lede={
                <p>
                    News Corp&apos;s reach in news is large, but that isn&apos;t where most of its earnings come from. In
                    FY2026 its property segment earned <strong>{usdM(PROPERTY.usd)}</strong>, about 45% of the total.
                    Its whole news division, across Australia, the UK and the US, earned {usdM(NEWS.usd)}: about 8%.
                </p>
            }
        >
            <Panel
                footnote={`Share of total segment EBITDA (${usdM(SEGMENTS_TOTAL)}), year to 30 June 2026. The total is after corporate costs, so the positive segments add up to more than 100%. Source: News Corp Q4 FY2026 earnings release.`}
                table={
                    <ChartDataTable
                        caption="News Corp FY2026 segment EBITDA"
                        columns={['Segment', 'US$m', 'Share of total']}
                        rows={[
                            ...SEGMENTS.map((s) => [`${s.label} (${s.sub})`, usdM(s.usd), pct(segmentShare(s.usd))]),
                            ['Total', usdM(SEGMENTS_TOTAL), '100%'],
                        ]}
                    />
                }
            >
                <BarList
                    min={-20}
                    max={50}
                    format={pct}
                    items={SEGMENTS.map((s) => ({
                        label: s.label,
                        sub: `${s.sub} · ${usdM(s.usd)}`,
                        value: +segmentShare(s.usd).toFixed(1),
                        tone: s.key === 'property' ? 'accent' : s.key === 'news' ? 'primary' : s.usd < 0 ? 'negative' : 'neutral',
                        highlight: s.key === 'property',
                    }))}
                    ariaLabel="Share of News Corp FY2026 segment EBITDA: property 45.5%, Dow Jones 40.8%, book publishing 17.6%, news media 8.5%, other −12.5%"
                />
            </Panel>
        </Section>

        <Section
            id="media-layer"
            number={4}
            title="Boom or slump, the story runs beside the listings"
            lede={
                <p>
                    realestate.com.au doesn&apos;t just list homes. It also runs property news, much of it from News
                    Corp&apos;s own mastheads. In the past year, the same Brisbane market got both kinds of headline.
                </p>
            }
        >
            <HeadlinePair />
            <Callout icon={HomeIcon} tone="neutral" title="Either reading can end in a listing">
                <p>
                    A buyer who hurries in, or a seller who decides to list before prices slip further, can both end up
                    on realestate.com.au. The more people act, the more listings REA sells.
                </p>
            </Callout>
            <h3 className="ins-panel-title">Take the &ldquo;nation-low&rdquo; slump</h3>
            <Prose>
                <p>
                    Look at the raw numbers and a different picture appears. Using Domain&apos;s published results,{' '}
                    <strong>31 homes</strong> sold at auction in the Brisbane region in mid-June. In the first week of
                    October, <strong>29</strong> did. What changed is the number going to auction: up from 121 to 155.
                </p>
            </Prose>
            <Auctions />
            <Callout icon={ArrowTrendingDownIcon} tone="neutral" title="More homes on offer, the same number of buyers">
                <p>
                    The article itself quotes Ray White saying the result reflects buyers adjusting to borrowing costs
                    &ldquo;rather than a lack of underlying interest&rdquo;. The framing is in the headline.
                </p>
            </Callout>
            <Callout title="A conflict of interest">
                <p>
                    Critics, from academics to independent media, argue a media group with a stake in property has a
                    commercial interest in how housing is framed. We found no evidence of editors being told to scare
                    people into selling. But it is a conflict of interest, and it&apos;s worth knowing who is behind the
                    number you&apos;re reading.
                </p>
            </Callout>
        </Section>

        <Section
            id="heads-they-win"
            number={5}
            title="Heads they win, tails they win"
            lede={
                <p>
                    REA&apos;s residential revenue has grown when listings rose, when they fell and when they held flat.
                    In FY26 listings were flat, yet revenue rose <strong>12%</strong>, to {FY26.revenueAud}.
                </p>
            }
        >
            <Panel
                footnote="Change on the same period a year earlier. National residential buy listings; REA Group residential revenue. Sources: REA Group FY24 results (9 August 2024), H1 FY26 results (6 February 2026) and FY26 results (6 August 2026)."
                table={
                    <ChartDataTable
                        caption="National buy listings and REA residential revenue, change on a year earlier"
                        columns={['Period', 'National buy listings', 'Residential revenue']}
                        rows={LISTINGS_VS_REVENUE.map((r) => [r.period, signed(r.listings), `${signed(r.revenue)} (${r.revenueAud})`])}
                    />
                }
            >
                <BarList
                    min={-8}
                    max={26}
                    format={(n) => signed(Math.round(n))}
                    items={LISTINGS_VS_REVENUE.flatMap((r) => [
                        { label: r.period, sub: `Homes listed for sale ${listingsWord(r.listings)}`, value: r.listings, tone: r.listings < 0 ? 'negative' : 'neutral', display: signed(r.listings) },
                        { label: r.period, sub: 'REA residential revenue', value: r.revenue, tone: 'accent', highlight: true },
                    ])}
                    ariaLabel="FY24: listings up 7%, residential revenue up 24%. H1 FY26: listings down 6%, residential revenue up 7%. FY26: listings flat, residential revenue up 12%"
                />
            </Panel>
            <Panel
                footnote="Average price rise for Premiere+, REA's top residential package. FY27 is planned. Sources: REA Group results and ASX announcements."
                table={
                    <ChartDataTable
                        caption="Average Premiere+ price rise"
                        columns={['Year', 'Rise']}
                        rows={PREMIERE_RISES.map((p) => [p.planned ? `${p.year} (planned)` : p.year, `${p.rise}%`])}
                    />
                }
            >
                <h3 className="ins-panel-title">Why: the price of a listing rises every year</h3>
                <BarList
                    labelWidth="6.5rem"
                    max={12}
                    format={(n) => `${Math.round(n)}%`}
                    items={PREMIERE_RISES.map((p) => ({
                        label: p.year,
                        sub: p.planned ? 'Planned' : undefined,
                        value: p.rise,
                        tone: p.planned ? 'neutral' : 'accent',
                    }))}
                    ariaLabel="Average Premiere+ price rises: 10% in FY25, 7% in FY26, 8% planned for FY27"
                />
            </Panel>
            <Callout icon={ScaleIcon} title="Either way the market moves">
                <p>
                    REA makes money when homes are listed. With pricing rising every year, it does well whichever way
                    the market moves, and whichever way the headline points.
                </p>
            </Callout>
        </Section>

        <Section
            id="read-the-headline"
            number={6}
            title="Before you act on a headline"
            lede={<p>Five questions to ask of any property story, whoever publishes it.</p>}
        >
            <Checklist
                icon={QuestionMarkCircleIcon}
                items={[
                    { title: 'Who published it?', body: 'And do they earn from property transactions?' },
                    { title: 'Whose data is it?', body: 'And how do they measure it?' },
                    { title: "What's the time period?", body: 'And what is it compared with?' },
                    { title: 'Is it a rate or a count?', body: 'A rate can fall while the count holds steady.' },
                    { title: 'What does the long-run trend say?' },
                ]}
            />
            <Callout title="That goes for us too">
                <p>
                    Agents earn when homes sell, so check our numbers as well.{' '}
                    <a href="#important-information">Every source is listed below.</a>
                </p>
            </Callout>
        </Section>

        <Section
            id="brisbane"
            number={7}
            title="What Brisbane's numbers actually say"
            lede={
                <p>
                    Brisbane dwelling values are up <strong>5.9%</strong> over the 12 months to September 2026, a little
                    under their 10-year average of about 7.5% a year. They&apos;re 5.4% below their May 2026 peak, and
                    sales over the past three months were 27% lower than a year earlier.
                </p>
            }
        >
            <KeyFigures
                columns={3}
                items={[
                    { value: BRISBANE.year, decimals: 1, prefix: '+', suffix: '%', label: 'Change over 12 months', foot: 'To 30 Sep 2026', tone: 'accent' },
                    { value: Math.abs(BRISBANE.fromPeak), decimals: 1, prefix: '−', suffix: '%', label: 'From the May 2026 peak', foot: 'Dwelling values' },
                    { value: BRISBANE.tenYear, decimals: 1, prefix: '+', suffix: '%', label: `Change over 10 years, about ${BRISBANE.tenYearAnnual}% a year`, foot: 'Dwelling values' },
                ]}
            />
            <Panel
                footnote={`Brisbane dwelling values, change over each calendar year, and the 12 months to September 2026. The dashed line is the 10-year average of about ${BRISBANE.tenYearAnnual}% a year (Arcadea's calculation from the 10-year change). Sources: CoreLogic / Cotality Home Value Index, January releases and October 2026.`}
                table={
                    <ChartDataTable
                        caption="Brisbane dwelling values, change by year"
                        columns={['Year', 'Change']}
                        rows={[
                            ...BRISBANE_YEARS.map((y) => [y.year, signed1(y.change)]),
                            ['10-year average', `${BRISBANE.tenYearAnnual}% a year`],
                        ]}
                    />
                }
            >
                <h3 className="ins-panel-title">Change by year</h3>
                <Legend
                    items={[
                        { label: 'Brisbane dwelling values', color: 'var(--chart-a)' },
                        { label: `10-year average, ${BRISBANE.tenYearAnnual}% a year`, color: 'var(--chart-b)', variant: 'is-dashed' },
                    ]}
                />
                <InsightLineChart
                    data={YEAR_CHART}
                    xKey="x"
                    series={[
                        { dataKey: 'change', name: 'Change', color: 'var(--chart-a)' },
                        { dataKey: 'average', name: '10-year average', color: 'var(--chart-b)', dashed: true, dots: false },
                    ]}
                    domain={[-5, 30]}
                    ticks={[-5, 0, 5, 10, 15, 20, 25, 30]}
                    formatY={(v) => `${v}%`}
                    formatTooltip={signed1}
                    narrowXTicks={['2018', '2020', '2022', '2024', 'To Sep 26']}
                    callout={[
                        { dataKey: 'change', x: '2021', text: '+27.4%' },
                        { dataKey: 'change', text: '+5.9%' },
                    ]}
                    renderTooltip={(row) => (
                        <>
                            <strong>{row.label}</strong>
                            <span className="tip-row">Change: {signed1(row.change)}</span>
                        </>
                    )}
                    ariaLabel="Line chart of Brisbane dwelling values by year: 2018 +0.2%, 2019 +0.3%, 2020 +3.6%, 2021 +27.4%, 2022 −1.1%, 2023 +13.0%, 2024 +11.2%, 2025 +14.5%, 12 months to September 2026 +5.9%, against a 10-year average of 7.5% a year"
                />
            </Panel>
            <Callout icon={ArrowTrendingDownIcon} tone="neutral" title="What the index publisher expects">
                <p>
                    Cotality, which publishes the index, describes the most likely outcome as &ldquo;a gradual drift
                    lower in housing values rather than a material downturn&rdquo;.
                </p>
            </Callout>
        </Section>

        <InsightCTA
            title="Ask who gets paid when you act."
            body="Next time a headline tells you how to feel about property, ask who profits from the feeling. Cooled isn't crashed. If you'd like to talk through what the numbers mean for you, get in touch with the team at Arcadea."
            actions={[
                { href: '/#contact', label: 'Talk to the team' },
                { href: INSIGHTS.rates.path, label: 'See the interest rates insight' },
            ]}
        />

        <RelatedInsights items={[INSIGHTS.rates, INSIGHTS.migration]} />

        <FinePrint
            disclaimer={DISCLAIMER}
            details={DETAILS}
            disclosure={DISCLOSURE}
            updated={UPDATED}
            sources={SOURCES}
        />
    </InsightPage>
);

export default WhoProfitsPage;
