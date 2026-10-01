import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    ShieldCheckIcon,
    LockClosedIcon,
    ReceiptPercentIcon,
    ArrowTrendingUpIcon,
    FireIcon,
    ExclamationTriangleIcon,
    ArrowDownTrayIcon,
    ChevronDownIcon,
    ArrowTopRightOnSquareIcon,
    InformationCircleIcon,
} from '@heroicons/react/24/outline';
import usePageTitle from '../hooks/usePageTitle';
import useInView from '../hooks/useInView';
import { useNavVisibility } from '../context/NavVisibilityContext';
import {
    CountUp,
    Segmented,
    Legend,
    InsightBarChart,
    InsightLineChart,
    ChartDataTable,
} from '../components/InsightCharts';
import {
    REPORT_URL,
    REPORT_TITLE,
    PRODUCTS,
    SHORT_LABEL,
    HERO_STATS,
    KEY_MESSAGES,
    RETURNS_BY_BUDGET,
    BUDGETS,
    LEVERAGE_SERIES,
    LEVERAGE_YEARS,
    TAX_PICTURE,
    OLYMPIC_CITIES,
    SCENARIOS,
    SCENARIO_RETURNS,
    RISKS,
    FAQS,
    DISCLAIMER,
    DISCLAIMER_DETAILS,
    DISCLAIMER_UPDATED,
    SOURCES,
} from '../data/newVsEstablishedData';
import './NewVsEstablishedPage.css';

/* Chart colours — defined per theme in the CSS (validated for CVD + contrast) */
const C_39 = 'var(--chart-a)';
const C_47 = 'var(--chart-b)';
const C_ACCENT = 'var(--chart-b)';
const C_NEUTRAL = 'var(--chart-neutral)';

const pct = (n) => `${n.toFixed(1)}%`;
const aud = (n) =>
    new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(n);
const audK = (n) => (n === 0 ? '$0' : `$${Math.round(n / 1000)}k`);
const audM = (n) => `$${(n / 1000000).toFixed(n % 1000000 === 0 ? 1 : 2).replace(/\.?0+$/, '')}M`;
const budgetLabel = (b) => `$${(b / 1000000).toFixed(1)}M`;

const BRACKET_OPTIONS = [
    { value: 39, label: '39% taxpayer' },
    { value: 47, label: '47% taxpayer' },
];

// Hero photo, pre-sized into public/images/insights/ (800 / 1400 / 2000 wide)
const heroSrcSet = (format) =>
    [800, 1400, 2000].map((w) => `/images/insights/gold-coast-skyline-${w}.${format} ${w}w`).join(', ');

const MESSAGE_ICONS = {
    shield: ShieldCheckIcon,
    lock: LockClosedIcon,
    receipt: ReceiptPercentIcon,
    trending: ArrowTrendingUpIcon,
    torch: FireIcon,
};

/* ------------------------------------------------------------------ */

const ModelledBadge = ({ children = 'Modelled' }) => <span className="nve-badge">{children}</span>;

const ChartSection = ({ id, number, title, badge, takeaway, controls, children, footnote, table, alt }) => (
    <section id={id} className={`nve-section ${alt ? 'nve-section-alt' : ''}`}>
        <div className="container">
            <div className="nve-chart-head reveal reveal-up">
                <div className="nve-chart-eyebrow">
                    <span className="nve-chart-num">{String(number).padStart(2, '0')}</span>
                    <ModelledBadge>{badge}</ModelledBadge>
                </div>
                <h2 className="nve-h2">{title}</h2>
                <p className="nve-takeaway">{takeaway}</p>
            </div>
            <div className="nve-chart-card reveal reveal-up">
                {controls && <div className="nve-controls">{controls}</div>}
                {children}
                <p className="nve-footnote">{footnote}</p>
                {table}
            </div>
        </div>
    </section>
);

const Disclaimer = ({ className = '' }) => (
    <aside className={`nve-disclaimer ${className}`} aria-label="Important information">
        <strong>Important information.</strong> {DISCLAIMER}
    </aside>
);

/* ------------------------------------------------------------------ */
/*  Hero                                                                */
/* ------------------------------------------------------------------ */

