import React from 'react';
import { HomeIcon, HomeModernIcon, BuildingOffice2Icon, ScaleIcon } from '@heroicons/react/24/outline';
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
    FeatureCards,
    BarList,
    DotGrid,
    Timeline,
    InsightCTA,
    RelatedInsights,
    FinePrint,
} from '../../components/insights/InsightKit';
import { fmtInt } from '../../components/insights/format';
import { InsightLineChart, ChartDataTable } from '../../components/InsightCharts';
import { GoldCoastMap } from '../../components/insights/InsightMaps';
import { INSIGHTS } from '../../data/insights/shared';
import {
    VIDEO,
    POPULATION,
    TEN_YEAR_GROWTH,
    LAST_YEAR_GROWTH,
    PLAN,
    APPROVALS,
    APPROVALS_AVERAGE,
    ATTACHED_TARGET,
    ATTACHED_DELIVERED_MAX,
    APARTMENTS_AT_RISK,
    PROJECTIONS,
    DISCLOSURE,
    UPDATED,
    DISCLAIMER,
    DETAILS,
    SOURCES,
    ATTRIBUTIONS,
} from '../../data/insights/goldCoastGrowth';

const skylineSet = (format) =>
    [800, 1400, 2000].map((w) => `/images/insights/gold-coast-skyline-${w}.${format} ${w}w`).join(', ');

const HERO_IMAGE = {
    src: '/images/insights/gold-coast-skyline-1400.jpg',
    sources: [
        { type: 'image/avif', srcSet: skylineSet('avif') },
        { type: 'image/webp', srcSet: skylineSet('webp') },
    ],
    position: '60% 40%',
};

