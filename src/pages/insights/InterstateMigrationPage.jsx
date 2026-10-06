import React from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import {
    InsightPage,
    InsightHero,
    ShortVersion,
    Section,
    Panel,
    Split,
    Prose,
    Callout,
    LiveNote,
    KeyFigures,
    BarList,
    SplitBar,
    DotGrid,
    InsightCTA,
    RelatedInsights,
    FinePrint,
} from '../../components/insights/InsightKit';
import { fmtInt, fmtSigned } from '../../components/insights/format';
import { InsightLineChart, ChartDataTable } from '../../components/InsightCharts';
import { AustraliaFlowMap } from '../../components/insights/InsightMaps';
import { INSIGHTS } from '../../data/insights/shared';
import {
    VIDEO,
    BY_STATE,
    BY_ORIGIN,
    TOTAL_IN,
    TOTAL_OUT,
    NET,
    SYDNEY,
    SETTLED,
    TREND,
    STREAK,
    DISCLOSURE,
    UPDATED,
    DISCLAIMER,
    DETAILS,
    SOURCES,
    ATTRIBUTIONS,
} from '../../data/insights/interstateMigration';

const skylineSet = (format) =>
    [800, 1400, 2000].map((w) => `/images/insights/gold-coast-skyline-${w}.${format} ${w}w`).join(', ');

const HERO_IMAGE = {
    src: '/images/insights/gold-coast-skyline-1400.jpg',
    sources: [
        { type: 'image/avif', srcSet: skylineSet('avif') },
        { type: 'image/webp', srcSet: skylineSet('webp') },
    ],
    position: '65% 40%',
};

const restShare = Math.round((SETTLED[0].net / NET) * 100);