const HeroStats = () => {
    const ref = useRef(null);
    // Low threshold: on phones the three cards stack into a block taller than
    // the screen, so at 0.3 the first card sat at "$0k" until the visitor
    // scrolled well past it.
    const inView = useInView(ref, 0.05);
    return (
        <div className="nve-stats" ref={ref}>
            {HERO_STATS.map((s) => (
                <div className="nve-stat" key={s.label}>
                    <span className="nve-stat-value">
                        {s.from != null && (
                            <>
                                {s.prefix}
                                <CountUp value={s.from} active={inView} />
                                {s.suffix}–
                            </>
                        )}
                        {s.from != null ? '$' : s.prefix}
                        <CountUp value={s.to} active={inView} />
                        {s.suffix}
                    </span>
                    <span className="nve-stat-label">{s.label}</span>
                    <span className="nve-stat-foot">{s.footnote}</span>
                </div>
            ))}
        </div>
    );
};

/* ------------------------------------------------------------------ */
/*  Chart 1 — What $1.6M earns, by product                              */
/* ------------------------------------------------------------------ */

const EarningsChart = () => {
    const rows = RETURNS_BY_BUDGET
        .filter((r) => r.budget === 1600000)
        .map((r) => ({ ...r, short: SHORT_LABEL[r.product] }));

    return (
        <ChartSection
            id="earnings"
            number={1}
            title="What $1.6M earns, by product"
            takeaway="Among apartments, new off-the-plan leads for both tax brackets. For top-bracket investors, it sits within a point of the best house result."
            footnote="Modelled after-tax annual return on the investor's own cash. 80% loan, interest-only at 6.75%, 9-year hold. New builds grow with the market during the build; the new house-and-land figure falls to 5.9% / 7.1% if only the land grows during its build."
            table={
                <ChartDataTable
                    caption="Modelled after-tax IRR and net profit at a $1.6M budget, 9-year hold"
                    columns={['Product', 'IRR 39%', 'IRR 47%', 'Net profit 39%', 'Net profit 47%']}
                    rows={rows.map((r) => [r.product, pct(r.irr39), pct(r.irr47), aud(r.profit39), aud(r.profit47)])}
                />
            }
        >
            <Legend items={[{ label: '39% taxpayer', color: C_39 }, { label: '47% taxpayer', color: C_47 }]} />
            <InsightBarChart
                data={rows}
                categoryKey="product"
                shortCategoryKey="short"
                series={[
                    { dataKey: 'irr39', name: '39% taxpayer', color: C_39 },
                    { dataKey: 'irr47', name: '47% taxpayer', color: C_47 },
                ]}
                domain={[0, 8]}
                ticks={[0, 2, 4, 6, 8]}
                valueFormat={pct}
                tickFormat={(v) => `${v}%`}
                renderTooltip={(r) => (
                    <>
                        <strong>{r.product}</strong>
                        <span>39% taxpayer: {pct(r.irr39)} a year · {aud(r.profit39)} profit</span>
                        <span>47% taxpayer: {pct(r.irr47)} a year · {aud(r.profit47)} profit</span>
                    </>
                )}
                ariaLabel="Grouped bar chart of modelled annual returns by product for 39% and 47% taxpayers"
            />
        </ChartSection>
    );
};

/* ------------------------------------------------------------------ */
/*  Chart 2 — The off-the-plan leverage effect                          */
/* ------------------------------------------------------------------ */

const LEVERAGE_COLORS = { grows: C_ACCENT, flat: C_NEUTRAL, falls: C_39 };