const GoldCoastGrowthPage = () => (
    <InsightPage seo={INSIGHTS.goldCoastGrowth.seo}>
        <InsightHero
            eyebrow="Data story · Gold Coast · October 2026"
            title="A million people by 2046."
            accent="Where will they live?"
            subtitle="The City of Gold Coast is planning for a million residents and 185,000 new homes. Approvals just hit a ten-year high, but are still short of the pace the plan needs, and the plan points inland and upward."
            image={HERO_IMAGE}
            video={VIDEO}
            notice={<><strong>General information only.</strong> Not financial, tax or legal advice, and not a forecast.</>}
            stats={[
                { value: 691230, label: 'Gold Coast residents in June 2025, up 129,601 in ten years', foot: 'QGSO · preliminary' },
                { value: PLAN.homes, label: "New homes the council's growth strategy says a million residents will need", foot: 'By 2046' },
                { value: 7586, label: 'Homes approved in 2025–26, a ten-year high', foot: 'ABS building approvals' },
            ]}
        />

        <ShortVersion
            items={[
                'The Gold Coast added 129,601 people in ten years, to 691,230 in June 2025. Almost 12,000 of them arrived in the last year.',
                "The council's growth strategy plans for a million residents by 2046. That needs 185,000 new homes: about 9,250 a year.",
                "Approvals hit 7,586 in 2025–26, a ten-year high, but still short of that pace. And approved isn't built.",
                'Growth is planned inland along the rail line and in Southport, with more townhouses and mid-rise. The planning scheme that sets the rules is due in 2027.',
            ]}
        />

        <Section
            id="the-plan"
            number={1}
            title="A million by 2046"
            lede={
                <p>
                    The City of Gold Coast&apos;s Local Growth Management Strategy plans for{' '}
                    <strong>more than a million residents by 2046</strong>. In the council&apos;s words, that&apos;s almost
                    390,000 new residents and 185,000 new homes over the next 20 years.
                </p>
            }
        >
            <KeyFigures
                items={[
                    { value: PLAN.residents, label: 'Residents the strategy plans for', foot: 'By 2046' },
                    { value: PLAN.homes, label: 'New homes needed over 20 years', foot: 'City of Gold Coast' },
                    { value: PLAN.perYear, prefix: '≈', label: 'Homes a year, to keep pace', foot: '185,000 ÷ 20', tone: 'accent' },
                ]}
            />
        </Section>

        <Section
            id="growth-so-far"
            number={2}
            title="Growth so far"
            lede={<p>The city has added almost 130,000 people in ten years, to 691,230 in June 2025.</p>}
        >
            <Panel
                footnote="Estimated resident population of the City of Gold Coast at 30 June. 2022–2024 are revised estimates; 2025 is preliminary and may be revised. Source: QGSO, from ABS Regional population 2024–25."
                table={
                    <ChartDataTable
                        caption="City of Gold Coast estimated resident population at 30 June"
                        columns={['Year', 'Residents', 'Status']}
                        rows={POPULATION.map((r) => [r.year, fmtInt(r.people), r.note || 'final'])}
                    />
                }
            >
                <LiveNote>
                    Last year alone: <strong>+{fmtInt(LAST_YEAR_GROWTH)} people</strong> (+1.8%).
                </LiveNote>
                <InsightLineChart
                    data={POPULATION}
                    xKey="year"
                    series={[{ dataKey: 'people', name: 'Residents', color: 'var(--chart-a)' }]}
                    domain={[540000, 700000]}
                    ticks={[550000, 600000, 650000, 700000]}
                    formatY={(v) => `${v / 1000}k`}
                    formatTooltip={fmtInt}
                    narrowXTicks={['2015', '2017', '2019', '2021', '2023', '2025']}
                    callout={{ dataKey: 'people', text: `+${fmtInt(TEN_YEAR_GROWTH)} in ten years` }}
                    ariaLabel="Line chart of the Gold Coast's population rising from 561,629 in 2015 to 691,230 in 2025"
                />
            </Panel>
        </Section>

        <Section
            id="homes-needed"
            number={3}
            title="The homes needed, against approvals"
            lede={
                <p>
                    The plan needs about <strong>9,250 homes a year</strong>. Approvals hit a ten-year high of 7,586 in
                    2025–26. The year before, they were 4,099.
                </p>
            }
        >
            <Panel
                footnote="Residential building approvals, City of Gold Coast, years to 30 June. The ten-year average is 2016–17 to 2025–26. The 9,250 a year is 185,000 homes over 20 years. Source: ABS Building Approvals via .id; City of Gold Coast."
                table={
                    <ChartDataTable
                        caption="Residential building approvals, City of Gold Coast"
                        columns={['Year to 30 June', 'Homes approved']}
                        rows={APPROVALS.map((r) => [r.year, fmtInt(r.homes)])}
                    />
                }
            >
                <BarList
                    labelWidth="4.6rem"
                    max={10000}
                    markers={[
                        { value: PLAN.perYear, label: '9,250 needed' },
                        { value: APPROVALS_AVERAGE, label: '5,553 average', level: 1 },
                    ]}
                    items={APPROVALS.map((r) => ({
                        label: r.year,
                        value: r.homes,
                        tone: r.year === '2025–26' ? 'accent' : 'neutral',
                        highlight: r.year === '2025–26',
                    }))}
                    ariaLabel="Homes approved each year on the Gold Coast, 2016–17 to 2025–26, against the 9,250 a year the plan needs"
                />
            </Panel>
        </Section>

        <Section
            id="approved-isnt-built"
            number={4}
            kicker="Industry research"
            title="Approved isn't built"
            lede={
                <p>
                    The Property Council of Australia, an industry body, says apartments and townhouses have been delivered
                    at <strong>under a third of the regional target</strong> each year since 2019, and that more than half
                    the apartments due in 2027–28 are at risk.
                </p>
            }
        >
            <Split>
                <Panel>
                    <h3 className="ins-panel-title">Apartments and townhouses, per year</h3>
                    <BarList
                        max={6000}
                        items={[
                            { label: 'Regional plan target', sub: '2021–31', value: ATTACHED_TARGET, tone: 'neutral' },
                            { label: 'Delivered each year since 2019', sub: 'Under a third of the target', value: ATTACHED_DELIVERED_MAX, display: `Under ${fmtInt(ATTACHED_DELIVERED_MAX)}`, tone: 'accent', highlight: true },
                        ]}
                        ariaLabel="Apartments and townhouses: a regional plan target of about 5,643 a year against under 1,881 delivered each year since 2019"
                    />
                    <p className="ins-footnote">
                        Target ≈5,643 a year under the regional plan, ShapingSEQ. &quot;Under a third&quot; is shown as
                        its upper bound, 1,881. Source: Property Council of Australia (research by Urbis).
                    </p>
                </Panel>
                <Panel>
                    <h3 className="ins-panel-title">Apartments due in 2027–28</h3>
                    <DotGrid
                        total={100}
                        lit={APARTMENTS_AT_RISK}
                        columns={10}
                        ariaLabel="58 of 100 dots highlighted: 58% of apartments due in 2027–28 are at moderate or high risk"
                    />
                    <KeyFigures
                        columns={1}
                        items={[{ value: APARTMENTS_AT_RISK, suffix: '%', label: 'At moderate or high risk of delay or withdrawal', foot: 'Property Council / Urbis' }]}
                    />
                </Panel>
            </Split>
        </Section>

        <Section
            id="where"
            number={5}
            title="Where growth is planned"
            lede={<p>The strategy points inland and upward, to centres with public transport, shops, parks and schools.</p>}
        >
            <Split>
                <Prose>
                    <p>
                        <strong>Along the rail line.</strong> The strategy directs more density to inland town centres on
                        the Gold Coast line, such as <strong>Coomera</strong>, <strong>Helensvale</strong> and{' '}
                        <strong>Robina</strong>.
                    </p>
                    <p>
                        <strong>Southport.</strong> Linked by the G:link light rail, Southport has been a state Priority
                        Development Area since 4 October 2013, covering the Southport CBD.
                    </p>
                    <p>
                        The map joins stations and stops in order; it isn&apos;t the exact track. Markers show the centres
                        named above, not specific sites.
                    </p>
                </Prose>
                <Panel>
                    <GoldCoastMap />
                </Panel>
            </Split>
        </Section>

        <Section
            id="what-kind"
            number={6}
            title="What kind of homes"
            lede={<p>The strategy favours townhouses, terraces and medium-rise apartments over detached houses in most suburbs.</p>}
        >
            <FeatureCards
                items={[
                    { icon: HomeIcon, title: 'Detached houses', body: 'Fewer, in most suburbs.', tag: 'Fewer', dim: true },
                    { icon: HomeModernIcon, title: 'Townhouses and terraces', body: 'Favoured over detached houses in most suburbs.', tag: 'More', highlight: true },
                    { icon: BuildingOffice2Icon, title: 'Medium-rise apartments', body: 'Favoured too, with density directed to centres with transport.', tag: 'More', highlight: true },
                ]}
            />
        </Section>

        <Section
            id="status"
            number={7}
            title="Where the plan is up to"
            lede={<p>A strategy isn&apos;t a promise. The rules that decide what can be built come later.</p>}
        >
            <Panel>
                <Timeline
                    items={[
                        { date: 'Feb 2026', title: 'Strategy released', body: 'Reported by ABC News on 16 February.' },
                        { date: '10 Mar 2026', title: 'In-principle support from council' },
                        { date: '20 Apr – 31 Jul 2026', title: 'Community feedback' },
                        { date: 'Next', title: 'A refined strategy returns to council for endorsement', state: 'now' },
                        { date: '2027', title: 'New planning scheme', body: 'The actual rules: zoning, land use, building height and density.', state: 'next' },
                    ]}
                />
            </Panel>
        </Section>

        <Section
            id="forecasts"
            number={8}
            title="A gap isn't a forecast"
            lede={
                <p>
                    Even the state&apos;s own projections for 2046 range from under 900,000 people to over 1.1 million.
                    Costs, interest rates and migration can all change the picture.
                </p>
            }
        >
            <Panel
                footnote="Queensland Government population projections, 2023 edition, for the Gold Coast SA4 region, which is slightly larger than the council area. Projections are not forecasts of prices or rents."
                table={
                    <ChartDataTable
                        caption="Gold Coast SA4 population projections"
                        columns={['Year · series', 'People']}
                        rows={PROJECTIONS.map((p) => [p.label, fmtInt(p.people)])}
                    />
                }
            >
                <BarList
                    max={1200000}
                    markers={[{ value: PLAN.residents, label: 'The plan: 1 million' }]}
                    items={PROJECTIONS.map((p) => ({
                        label: p.label,
                        sub: p.sub,
                        value: p.people,
                        tone: p.label === '2021' ? 'neutral' : 'primary',
                    }))}
                    ariaLabel="Gold Coast population projections for 2046: low 885,735, medium 1,007,115, high 1,151,185, against 649,491 in 2021"
                />
            </Panel>
            <Callout icon={ScaleIcon} tone="neutral" title="What this page doesn't say">
                <p>
                    A gap between the homes needed and the homes built is not a forecast that prices or rents will rise.
                    Nothing here predicts either.
                </p>
            </Callout>
        </Section>

        <InsightCTA
            title="A city planning for a million. Find your place in it."
            body="Questions about the plan, or about new homes in the corridors it names? Talk to our team."
            actions={[
                { href: '/properties', label: 'Browse properties' },
                { href: '/#contact', label: 'Talk to our team' },
            ]}
        />

        <RelatedInsights items={[INSIGHTS.migration, INSIGHTS.rates]} />

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

export default GoldCoastGrowthPage;
