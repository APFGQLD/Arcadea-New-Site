import React, { useRef, useState } from 'react';
import { ArrowUpIcon, ArrowDownIcon, ChatBubbleLeftRightIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
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
    Timeline,
    Checklist,
    InsightCTA,
    RelatedInsights,
    FinePrint,
} from '../../components/insights/InsightKit';
import { fmtAud } from '../../components/insights/format';
import { Segmented, InsightLineChart, ChartDataTable } from '../../components/InsightCharts';
import useInView from '../../hooks/useInView';
import { INSIGHTS } from '../../data/insights/shared';
import {
    VIDEO,
    CASH_RATE,
    MOVES,
    MORTGAGE_RATE_THEN,
    MORTGAGE_RATE_NOW,
    SEPTEMBER_RISE,
    BUFFER,
    LOANS,
    TERM_YEARS,
    monthlyRepayment,
    DISCLOSURE,
    UPDATED,
    DISCLAIMER,
    DETAILS,
    SOURCES,
} from '../../data/insights/interestRates';

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

const pct = (n) => `${n.toFixed(2)}%`;
const loanLabel = (l) => `$${l / 1000}k`;
const pay = (loan, rate) => Math.round(monthlyRepayment(loan, rate));
const gap = (loan, a, b) => monthlyRepayment(loan, b) - monthlyRepayment(loan, a);

const THEN = MORTGAGE_RATE_THEN.rate;
const NOW = MORTGAGE_RATE_NOW.rate;
const AFTER_SEPT = +(NOW + SEPTEMBER_RISE).toFixed(2);
const TEST = +(NOW + BUFFER).toFixed(2);
const REPAY_MAX = Math.ceil(monthlyRepayment(LOANS[LOANS.length - 1], TEST) / 1000) * 1000;

/** 17 rises and 3 cuts, one arrow per decision, year by year. */
const MovesTally = () => {
    const ref = useRef(null);
    const inView = useInView(ref, 0.3);
    let n = 0;
    return (
        <ol className={`ins-tally ${inView ? 'is-in' : ''}`} ref={ref} aria-label="Cash rate decisions by year: 8 rises in 2022, 5 in 2023, none in 2024, 3 cuts in 2025 and 4 rises in 2026">
            {MOVES.map((m) => (
                <li key={m.year}>
                    <span className="ins-tally-year">{m.year}</span>
                    <span className="ins-tally-marks" aria-hidden="true">
                        {Array.from({ length: m.rises }, (_, i) => (
                            <span key={`r${i}`} className="is-rise" style={{ '--n': n++ }}><ArrowUpIcon /></span>
                        ))}
                        {Array.from({ length: m.cuts }, (_, i) => (
                            <span key={`c${i}`} className="is-cut" style={{ '--n': n++ }}><ArrowDownIcon /></span>
                        ))}
                        {m.rises + m.cuts === 0 && <span className="is-hold">No change</span>}
                    </span>
                    <span className="ins-tally-note">
                        {m.rises > 0 && `${m.rises} rise${m.rises > 1 ? 's' : ''}`}
                        {m.cuts > 0 && `${m.cuts} cut${m.cuts > 1 ? 's' : ''}`}
                        {m.rises + m.cuts > 0 && ' · '}
                        {m.note}
                    </span>
                </li>
            ))}
        </ol>
    );
};

const Repayments = () => {
    const [loan, setLoan] = useState(600000);
    const monthly = gap(loan, THEN, NOW);
    return (
        <Panel
            controls={
                <Segmented
                    label="Loan size"
                    options={LOANS.map((l) => ({ value: l, label: `${loanLabel(l)} loan` }))}
                    value={loan}
                    onChange={setLoan}
                />
            }
            footnote={`Illustrative: a new ${TERM_YEARS}-year principal-and-interest loan at each rate, monthly repayments. An existing loan's repayment depends on its balance and remaining term. Differences are calculated before rounding.`}
            table={
                <ChartDataTable
                    caption={`Monthly repayment, new ${TERM_YEARS}-year principal-and-interest loan`}
                    columns={['Loan', `At ${pct(THEN)}`, `At ${pct(NOW)}`, 'Difference', 'Each 0.25% rise']}
                    rows={LOANS.map((l) => [
                        fmtAud(l),
                        fmtAud(pay(l, THEN)),
                        fmtAud(pay(l, NOW)),
                        `+${fmtAud(Math.round(gap(l, THEN, NOW)))}`,
                        `about +${fmtAud(Math.round(gap(l, NOW, AFTER_SEPT)))}`,
                    ])}
                />
            }
        >
            <LiveNote>
                On a <strong>{fmtAud(loan)}</strong> loan, that&apos;s <strong>+{fmtAud(Math.round(monthly))} a month</strong>,
                about {fmtAud(Math.round((monthly * 12) / 10) * 10)} a year.
            </LiveNote>
            <BarList
                max={REPAY_MAX}
                format={fmtAud}
                items={[
                    { label: MORTGAGE_RATE_THEN.label, sub: `Average variable rate, ${pct(THEN)}`, value: pay(loan, THEN), tone: 'neutral' },
                    { label: MORTGAGE_RATE_NOW.label, sub: `Average variable rate, ${pct(NOW)}`, value: pay(loan, NOW), tone: 'primary', highlight: true },
                    { label: "If September's rise is passed on", sub: pct(AFTER_SEPT), value: pay(loan, AFTER_SEPT), tone: 'primary' },
                    { label: "The lender's buffer test", sub: `${pct(TEST)}: ${BUFFER} points higher`, value: pay(loan, TEST), tone: 'accent' },
                ]}
                ariaLabel={`Monthly repayments on a ${fmtAud(loan)} loan at ${pct(THEN)}, ${pct(NOW)}, ${pct(AFTER_SEPT)} and ${pct(TEST)}`}
            />
        </Panel>
    );
};