const LeverageChart = () => {
    const series = LEVERAGE_SERIES.map((s) => ({
        dataKey: s.key,
        name: s.label,
        color: LEVERAGE_COLORS[s.key],
        dashed: s.key === 'falls',
    }));
    // One row per year: { year, grows, flat, falls }
    const data = LEVERAGE_YEARS.map((year, i) => ({
        year,
        ...Object.fromEntries(LEVERAGE_SERIES.map((s) => [s.key, s.values[i]])),
    }));

    return (
        <ChartSection
            id="leverage"
            number={2}
            badge="Illustrative"
            alt
            title="The off-the-plan leverage effect"
            takeaway="A 10% deposit secures a $1.6M unit at today's price. If the market grows during the build, that growth belongs to the buyer. If it falls, so does the buyer's equity."
            footnote="Illustrative values at settlement for a $1.6M contract. Growth is not guaranteed. In the falling case, the lender values the unit at about $1.46M and the buyer must fund the shortfall at settlement, about $112,000 more cash than planned at an 80% loan."
            table={
                <ChartDataTable
                    caption="Illustrative unit value from contract to settlement, $1.6M contract"
                    columns={['Year', ...series.map((s) => s.name)]}
                    rows={data.map((row) => [row.year, ...series.map((s) => aud(row[s.dataKey]))])}
                />
            }
        >
            <Legend
                items={series.map((s) => ({ label: s.name, color: s.color, variant: s.dashed ? 'is-dashed' : '' }))}
            />
            <InsightLineChart
                data={data}
                xKey="year"
                series={series}
                domain={[1400000, 1900000]}
                ticks={[1400000, 1500000, 1600000, 1700000, 1800000, 1900000]}
                formatY={audM}
                formatTooltip={aud}
                xTickFormat={(year, i, lastIdx) => (i === 0 ? `${year} contract` : i === lastIdx ? `${year} settlement` : year)}
                callout={{ dataKey: 'grows', text: '+$226k on a $160k deposit' }}
                ariaLabel="Line chart of a $1.6M unit's illustrative value from 2026 to 2029 if the market grows, stays flat or falls"
            />
        </ChartSection>
    );
};

/* ------------------------------------------------------------------ */
/*  Chart 3 — Tax refunds while you hold                                */
/* ------------------------------------------------------------------ */

const TaxChart = () => {
    const [bracket, setBracket] = useState(47);
    const rows = TAX_PICTURE.map((r) => ({
        product: r.product,
        short: SHORT_LABEL[r.product],
        refunds: r[`refunds${bracket}`],
        cgt: r[`cgt${bracket}`],
    }));

    return (
        <ChartSection
            id="tax"
            number={3}
            title="Tax refunds while you hold"
            takeaway="New builds deliver more than ten times the tax refunds of established property during the hold. Some of that comes back as capital gains tax at sale, and new builds still come out ahead of established apartments after both."
            controls={<Segmented label="Tax bracket" options={BRACKET_OPTIONS} value={bracket} onChange={setBracket} />}
            footnote="Modelled at a $1.6M budget over a 9-year hold. Established properties bought after Budget night have most rental losses quarantined from 1 July 2027; those losses are offset against the gain at sale, which is why their CGT is close to zero."
            table={
                <ChartDataTable
                    caption="Modelled 9-year tax refunds and CGT at sale, $1.6M budget"
                    columns={['Product', 'Refunds 39%', 'Refunds 47%', 'CGT at sale 39%', 'CGT at sale 47%']}
                    rows={TAX_PICTURE.map((r) => [r.product, aud(r.refunds39), aud(r.refunds47), aud(r.cgt39), aud(r.cgt47)])}
                />
            }
        >
            <Legend
                items={[
                    { label: 'Tax refunds over the 9-year hold', color: C_39 },
                    { label: 'CGT paid at sale', color: C_39, variant: 'is-light' },
                ]}
            />
            <InsightBarChart
                orientation="vertical"
                data={rows}
                categoryKey="short"
                series={[
                    { dataKey: 'refunds', name: 'Tax refunds over 9 years', color: C_39 },
                    { dataKey: 'cgt', name: 'CGT paid at sale', color: C_39, pattern: true },
                ]}
                domain={[0, 300000]}
                ticks={[0, 100000, 200000, 300000]}
                valueFormat={audK}
                renderTooltip={(r) => (
                    <>
                        <strong>{r.product}</strong>
                        <span>{bracket}% taxpayer</span>
                        <span>Tax refunds while holding: {aud(r.refunds)}</span>
                        <span>CGT at sale: {aud(r.cgt)}</span>
                        <span>Refunds less CGT: {aud(r.refunds - r.cgt)}</span>
                    </>
                )}
                ariaLabel={`Bar chart of modelled tax refunds and CGT at sale by product for a ${bracket}% taxpayer`}
            />
        </ChartSection>
    );
};

/* ------------------------------------------------------------------ */
/*  Chart 4 — Whatever your budget                                      */
/* ------------------------------------------------------------------ */

const OTP = 'New off-the-plan apartment';