const InterstateMigrationPage = () => (
    <InsightPage seo={INSIGHTS.migration.seo}>
        <InsightHero
            eyebrow="Data story · Queensland · October 2026"
            title="Who's moving to Queensland,"
            accent="and where from?"
            subtitle="Queensland gained more people from other states than anywhere else in the year to March 2026: mostly from New South Wales, and mostly outside Brisbane. The pace has slowed, but the streak hasn't broken since 1981."
            image={HERO_IMAGE}
            video={VIDEO}
            notice={<><strong>General information only.</strong> ABS figures, some provisional and subject to revision.</>}
            stats={[
                { value: NET, prefix: '+', label: 'Net gain from other states, the most of any state', foot: 'Year to March 2026' },
                { value: restShare, suffix: '%', label: 'Of the gain settled outside Greater Brisbane', foot: 'ABS · provisional' },
                { value: STREAK.quarters, label: 'Quarters in a row of net gains from interstate', foot: `Since ${STREAK.since}` },
            ]}
        />

        <ShortVersion
            items={[
                'Only three states gained people from interstate in the year to March 2026. Queensland gained the most: +14,718.',
                '98,121 people moved to Queensland from other states and 83,403 left. The gain is what was left over.',
                'New South Wales was the biggest source (+9,925), then Victoria (+5,401). Sydney alone added a net 7,081.',
                "58% of the gain went outside Greater Brisbane. It's the smallest gain since 2016, but Queensland has gained in all 180 quarters since June 1981.",
            ]}
        />

        <Section
            id="leader"
            number={1}
            title="Queensland leads the country"
            lede={
                <p>
                    In the year to March 2026, only three states gained people from interstate. Queensland gained the
                    most: <strong>almost 15,000</strong>.
                </p>
            }
        >
            <Panel
                footnote="Net interstate migration, year ending 31 March 2026. Source: ABS, National, state and territory population, March 2026."
                table={
                    <ChartDataTable
                        caption="Net interstate migration by state and territory, year to March 2026"
                        columns={['State or territory', 'Net interstate migration']}
                        rows={BY_STATE.map((s) => [s.name, fmtSigned(s.net)])}
                    />
                }
            >
                <BarList
                    min={-22000}
                    max={16000}
                    format={fmtSigned}
                    items={BY_STATE.map((s) => ({
                        label: s.name,
                        value: s.net,
                        tone: 'auto',
                        highlight: s.code === 'QLD',
                    }))}
                    ariaLabel="Net interstate migration by state, year to March 2026"
                />
            </Panel>
        </Section>

        <Section
            id="both-ways"
            number={2}
            title="It's a two-way street"
            lede={<p>Almost 100,000 people moved to Queensland from other states, and more than 80,000 moved out. The gain is what&apos;s left over.</p>}
        >
            <Panel>
                <BarList
                    max={100000}
                    items={[
                        { label: 'Moved to Queensland', value: TOTAL_IN, tone: 'primary' },
                        { label: 'Moved from Queensland', value: TOTAL_OUT, tone: 'negative' },
                        { label: 'Net gain', value: NET, display: `+${fmtInt(NET)}`, tone: 'accent', highlight: true },
                    ]}
                    ariaLabel="98,121 people moved to Queensland from other states and 83,403 moved out, a net gain of 14,718"
                />
            </Panel>
        </Section>

        <Section
            id="from-where"
            number={3}
            title="Where they came from"
            lede={
                <p>
                    Most of the gain came from <strong>New South Wales</strong>, with Victoria next. But not everyone heads
                    north: more people left Queensland for Western Australia and Tasmania than came the other way.
                </p>
            }
        >
            <Split>
                <Panel>
                    <AustraliaFlowMap
                        flows={BY_ORIGIN.map(({ code, net }) => ({ code, net }))}
                        ariaLabel="Map of Australia with arrows into Queensland from New South Wales, Victoria, the Northern Territory, the ACT and South Australia, and out of Queensland to Western Australia and Tasmania. Arrow width shows the size of each net flow."
                    />
                </Panel>
                <Panel
                    footnote="Net moves to Queensland, by the other state, four quarters to March 2026. ABS provisional regional estimates."
                    table={
                        <ChartDataTable
                            caption="Moves to and from Queensland by state, year to March 2026"
                            columns={['State', 'To Queensland', 'From Queensland', 'Net']}
                            rows={BY_ORIGIN.map((o) => [o.name, fmtInt(o.moved_in), fmtInt(o.moved_out), fmtSigned(o.net)])}
                        />
                    }
                >
                    <BarList
                        min={-3000}
                        max={10500}
                        format={fmtSigned}
                        items={BY_ORIGIN.map((o) => ({
                            label: o.name,
                            sub: `${fmtInt(o.moved_in)} in · ${fmtInt(o.moved_out)} out`,
                            value: o.net,
                            tone: 'auto',
                        }))}
                        ariaLabel="Net moves to Queensland by state of origin"
                    />
                </Panel>
            </Split>
        </Section>

        <Section
            id="sydney"
            number={4}
            title="Sydney"
            lede={
                <p>
                    Greater Sydney was the largest single source. Around 20,000 people came north, and 13,000 went back
                    the other way.
                </p>
            }
        >
            <KeyFigures
                items={[
                    { value: SYDNEY.moved_in, label: 'Moved from Greater Sydney to Queensland', foot: 'Year to March 2026' },
                    { value: SYDNEY.moved_out, label: 'Moved from Queensland to Greater Sydney', foot: 'Year to March 2026' },
                    { value: SYDNEY.net, prefix: '+', label: 'Net gain to Queensland from Sydney alone', foot: 'ABS · provisional', tone: 'accent' },
                ]}
            />
        </Section>

        <Section
            id="where-they-settled"
            number={5}
            title="Where they settled"
            lede={<p>Most of the gain didn&apos;t land in Brisbane. Almost six in ten went to the rest of the state.</p>}
        >
            <Panel footnote={`Net interstate migration, year to March 2026. Greater Brisbane: ${fmtInt(SETTLED[1].moved_in)} in, ${fmtInt(SETTLED[1].moved_out)} out. Rest of Queensland: ${fmtInt(SETTLED[0].moved_in)} in, ${fmtInt(SETTLED[0].moved_out)} out. ABS provisional regional estimates.`}>
                <SplitBar
                    format={(n) => `+${fmtInt(n)}`}
                    ariaLabel={`Of Queensland's net gain of ${fmtInt(NET)}, ${fmtInt(SETTLED[0].net)} went to the rest of Queensland and ${fmtInt(SETTLED[1].net)} to Greater Brisbane`}
                    parts={[
                        { label: `Rest of Queensland (${restShare}%)`, value: SETTLED[0].net, tone: 'accent' },
                        { label: `Greater Brisbane (${100 - restShare}%)`, value: SETTLED[1].net, tone: 'primary' },
                    ]}
                />
            </Panel>
        </Section>

        <Section
            id="trend"
            number={6}
            title="Slowing, but still first"
            lede={
                <p>
                    It&apos;s Queensland&apos;s smallest annual gain since 2016, well down from the peak of 40,057 in 2022.
                    It&apos;s still the largest in the country.
                </p>
            }
        >
            <Panel
                footnote="Queensland net interstate migration, sum of four quarters to March each year. Source: ABS, Table 2."
                table={
                    <ChartDataTable
                        caption="Queensland net interstate migration, years to March"
                        columns={['Year to March', 'Net gain']}
                        rows={TREND.map((r) => [r.year, `+${fmtInt(r.net)}`])}
                    />
                }
            >
                <LiveNote>
                    Peak: <strong>+40,057</strong> in the year to March 2022.
                </LiveNote>
                <InsightLineChart
                    data={TREND}
                    xKey="year"
                    series={[{ dataKey: 'net', name: 'Net gain', color: 'var(--chart-a)' }]}
                    domain={[0, 45000]}
                    ticks={[0, 10000, 20000, 30000, 40000]}
                    formatY={(v) => (v === 0 ? '0' : `${v / 1000}k`)}
                    formatTooltip={(v) => `+${fmtInt(v)}`}
                    narrowXTicks={['2016', '2018', '2020', '2022', '2024', '2026']}
                    callout={{ dataKey: 'net', text: '+14,718, smallest since 2016' }}
                    ariaLabel="Line chart of Queensland's net interstate gain, rising from 10,546 in 2016 to a peak of 40,057 in 2022, then falling to 14,718 in 2026"
                />
            </Panel>
        </Section>

        <Section
            id="since-1981"
            number={7}
            title="45 years of gains"
            lede={
                <p>
                    Queensland has gained people from interstate in <strong>every quarter since June 1981</strong>: 180 in
                    a row. The smallest was +589, in the March quarter of 2010.
                </p>
            }
        >
            <Split>
                <Panel>
                    <DotGrid
                        total={STREAK.quarters}
                        lit={STREAK.quarters}
                        columns={20}
                        tone="primary"
                        ariaLabel="180 dots, one for every quarter since June 1981, all showing a net gain"
                    />
                    <p className="ins-footnote">One dot per quarter, June 1981 to March 2026. Every one is a net gain.</p>
                </Panel>
                <Prose>
                    <p>
                        The Queensland Government Statistician&apos;s Office notes that Queensland is the only state or
                        territory to have gained population through net interstate migration in every quarter since June
                        1981.
                    </p>
                </Prose>
            </Split>
            <Callout icon={InformationCircleIcon} tone="neutral" title="Keep in mind">
                <p>
                    The ABS calls the regional figures provisional, and they may be revised. They count moves, not
                    reasons: nothing here says why people move, or what it means for prices or rents.
                </p>
            </Callout>
        </Section>

        <InsightCTA
            title="Thinking about making the move?"
            body="Whether you're heading north or already here, talk to us about new homes in Queensland."
            actions={[
                { href: '/properties', label: 'Browse properties' },
                { href: '/#contact', label: 'Talk to our team' },
            ]}
        />

        <RelatedInsights items={[INSIGHTS.goldCoastGrowth, INSIGHTS.defenceHousing]} />

        <FinePrint
            disclaimer={DISCLAIMER}
            details={DETAILS}
            disclosure={DISCLOSURE}
            updated={UPDATED}
            sources={SOURCES}
            attributions={ATTRIBUTIONS}
        />
    </InsightPage>
);

export default InterstateMigrationPage;