const InterestRatesPage = () => (
    <InsightPage
        title="Four Years of Rates, One Repayment"
        description="17 rate rises and 3 cuts took the cash rate from 0.10% to 4.60%, the highest since 2011. What that did to a $500k, $600k and $750k home loan repayment, and how lenders test you on top of it."
    >
        <InsightHero
            eyebrow="All buyers · Interest rates · October 2026"
            title="Four years of rates,"
            accent="one repayment."
            subtitle="17 rate rises and 3 cuts took the cash rate from 0.10% to 4.60%, the highest since 2011. Here's what that did to a typical home loan repayment, and how lenders test you on top of it."
            image={HERO_IMAGE}
            video={VIDEO}
            notice={<><strong>Illustrative only. Not financial advice.</strong> Speak to a lender or broker about your own loan.</>}
            stats={[
                { value: 4.6, decimals: 2, suffix: '%', label: 'RBA cash rate from 30 September 2026, the highest since 2011', foot: 'Up from 0.10%' },
                { value: Math.round(gap(600000, THEN, NOW)), prefix: '+$', label: 'More a month on a $600,000 loan, from 2.86% to 6.24%', foot: 'New 30-year P&I loan' },
                { value: 17, suffix: ' rises', label: 'And 3 cuts, from May 2022 to September 2026', foot: 'RBA decisions' },
            ]}
        />

        <ShortVersion
            items={[
                'The RBA cash rate went from a record low of 0.10% to 4.60% on 30 September 2026: 17 rises and 3 cuts.',
                'The average variable rate on existing owner-occupier loans went from 2.86% in April 2022 to 6.24% in July 2026.',
                'On a new $600,000, 30-year loan, that takes the repayment from $2,485 to $3,690 a month: about $14,470 more a year.',
                'Lenders also check you could cope with a rate 3 points higher: $4,932 a month on the same loan. Rates move both ways, so plan for both.',
            ]}
        />

        <Section
            id="cash-rate"
            number={1}
            title="The cash rate since 2022"
            lede={
                <p>
                    In early 2022, the cash rate was a record low of 0.10%. After a run of rises, three cuts in 2025 and
                    four more rises this year, it&apos;s now <strong>4.60%</strong>.
                </p>
            }
        >
            <Panel
                footnote="RBA cash rate target at the end of each quarter, March 2022 to September 2026. Source: Reserve Bank of Australia."
                table={
                    <ChartDataTable
                        caption="RBA cash rate target, end of quarter"
                        columns={['Quarter', 'Cash rate']}
                        rows={CASH_RATE.map((r) => [r.q, pct(r.rate)])}
                    />
                }
            >
                <InsightLineChart
                    data={CASH_RATE}
                    xKey="q"
                    series={[{ dataKey: 'rate', name: 'Cash rate', color: 'var(--chart-b)' }]}
                    lineType="stepAfter"
                    showDots={false}
                    domain={[0, 5]}
                    ticks={[0, 1, 2, 3, 4, 5]}
                    formatY={(v) => `${v}%`}
                    formatTooltip={pct}
                    xTicks={['Mar 2022', 'Mar 2023', 'Mar 2024', 'Mar 2025', 'Mar 2026', 'Sep 2026']}
                    narrowXTicks={['Mar 2022', 'Mar 2024', 'Mar 2026']}
                    xTickFormat={(v) => (v === 'Sep 2026' ? 'Sep 26' : v.slice(4))}
                    callout={{ dataKey: 'rate', text: '4.60%' }}
                    ariaLabel="Step chart of the RBA cash rate rising from 0.10% in March 2022 to 4.35% by December 2023, easing to 3.60% in 2025, then rising to 4.60% by September 2026"
                />
                <h3 className="ins-panel-title ins-tally-title">Every decision, year by year</h3>
                <MovesTally />
            </Panel>
        </Section>

        <Section
            id="since-2011"
            number={2}
            title="The highest since 2011"
            lede={<p>The last time the cash rate was above 4.50% was early November 2011.</p>}
        >
            <Panel>
                <Timeline
                    items={[
                        { date: 'Nov 2011', title: 'Cut from 4.75% to 4.50%', body: 'It stayed at or below 4.50% for almost 15 years.' },
                        { date: 'Nov 2020', title: 'A record low of 0.10%' },
                        { date: 'May 2022', title: 'The first rise', body: 'Seven more followed before the end of 2022.' },
                        { date: 'Nov 2023', title: 'Up to 4.35%', body: 'After 13 rises in 18 months.' },
                        { date: 'Feb – Aug 2025', title: 'Three cuts, to 3.60%' },
                        { date: 'Feb – Sep 2026', title: 'Four rises, to 4.60%', body: 'The highest since November 2011.', state: 'now' },
                    ]}
                />
            </Panel>
        </Section>

        <Section
            id="mortgage-rates"
            number={3}
            title="What mortgage rates did"
            lede={
                <p>
                    Mortgage rates followed. The average variable rate on existing owner-occupier loans went from under 3%
                    to <strong>6.24%</strong>.
                </p>
            }
        >
            <Panel footnote="Average variable rate, outstanding owner-occupier loans, all lenders. RBA table F6. July 2026 is the latest month published, before September's rise.">
                <BarList
                    labelWidth="6.5rem"
                    max={8}
                    format={pct}
                    items={[
                        { label: MORTGAGE_RATE_THEN.label, value: THEN, tone: 'neutral' },
                        { label: MORTGAGE_RATE_NOW.label, value: NOW, tone: 'primary', highlight: true },
                    ]}
                    ariaLabel="Average variable mortgage rate: 2.86% in April 2022, 6.24% in July 2026"
                />
            </Panel>
        </Section>

        <Section
            id="repayment"
            number={4}
            kicker="Illustrative"
            title="What it did to a repayment"
            lede={
                <p>
                    On a $600,000 loan over 30 years, the repayment went from about $2,485 a month to $3,690. Pick a loan
                    size to compare.
                </p>
            }
        >
            <Repayments />
        </Section>

        <Section
            id="september"
            number={5}
            title="What September adds"
            lede={
                <p>
                    September&apos;s 0.25-point rise adds about another <strong>$98 a month</strong> on $600,000, if
                    it&apos;s passed on in full.
                </p>
            }
        >
            <KeyFigures
                items={LOANS.map((l) => ({
                    value: Math.round(gap(l, NOW, AFTER_SEPT)),
                    prefix: '+$',
                    label: `A month on a ${fmtAud(l)} loan, for each 0.25-point rise`,
                    foot: `${pct(NOW)} → ${pct(AFTER_SEPT)}`,
                    tone: l === 600000 ? 'accent' : undefined,
                }))}
            />
        </Section>

        <Section
            id="buffer"
            number={6}
            title="How lenders assess you"
            lede={
                <p>
                    APRA requires lenders to check you could keep up repayments at a rate <strong>3 points above</strong>{' '}
                    your loan rate. On $600,000 at {pct(NOW)}, that&apos;s a test at {pct(TEST)}: almost $5,000 a month.
                </p>
            }
        >
            <KeyFigures
                columns={2}
                items={[
                    { value: pay(600000, NOW), prefix: '$', label: `Monthly repayment on $600,000 at ${pct(NOW)}`, foot: 'What you pay' },
                    { value: pay(600000, TEST), prefix: '$', label: `What the lender tests you at, ${pct(TEST)}`, foot: 'APRA serviceability buffer', tone: 'accent' },
                ]}
            />
        </Section>

        <Section
            id="plan"
            number={7}
            title="Plan for both directions"
            lede={<p>Rates move both ways, so it pays to plan for both. Questions worth asking a broker or lender:</p>}
        >
            <Checklist
                icon={ChatBubbleLeftRightIcon}
                items={[
                    { title: 'What would my repayment be if rates rose again?', body: 'And does it still fit the budget?' },
                    { title: 'And if they fell?', body: 'How quickly would my lender pass a cut on?' },
                    { title: 'How much could I borrow at the buffer rate?', body: 'Lenders test you 3 points higher, which affects how much they’ll lend.' },
                    { title: 'What are my balance and remaining term?', body: "An existing loan's repayment depends on both, not just the rate." },
                ]}
            />
            <Callout icon={ArrowsUpDownIcon} tone="neutral" title="Not a forecast">
                <p>Nothing here says where rates go next. Speak to a lender or broker about your own loan.</p>
            </Callout>
        </Section>

        <InsightCTA
            title="Planning your next move? Talk to Arcadea."
            body="Buying your first home? A new home can cut the upfront cost: in Queensland, first home buyers pay no transfer duty on one."
            actions={[
                { href: '/#contact', label: 'Talk to our team' },
                { href: INSIGHTS.stampDuty.path, label: 'See the stamp duty insight' },
            ]}
        />

        <RelatedInsights items={[INSIGHTS.stampDuty, INSIGHTS.goldCoastGrowth]} />

        <FinePrint
            disclaimer={DISCLAIMER}
            details={DETAILS}
            disclosure={DISCLOSURE}
            updated={UPDATED}
            sources={SOURCES}
        />
    </InsightPage>
);

export default InterestRatesPage;