const BudgetChart = () => {
    const [budgetIdx, setBudgetIdx] = useState(1);
    const [bracket, setBracket] = useState(47);
    const budget = BUDGETS[budgetIdx];
    const key = `irr${bracket}`;
    const rows = RETURNS_BY_BUDGET
        .filter((r) => r.budget === budget)
        .map((r) => ({ ...r, short: SHORT_LABEL[r.product], irr: r[key], profit: r[`profit${bracket}`] }));
    const otp = rows.find((r) => r.product === OTP);
    const est = rows.find((r) => r.product === 'Established apartment');
    const gap = otp.irr - est.irr;

    return (
        <ChartSection
            id="budget"
            number={4}
            alt
            title="Whatever your budget"
            takeaway="The pattern holds from $1.2M to $2M: new off-the-plan units beat established units by about 1.7–2.8 points a year at every budget."
            controls={
                <>
                    <div className="nve-slider">
                        <label htmlFor="nve-budget">
                            Budget <strong>{budgetLabel(budget)}</strong>
                        </label>
                        <input
                            id="nve-budget"
                            type="range"
                            min={0}
                            max={BUDGETS.length - 1}
                            step={1}
                            value={budgetIdx}
                            onChange={(e) => setBudgetIdx(Number(e.target.value))}
                            aria-valuetext={budgetLabel(budget)}
                        />
                        <div className="nve-slider-stops" aria-hidden="true">
                            {BUDGETS.map((b, i) => (
                                <button type="button" tabIndex={-1} key={b} className={i === budgetIdx ? 'active' : ''} onClick={() => setBudgetIdx(i)}>
                                    {budgetLabel(b)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <Segmented label="Tax bracket" options={BRACKET_OPTIONS} value={bracket} onChange={setBracket} />
                </>
            }
            footnote="Modelled, 9-year hold, 80% loan interest-only at 6.75%. Each product costs exactly the budget."
            table={
                <ChartDataTable
                    caption="Modelled after-tax IRR by budget, 9-year hold"
                    columns={['Budget · product', 'IRR 39%', 'IRR 47%', 'Net profit 39%', 'Net profit 47%']}
                    rows={RETURNS_BY_BUDGET.map((r) => [`${budgetLabel(r.budget)} · ${r.product}`, pct(r.irr39), pct(r.irr47), aud(r.profit39), aud(r.profit47)])}
                />
            }
        >
            <p className="nve-live-note" aria-live="polite">
                At {budgetLabel(budget)}, off-the-plan leads the established apartment by{' '}
                <strong>{gap.toFixed(1)} points a year</strong> for a {bracket}% taxpayer.
            </p>
            <InsightBarChart
                data={rows}
                categoryKey="product"
                shortCategoryKey="short"
                series={[{
                    dataKey: 'irr',
                    name: `${bracket}% taxpayer`,
                    colorFor: (r) => (r.product === OTP ? C_ACCENT : C_NEUTRAL),
                }]}
                domain={[0, 8]}
                ticks={[0, 2, 4, 6, 8]}
                valueFormat={pct}
                tickFormat={(v) => `${v}%`}
                isHighlighted={(r) => r.product === OTP}
                renderTooltip={(r) => (
                    <>
                        <strong>{r.product}</strong>
                        <span>{budgetLabel(budget)} budget, {bracket}% taxpayer</span>
                        <span>{pct(r.irr)} a year · net profit {aud(r.profit)}</span>
                    </>
                )}
                ariaLabel={`Bar chart of modelled annual returns at a ${budgetLabel(budget)} budget for a ${bracket}% taxpayer`}
            />
        </ChartSection>
    );
};

/* ------------------------------------------------------------------ */
/*  Chart 5 — Olympic cities before the Games                           */
/* ------------------------------------------------------------------ */

const OlympicChart = () => {
    const rows = OLYMPIC_CITIES.map((c) => ({
        ...c,
        label: `${c.host} ${c.games}`,
        sub: `vs ${c.comparison}`,
    }));

    return (
        <ChartSection
            id="olympics"
            number={5}
            badge="Historical · not a forecast"
            title="Olympic cities before the Games"
            takeaway="In Barcelona and Sydney, prices near the Games outpaced the wider market in the run-up. Results elsewhere were mixed, and much of the growth came from the broader market."
            footnote="Five-year price growth before each Games. Sydney's overall 50% rise from 1996 to 2000 has since been attributed mainly to general market conditions, and studies of Los Angeles, Calgary and Atlanta found negative effects. Past host cities are not a forecast for the Gold Coast."
            table={
                <ChartDataTable
                    caption="Five-year price growth before each Games"
                    columns={['Host area', 'Games', 'Host area growth', 'Comparison market', 'Comparison growth']}
                    rows={OLYMPIC_CITIES.map((c) => [c.hostNote ? `${c.host} (${c.hostNote})` : c.host, c.games, `${c.hostGrowth}%`, c.comparison, `${c.comparisonGrowth}%`])}
                />
            }
        >
            <div className="nve-olympic-layout">
                <div>
                    <Legend items={[{ label: 'Host area', color: C_ACCENT }, { label: 'Wider comparison market', color: C_NEUTRAL }]} />
                    <InsightBarChart
                        orientation="vertical"
                        data={rows}
                        categoryKey="label"
                        subCategoryKey="sub"
                        series={[
                            { dataKey: 'hostGrowth', name: 'Host area', color: C_ACCENT },
                            { dataKey: 'comparisonGrowth', name: 'Comparison market', color: C_NEUTRAL },
                        ]}
                        domain={[0, 150]}
                        ticks={[0, 50, 100, 150]}
                        valueFormat={(v) => `+${v}%`}
                        tickFormat={(v) => `${v}%`}
                        height={300}
                        renderTooltip={(c) => (
                            <>
                                <strong>{c.host}{c.hostNote ? ` (${c.hostNote})` : ''}, {c.games} Games</strong>
                                <span>{c.host}: +{c.hostGrowth}% in the 5 years before</span>
                                <span>{c.comparison}: +{c.comparisonGrowth}% over the same period</span>
                            </>
                        )}
                        ariaLabel="Paired bar chart of five-year price growth in Olympic host areas against their wider markets"
                    />
                </div>
                <div className="nve-side-stat">
                    <span className="nve-side-stat-value">5%</span>
                    <span className="nve-side-stat-label">
                        London 2012: price premium on homes within 3 miles of the main stadium after the announcement.
                    </span>
                </div>
            </div>
        </ChartSection>
    );
};

/* ------------------------------------------------------------------ */
/*  Chart 6 — If the 2032 run-up plays out                              */
/* ------------------------------------------------------------------ */

const ScenarioChart = () => {
    const [scenario, setScenario] = useState('Run-up then flat');
    const [hold, setHold] = useState(9);
    const [bracket, setBracket] = useState(47);

    // Base case is modelled on a 9-year hold only
    const effectiveHold = scenario === 'Base case' ? 9 : hold;
    const key = `irr${bracket}`;
    const rows = useMemo(
        () => PRODUCTS.map((product) => {
            const r = SCENARIO_RETURNS.find(
                (row) => row.scenario === scenario && row.hold === effectiveHold && row.product === product
            );
            return { product, short: SHORT_LABEL[product], irr: r[key] };
        }),
        [scenario, effectiveHold, key]
    );
    const leader = rows.reduce((best, r) => (r.irr > best.irr ? r : best), rows[0]);
    const definition = SCENARIOS.find((s) => s.key === scenario).definition;

    return (
        <ChartSection
            id="olympic-scenarios"
            number={6}
            badge="Illustrative scenarios"
            alt
            title="If the 2032 run-up plays out"
            takeaway="In an Olympic run-up, off-the-plan apartments lead on a 9-year hold, even if prices dip after the Games."
            controls={
                <>
                    <Segmented
                        label="Scenario"
                        options={SCENARIOS.map((s) => ({ value: s.key, label: s.key, title: s.definition }))}
                        value={scenario}
                        onChange={setScenario}
                    />
                    <Segmented
                        label="Hold period"
                        options={[
                            { value: 9, label: '9-year hold' },
                            { value: 4, label: '4-year hold', disabled: scenario === 'Base case', title: scenario === 'Base case' ? 'Base case is modelled on a 9-year hold only' : undefined },
                        ]}
                        value={effectiveHold}
                        onChange={setHold}
                    />
                    <Segmented label="Tax bracket" options={BRACKET_OPTIONS} value={bracket} onChange={setBracket} />
                </>
            }
            footnote="Illustrative scenarios, not forecasts. Houses were given a smaller Olympic boost than units; if houses rise as much, they keep more of their lead. On a 4-year hold with a post-Games dip, off-the-plan sells just after the Games and trails established units for 39% taxpayers."
            table={
                <ChartDataTable
                    caption="Illustrative after-tax IRR under Olympic run-up scenarios"
                    columns={['Scenario · hold · product', 'IRR 39%', 'IRR 47%']}
                    rows={SCENARIO_RETURNS.map((r) => [`${r.scenario} · ${r.hold} yrs · ${r.product}`, pct(r.irr39), pct(r.irr47)])}
                />
            }
        >
            <p className="nve-scenario-def">
                <strong>{scenario}:</strong> {definition}
            </p>
            <InsightBarChart
                data={rows}
                categoryKey="product"
                shortCategoryKey="short"
                series={[{
                    dataKey: 'irr',
                    name: `${bracket}% taxpayer`,
                    colorFor: (r) => (r === leader ? C_ACCENT : C_NEUTRAL),
                }]}
                domain={[0, 14]}
                ticks={[0, 2, 4, 6, 8, 10, 12, 14]}
                valueFormat={pct}
                tickFormat={(v) => `${v}%`}
                labelFor={(r, _key, v) => (r === leader ? `${pct(v)} · leads` : pct(v))}
                isHighlighted={(r) => r === leader}
                renderTooltip={(r) => (
                    <>
                        <strong>{r.product}</strong>
                        <span>{scenario}, {effectiveHold}-year hold</span>
                        <span>{bracket}% taxpayer: {pct(r.irr)} a year</span>
                    </>
                )}
                ariaLabel={`Bar chart of illustrative annual returns, ${scenario}, ${effectiveHold}-year hold, ${bracket}% taxpayer`}
            />
        </ChartSection>
    );
};

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

const NewVsEstablishedPage = () => {
    // noindex until the page has passed its Australian Consumer Law review
    // (see the brief's compliance guardrails). Remove `noindex` and the
    // EXCLUDED_ROUTES entry in cms.js once it's signed off.
    usePageTitle('New vs Established on the Gold Coast', {
        description:
            'We modelled new and established Gold Coast apartments and houses under the 2026 negative gearing and CGT rules. Same $1.6M budget, four products, every cost and tax counted.',
        noindex: true,
    });

    const pageRef = useRef(null);
    const { setNavOverDarkHero } = useNavVisibility();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, []);

    // The photo hero stays dark in both themes, so ask the Navbar for its
    // white logo/text while it's transparent over it
    useEffect(() => {
        setNavOverDarkHero(true);
        return () => setNavOverDarkHero(false);
    }, [setNavOverDarkHero]);

    // Fade/slide section content in as it scrolls into view
    useEffect(() => {
        const els = pageRef.current?.querySelectorAll('.reveal') || [];
        if (typeof IntersectionObserver === 'undefined') {
            els.forEach((el) => el.classList.add('is-revealed'));
            return undefined;
        }
        const observer = new IntersectionObserver(
            (entries) => entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    observer.unobserve(entry.target);
                }
            }),
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );
        els.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <div className="nve-page" ref={pageRef}>
            {/* ---------------- Hero ---------------- */}
            <header className="nve-hero">
                {/* Decorative skyline photo (licensed); overlays in the CSS keep the copy legible */}
                <div className="nve-hero-media" aria-hidden="true">
                    <picture>
                        <source type="image/avif" srcSet={heroSrcSet('avif')} sizes="100vw" />
                        <source type="image/webp" srcSet={heroSrcSet('webp')} sizes="100vw" />
                        <img
                            src="/images/insights/gold-coast-skyline-1400.jpg"
                            alt=""
                            width="2000"
                            height="1334"
                            fetchPriority="high"
                            decoding="async"
                        />
                    </picture>
                </div>
                <div className="container nve-hero-inner">
                    <span className="nve-eyebrow">Investor research · Gold Coast · September 2026</span>
                    <h1 className="nve-title">
                        The 2026 tax reforms changed the maths. <span>Here&apos;s what $1.6M earns now.</span>
                    </h1>
                    <p className="nve-subtitle">
                        We modelled new and established apartments and houses on the Gold Coast, from contract
                        to sale, under the new negative gearing and CGT rules. Same budget, four products, every
                        cost and tax counted.
                    </p>
                    <HeroStats />
                    <p className="nve-advice-notice">
                        <InformationCircleIcon aria-hidden="true" />
                        <span>
                            <strong>This is not financial advice.</strong> It&apos;s general information based on
                            modelled scenarios, not forecasts, and doesn&apos;t consider your personal circumstances.{' '}
                            <a href="#disclaimer-and-sources">Read the full disclaimer and sources</a>
                        </span>
                    </p>
                    <p className="nve-hero-note">
                        39% / 47% is the investor&apos;s marginal tax rate including Medicare.
                    </p>
                </div>
            </header>

            {/* ---------------- Key messages ---------------- */}
            <section className="nve-section">
                <div className="container">
                    <div className="nve-cards">
                        {KEY_MESSAGES.map((m, i) => {
                            const Icon = MESSAGE_ICONS[m.icon];
                            return (
                                <article className={`nve-card reveal reveal-up delay-${Math.min(i, 4) * 100}`} key={m.title}>
                                    <Icon className="nve-card-icon" aria-hidden="true" />
                                    <h3>{m.title}</h3>
                                    <p>{m.body}</p>
                                </article>
                            );
                        })}
                    </div>
                    <Disclaimer className="reveal reveal-up" />
                </div>
            </section>

            <EarningsChart />
            <LeverageChart />
            <TaxChart />
            <BudgetChart />
            <OlympicChart />
            <ScenarioChart />

            {/* ---------------- Know before you buy ---------------- */}
            <section className="nve-section" id="risks">
                <div className="container">
                    <div className="nve-risks reveal reveal-up">
                        <div className="nve-risks-head">
                            <ExclamationTriangleIcon className="nve-risks-icon" aria-hidden="true" />
                            <h2 className="nve-h2">Know before you buy</h2>
                        </div>
                        <ul className="nve-risk-list">
                            {RISKS.map((r) => (
                                <li key={r.title}>
                                    <strong>{r.title}</strong> {r.body}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* ---------------- FAQ ---------------- */}
            <section className="nve-section nve-section-alt" id="faq">
                <div className="container nve-narrow">
                    <h2 className="nve-h2 reveal reveal-up">Frequently asked questions</h2>
                    <div className="nve-faq reveal reveal-up">
                        {FAQS.map((f) => (
                            <details key={f.q}>
                                <summary>
                                    {f.q}
                                    <ChevronDownIcon className="nve-faq-chevron" aria-hidden="true" />
                                </summary>
                                <p>{f.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---------------- CTA ---------------- */}
            <section className="nve-section" id="report">
                <div className="container">
                    <div className="nve-cta reveal reveal-up">
                        <h2 className="nve-h2">See every number behind the model.</h2>
                        <p>
                            Download the full report: the 2026 tax changes, every assumption, the sensitivity tests,
                            the Olympic evidence and the sources.
                        </p>
                        <div className="nve-cta-actions">
                            {REPORT_URL ? (
                                <a href={REPORT_URL} className="btn btn-primary nve-btn-icon" download title={REPORT_TITLE}>
                                    <ArrowDownTrayIcon aria-hidden="true" />
                                    Download the full report (PDF)
                                </a>
                            ) : (
                                <span className="btn btn-primary nve-btn-icon is-disabled" aria-disabled="true">
                                    <ArrowDownTrayIcon aria-hidden="true" />
                                    Download the full report (PDF)
                                </span>
                            )}
                            <a href="/#contact" className="btn btn-secondary">Talk to our team</a>
                        </div>
                        {!REPORT_URL && <p className="nve-cta-note">The full report will be available to download shortly.</p>}
                    </div>

                    {/* Target of the hero's "not financial advice" link */}
                    <div id="disclaimer-and-sources" className="nve-fine-print">
                        <h2 className="nve-h2">Important information and sources</h2>
                        <Disclaimer />

                        <dl className="nve-disclaimer-details">
                            {DISCLAIMER_DETAILS.map((d) => (
                                <div key={d.title}>
                                    <dt>{d.title}</dt>
                                    <dd>{d.body}</dd>
                                </div>
                            ))}
                        </dl>
                        <p className="nve-disclaimer-updated">Information current as at {DISCLAIMER_UPDATED}.</p>

                        <div className="nve-sources">
                            <h3>Sources</h3>
                            <p>Modelled figures come from the full report; the full source list is in the report.</p>
                            <ul>
                                {SOURCES.map((s) => (
                                    <li key={s.url}>
                                        <a href={s.url} target="_blank" rel="noopener noreferrer">
                                            {s.title}
                                            <ArrowTopRightOnSquareIcon aria-hidden="true" />
                                        </a>
                                        <span> — {s.publisher}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default NewVsEstablishedPage;
