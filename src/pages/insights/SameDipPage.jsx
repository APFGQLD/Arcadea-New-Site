import React from 'react';
import { ScaleIcon } from '@heroicons/react/24/outline';
import {
    InsightPage,
    InsightHero,
    ShortVersion,
    Section,
    Panel,
    Callout,
    KeyFigures,
    BarList,
    SplitBar,
    Timeline,
    InsightCTA,
    RelatedInsights,
    FinePrint,
} from '../../components/insights/InsightKit';
import { fmtAud } from '../../components/insights/format';
import { InsightLineChart, ChartDataTable } from '../../components/InsightCharts';
import { INSIGHTS } from '../../data/insights/shared';
import {
    VIDEO,
    FROM_PEAK,
    FIVE_YEARS,
    RENTS,
    YIELD,
    BRISBANE_INDEX,
    PAST_FALL,
    DOW_AUD,
    HOME_PRICE,
    DEPOSIT_SHARE,
    FALL,
    DISCLOSURE,
    UPDATED,
    DISCLAIMER,
    DETAILS,
    SOURCES,
} from '../../data/insights/sameDip';

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

const pct1 = (n) => `${n.toFixed(1)}%`;

const DEPOSIT = HOME_PRICE * DEPOSIT_SHARE;
const LOST = HOME_PRICE * FALL;

const SameDipPage = () => (
    <InsightPage seo={INSIGHTS.sameDip.seo}>
        <InsightHero
            eyebrow="Brisbane · Home values · October 2026"
            title="Same number,"
            accent="different fear."
            subtitle="Brisbane home values are about 5% off their peak, and that's the number in the news. Zoom out and the picture changes. Here's what five years of Brisbane values, a past downturn and this year's rents actually show."
            image={HERO_IMAGE}
            video={VIDEO}
            notice={<><strong>General information only.</strong> Past performance is not a reliable indicator of future performance.</>}
            stats={[
                { value: Math.abs(FROM_PEAK), decimals: 1, prefix: '−', suffix: '%', label: 'Brisbane dwelling values from the May 2026 peak', foot: 'To 30 September 2026' },
                { value: FIVE_YEARS, decimals: 1, prefix: '+', suffix: '%', label: 'Brisbane dwelling values over five years', foot: 'Since 30 September 2021' },
                { value: RENTS.houses, decimals: 1, prefix: '+', suffix: '%', label: 'Brisbane house rents over the past year', foot: `Units +${pct1(RENTS.units)}` },
            ]}
        />

        <ShortVersion
            items={[
                `Brisbane dwelling values are ${pct1(Math.abs(FROM_PEAK))} below their May 2026 peak.`,
                `Over five years, they're still ${pct1(FIVE_YEARS)} higher.`,
                `This isn't the first dip on the way up. In 2022–23, values fell ${pct1(Math.abs(PAST_FALL))}, then reached a new record in October 2023.`,
                `Rents kept rising through the dip: Brisbane house rents are up ${pct1(RENTS.houses)} on a year ago, and unit rents ${pct1(RENTS.units)}.`,
                'Borrowing is part of why a dip feels bigger: with a 20% deposit, a 5% fall is a quarter of your deposit.',
            ]}
        />

        <Section
            id="the-number"
            number={1}
            title="The number in the news"
            lede={
                <>
                    <p>
                        Brisbane values have fallen <strong>{pct1(Math.abs(FROM_PEAK))}</strong> since their peak in May
                        2026. That&apos;s the figure that makes headlines.
                    </p>
                    <p>
                        Picture the same move in a share portfolio: up 55% in five years, down 5% from the top. Most
                        people would call that a good run. With a home, it tends to feel like a crash.
                    </p>
                    <p><strong>Same number. Different fear.</strong></p>
                </>
            }
        >
            <KeyFigures
                columns={2}
                items={[
                    { value: Math.abs(FROM_PEAK), decimals: 1, prefix: '−', suffix: '%', label: 'Brisbane dwelling values from the May 2026 peak', foot: 'Source: Cotality HVI, Oct 2026' },
                    { value: FIVE_YEARS, decimals: 1, prefix: '+', suffix: '%', label: 'Brisbane dwelling values over five years', foot: 'Source: Cotality HVI, Oct 2026', tone: 'accent' },
                ]}
            />
        </Section>

        <Section
            id="five-years"
            number={2}
            title="Zoom out: five years of Brisbane values"
            lede={
                <p>
                    Over the five years to September 2026, Brisbane dwelling values rose <strong>{pct1(FIVE_YEARS)}</strong>.
                    The recent dip is the last few months of that run. On a five-year chart, it&apos;s a small step down
                    near the top.
                </p>
            }
        >
            <Panel
                footnote="Year-end points plus 2026 months, worked back from Cotality's October 2026 figures using published annual changes. The points aren't evenly spaced in time. Source: Cotality Home Value Index."
                table={
                    <ChartDataTable
                        caption="Brisbane dwelling values, September 2021 = 100"
                        columns={['Point', 'Index']}
                        rows={BRISBANE_INDEX.map((r) => [r.note ? `${r.label} (${r.note.toLowerCase()})` : r.label, r.index.toFixed(1)])}
                    />
                }
            >
                <InsightLineChart
                    data={BRISBANE_INDEX}
                    xKey="label"
                    series={[{ dataKey: 'index', name: 'Brisbane dwelling values', color: 'var(--chart-b)' }]}
                    domain={[0, 180]}
                    ticks={[0, 50, 100, 150]}
                    formatY={(v) => String(v)}
                    formatTooltip={(v) => v.toFixed(1)}
                    xTicks={['Sep 2021', 'Dec 2022', 'Dec 2023', 'Dec 2024', 'Dec 2025', 'Sep 2026']}
                    narrowXTicks={['Sep 2021', 'Dec 2023', 'Sep 2026']}
                    xTickFormat={(v, idx, lastIdx) => (idx === 0 || idx === lastIdx ? v : v.slice(4))}
                    callout={{ dataKey: 'index', x: 'May 2026', text: 'Peak 164.3' }}
                    renderTooltip={(row) => (
                        <>
                            <strong>{row.label}{row.note ? ` (${row.note.toLowerCase()})` : ''}</strong>
                            <span className="tip-row">Index: {row.index.toFixed(1)}</span>
                        </>
                    )}
                    ariaLabel="Line chart of Brisbane dwelling values, September 2021 = 100: 109.1 at December 2021, 107.9 at December 2022, 121.9 at December 2023, 135.6 at December 2024, 155.2 at December 2025, a peak of 164.3 in May 2026, then 155.4 in September 2026"
                />
            </Panel>
        </Section>

        <Section
            id="not-a-straight-line"
            number={3}
            title="The climb wasn't a straight line"
            lede={
                <p>
                    Brisbane has been here before. Values peaked in June 2022 and fell{' '}
                    <strong>{pct1(Math.abs(PAST_FALL))}</strong> to January 2023. By October 2023 they were back at a
                    record high.
                </p>
            }
        >
            <Panel footnote="Sources: CoreLogic Home Value Index, November 2023 release; Cotality Home Value Index, October 2026.">
                <Timeline
                    items={[
                        { date: 'June 2022', title: 'Peak' },
                        { date: 'January 2023', title: `Down ${pct1(Math.abs(PAST_FALL))}` },
                        { date: 'October 2023', title: 'Back at a record' },
                        { date: 'September 2026', title: `${pct1(Math.abs(FROM_PEAK))} below the May 2026 peak`, state: 'now' },
                    ]}
                />
            </Panel>
            <Callout tone="neutral" title="Past performance is not a reliable indicator of future performance">
                <p>This shows that dips have happened inside the long run, not what happens next.</p>
            </Callout>
        </Section>

        <Section
            id="reference-point"
            number={4}
            kicker="Reference point"
            title="Shares over the same five years"
            lede={
                <p>
                    Over the same five years, the Dow Jones rose about the same amount as Brisbane values, in Australian
                    dollars. Both are price changes only: dividends and rent aren&apos;t included on either side.
                </p>
            }
        >
            <Panel footnote="Price change only, 30 September 2021 to 30 September 2026. Dow converted at the AUD/USD rate on each date. Sources: Cotality HVI; Dow Jones closes; RBA exchange rates.">
                <BarList
                    max={70}
                    format={(v) => `+${pct1(v)}`}
                    items={[
                        { label: 'Brisbane dwelling values', value: FIVE_YEARS, tone: 'accent', highlight: true },
                        { label: 'Dow Jones', sub: 'In Australian dollars', value: DOW_AUD, tone: 'neutral' },
                    ]}
                    ariaLabel={`Price change over five years: Brisbane dwelling values +${pct1(FIVE_YEARS)}, Dow Jones in Australian dollars +${pct1(DOW_AUD)}`}
                />
            </Panel>
            <Callout icon={ScaleIcon} tone="neutral" title="Not a comparison of investments">
                <p>Shares are here only to show how differently the same number can feel.</p>
            </Callout>
        </Section>

        <Section
            id="rents"
            number={5}
            title="Rents kept climbing"
            lede={
                <p>
                    While values dipped from their peak, rents kept rising. Brisbane house rents are up{' '}
                    <strong>{pct1(RENTS.houses)}</strong> over the year to September 2026, and unit rents{' '}
                    <strong>{pct1(RENTS.units)}</strong>. Brisbane&apos;s gross rental yield for dwellings is about{' '}
                    {pct1(YIELD)}.
                </p>
            }
        >
            <Panel footnote="Change in rents over the 12 months to 30 September 2026. Source: Cotality Home Value Index, October 2026.">
                <BarList
                    labelWidth="5rem"
                    max={8}
                    format={(v) => `+${pct1(v)}`}
                    items={[
                        { label: 'Houses', value: RENTS.houses, tone: 'accent', highlight: true },
                        { label: 'Units', value: RENTS.units, tone: 'accent' },
                    ]}
                    ariaLabel={`Brisbane rents over 12 months: houses +${pct1(RENTS.houses)}, units +${pct1(RENTS.units)}`}
                />
            </Panel>
        </Section>

        <Section
            id="borrowing"
            number={6}
            kicker="Illustrative"
            title="Why a dip feels bigger with a home"
            lede={
                <>
                    <p>
                        Most homes are bought with a loan, and that magnifies how a change in value feels. On an{' '}
                        {fmtAud(HOME_PRICE)} home bought with a 20% deposit ({fmtAud(DEPOSIT)}), a 5% fall is{' '}
                        <strong>{fmtAud(LOST)}</strong>. That&apos;s a quarter of the deposit.
                    </p>
                    <p>
                        It&apos;s a real reason for caution. It&apos;s also why it helps to look at the whole climb, not
                        just the last step.
                    </p>
                </>
            }
        >
            <Panel footnote="Illustrative example only.">
                <SplitBar
                    format={fmtAud}
                    parts={[
                        { label: 'Lost in a 5% fall', value: LOST, tone: 'negative' },
                        { label: 'Deposit left', value: DEPOSIT - LOST, tone: 'neutral' },
                    ]}
                    ariaLabel={`A ${fmtAud(DEPOSIT)} deposit: ${fmtAud(LOST)} lost in a 5% fall, ${fmtAud(DEPOSIT - LOST)} left`}
                />
            </Panel>
        </Section>

        <InsightCTA
            title="Look at the whole climb, not just the last step."
            body="If you're weighing up your next move, talk to the team at Arcadea."
            actions={[{ href: '/#contact', label: 'Talk to the team' }]}
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

export default SameDipPage;
