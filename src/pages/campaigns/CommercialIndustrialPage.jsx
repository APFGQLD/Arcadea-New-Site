import React, { useEffect, useRef, useState } from 'react';
import usePageTitle from '../../hooks/usePageTitle';
import { useNavVisibility } from '../../context/NavVisibilityContext';
import CampaignLeadForm from '../../components/campaigns/CampaignLeadForm';
import { captureAttribution, trackEvent } from '../../components/campaigns/campaignTracking';
import { CAMPAIGNS } from '../../data/campaigns/shared';
import * as D from '../../data/campaigns/commercialIndustrial';
import './CommercialIndustrialPage.css';

/*
 * /campaigns/commercial: the "7 reasons" deck as a landing page whose job is
 * to get people onto a 20-minute call. Long detail sits behind interaction
 * (reason cards expand in place, supporting research sits behind "view
 * more" buttons) so the page
 * stays short. Arcadea Flat styling: solid colour, 1px hairlines, no shadows
 * or gradients. Copy, figures, sources and the compliance rules this page
 * follows live in data/campaigns/commercialIndustrial.js.
 */

const CAMPAIGN = CAMPAIGNS.commercialIndustrial;
const CAMPAIGN_ID = 'commercial';
const VARIANT = 'ci-v2';
const LOGOS = '/images/campaigns/logos';

const fmtAud = (n) => `$${Math.round(n).toLocaleString('en-AU')}`;
const fmtK = (n) => `$${Math.round(n / 1000)}k`;

/* ------------------------------------------------------------------ */
/*  Small building blocks                                               */
/* ------------------------------------------------------------------ */

/** Responsive photo: AVIF → WebP → JPEG, sized from the widths the build made. */
function Photo({ image, sizes = '100vw', eager = false, className = '' }) {
    const set = (ext) => image.widths.map((w) => `${image.name}-${w}.${ext} ${w}w`).join(', ');
    const fallback = `${image.name}-${image.widths[Math.min(1, image.widths.length - 1)]}.jpg`;
    return (
        <picture className={className}>
            <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
            <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
            <img
                src={fallback}
                srcSet={set('jpg')}
                sizes={sizes}
                alt={image.alt}
                loading={eager ? 'eager' : 'lazy'}
                fetchPriority={eager ? 'high' : undefined}
                decoding="async"
                style={image.position ? { objectPosition: image.position } : undefined}
            />
        </picture>
    );
}

/** A research logo on a small white chip: attribution, not endorsement. */
function SourceChip({ logo, name }) {
    return (
        <span className="cmp-logo-chip">
            <img src={`${LOGOS}/${logo}`} alt={name} loading="lazy" decoding="async" />
        </span>
    );
}

const publisherOf = (logo) => D.RESEARCH_LOGOS.find(([f]) => f === logo)?.[1] || '';

function SectionHead({ eyebrow, title, lede, id }) {
    return (
        <header className="cmp-head cmp-reveal">
            {eyebrow && <span className="cmp-eyebrow">{eyebrow}</span>}
            <h2 className="cmp-h2" id={id}>{title}</h2>
            {lede && <div className="cmp-lede">{lede}</div>}
        </header>
    );
}

function Stats({ items, columns = 3 }) {
    return (
        <ul className={`cmp-stats cols-${columns}`}>
            {items.map((s) => (
                <li key={s.label} className="cmp-stat cmp-reveal">
                    <span className="cmp-stat-value">{s.value}</span>
                    <span className="cmp-stat-label">{s.label}</span>
                    {s.source && (
                        <span className="cmp-stat-source">
                            {s.logo && <SourceChip logo={s.logo} name={publisherOf(s.logo)} />}
                            <span>
                                {s.forecast ? 'Forecast. ' : ''}Source: {s.source}
                            </span>
                        </span>
                    )}
                </li>
            ))}
        </ul>
    );
}

function DashList({ items, columns = 1 }) {
    return (
        <ul className={`cmp-dash cols-${columns}`}>
            {items.map((it) => <li key={it}>{it}</li>)}
        </ul>
    );
}

function Illustrative({ children }) {
    return <span className="cmp-badge">{children || 'Illustrative only'}</span>;
}

/** Residential vs commercial table (the only comparison this page makes). */
function CompareTable({ caption, rows, first = 'Item', left = 'Residential', right = 'Commercial' }) {
    return (
        <div className="cmp-table-wrap cmp-reveal">
            <table className="cmp-table">
                <caption className="cmp-visually-hidden">{caption}</caption>
                <thead>
                    <tr>
                        <th scope="col">{first}</th>
                        <th scope="col">{left}</th>
                        <th scope="col" className="is-hl">{right}</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(([label, a, b]) => (
                        <tr key={label}>
                            <th scope="row">{label}</th>
                            <td>{a}</td>
                            <td className="is-hl">{b}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/** Collapsible table of the numbers behind a chart. */
function DataTable({ caption, columns, rows }) {
    return (
        <details className="cmp-data">
            <summary>View the data</summary>
            <table>
                <caption>{caption}</caption>
                <thead>
                    <tr>{columns.map((c) => <th key={c} scope="col">{c}</th>)}</tr>
                </thead>
                <tbody>
                    {rows.map((r) => (
                        <tr key={r[0]}>
                            <th scope="row">{r[0]}</th>
                            {r.slice(1).map((c, i) => <td key={i}>{c}</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </details>
    );
}

/* ------------------------------------------------------------------ */
/*  Charts (plain SVG/HTML: small, themeable, no chart library)          */
/* ------------------------------------------------------------------ */

function GrowthLine({ data }) {
    const W = 640;
    const H = 260;
    const pad = { l: 44, r: 20, t: 24, b: 36 };
    const max = 14;
    const x = (i) => pad.l + (i * (W - pad.l - pad.r)) / (data.length - 1);
    const y = (v) => pad.t + (1 - v / max) * (H - pad.t - pad.b);
    const points = data.map((d, i) => `${x(i)},${y(d.value)}`).join(' ');
    const last = data[data.length - 1];
    return (
        <figure className="cmp-chart cmp-reveal">
            <figcaption className="cmp-chart-title">Cumulative industrial capital growth</figcaption>
            <svg
                viewBox={`0 0 ${W} ${H}`}
                role="img"
                aria-label={`Line chart of cumulative industrial capital growth: ${data.map((d) => `${d.label} ${d.value.toFixed(1)}%`).join(', ')}`}
            >
                {[0, 4, 8, 12].map((t) => (
                    <g key={t}>
                        <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} className="cmp-grid" />
                        <text x={pad.l - 10} y={y(t)} dy="0.35em" textAnchor="end" className="cmp-axis">{t}%</text>
                    </g>
                ))}
                <polyline points={points} className="cmp-line" pathLength="1" />
                {data.map((d, i) => (
                    <g key={d.label}>
                        <circle cx={x(i)} cy={y(d.value)} r={i === data.length - 1 ? 5 : 3.5} className="cmp-dot" />
                        <text x={x(i)} y={H - 10} textAnchor="middle" className="cmp-axis">{d.label}</text>
                    </g>
                ))}
                <text x={x(data.length - 1) - 10} y={y(last.value) - 12} textAnchor="end" className="cmp-callout-text">
                    +{last.value.toFixed(1)}%
                </text>
            </svg>
            <p className="cmp-footnote">Source: KPMG and PCA/MSCI via Ray White. Points are not evenly spaced in time.</p>
            <DataTable
                caption="Cumulative industrial capital growth, June 2024 to June 2026"
                columns={['Quarter', 'Cumulative growth']}
                rows={data.map((d) => [d.label, `${d.value > 0 ? '+' : ''}${d.value.toFixed(1)}%`])}
            />
        </figure>
    );
}

function RentBars({ data }) {
    const max = 220;
    return (
        <figure className="cmp-chart cmp-reveal">
            <figcaption className="cmp-chart-title">National prime net face rent ($/m²)</figcaption>
            <ol
                className="cmp-bars"
                aria-label={`Bar chart of national prime net face rent per square metre: ${data.map((d) => `${d.label} $${d.value}`).join(', ')}`}
            >
                {data.map((d, i) => (
                    <li key={d.label} className={i === data.length - 1 ? 'is-hl' : ''}>
                        <span className="cmp-bar-value">${d.value}</span>
                        <span className="cmp-bar" style={{ '--h': `${(d.value / max) * 100}%`, '--i': i }} aria-hidden="true" />
                        <span className="cmp-bar-label">{d.label}</span>
                    </li>
                ))}
            </ol>
            <p className="cmp-footnote">
                <strong>+67% since 2021.</strong> Source: Cushman &amp; Wakefield, <em>The Occupier Reset</em>, Q4 2026.
            </p>
            <DataTable
                caption="National prime net face rent, dollars per square metre"
                columns={['Year', '$/m²']}
                rows={data.map((d) => [d.label, `$${d.value}`])}
            />
        </figure>
    );
}

/** Horizontal bars for small comparisons (illustrative incomes, returns). */
function HBars({ items, format, max, ariaLabel }) {
    return (
        <ul className="cmp-hbars" aria-label={ariaLabel}>
            {items.map((it) => (
                <li key={it.label} className={it.hl ? 'is-hl' : ''}>
                    <span className="cmp-hbar-label">{it.label}</span>
                    <span className="cmp-hbar-track" aria-hidden="true">
                        <span className="cmp-hbar" style={{ '--w': `${(it.value / max) * 100}%` }} />
                    </span>
                    <span className="cmp-hbar-value">{format(it.value)}</span>
                </li>
            ))}
        </ul>
    );
}

/* ------------------------------------------------------------------ */
/*  The seven reasons: card teasers plus the detail each dialog shows   */
/* ------------------------------------------------------------------ */

const Reason1 = () => (
    <div className="cmp-split">
        <div className="cmp-panel">
            <Illustrative />
            <dl className="cmp-kv">
                {D.SMSF_SCENARIO.rows.map(([k, v]) => (
                    <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
                ))}
            </dl>
            <h4 className="cmp-h5">After 10 years</h4>
            <ul className="cmp-ten">
                {D.SMSF_SCENARIO.tenYears.map((t) => (
                    <li key={t.label}>
                        <span className="cmp-ten-label">{t.label}</span>
                        <span className="cmp-ten-values">{t.from} <span aria-hidden="true">→</span><span className="cmp-visually-hidden"> to </span> <strong>{t.to}</strong></span>
                        <span className="cmp-ten-note">{t.note}</span>
                    </li>
                ))}
            </ul>
            <p className="cmp-footnote">{D.SMSF_SCENARIO.footnote}</p>
        </div>
        <div>
            <ul className="cmp-benefits">
                {D.SMSF_BENEFITS.map((b) => (
                    <li key={b.title}><strong>{b.title}</strong><span>{b.body}</span></li>
                ))}
            </ul>
            <p className="cmp-note">{D.SMSF_NOTE}</p>
        </div>
    </div>
);

const Reason2 = () => (
    <div className="cmp-split">
        <div>
            <h4 className="cmp-h5">Potential benefits</h4>
            <DashList items={D.TAX_BENEFITS} />
        </div>
        <div>
            <h4 className="cmp-h5">Through super</h4>
            <ul className="cmp-tax">
                {D.SUPER_TAX.map((t) => (
                    <li key={t.value}><span className="cmp-tax-value">{t.value}</span><span>{t.label}</span></li>
                ))}
            </ul>
            <p className="cmp-footnote">
                Losses within an SMSF generally cannot be offset against personal employment income. Tax outcomes
                depend on your circumstances; speak to your accountant.
            </p>
        </div>
    </div>
);

const Reason3 = () => (
    <div className="cmp-panel">
        <Illustrative>Illustrative only · $500,000 property</Illustrative>
        <div className="cmp-yields">
            {D.YIELD_COMPARISON.rows.map((r, i) => (
                <div key={r.label} className={`cmp-yield ${i === 1 ? 'is-hl' : ''}`}>
                    <span className="cmp-yield-name">{r.label}</span>
                    <span className="cmp-yield-range">{r.yieldLabel}</span>
                    <span className="cmp-yield-value">{fmtAud(r.annual)}<small> a year at {r.rate}</small></span>
                    <span className="cmp-yield-week">{fmtAud(r.weekly)} a week</span>
                </div>
            ))}
        </div>
        <HBars
            max={34000}
            format={fmtAud}
            ariaLabel="Annual rent on a $500,000 property: residential at 4% $20,000, commercial at 6.5% $32,500"
            items={D.YIELD_COMPARISON.rows.map((r, i) => ({ label: r.label, value: r.annual, hl: i === 1 }))}
        />
        <p className="cmp-big">
            <strong>{D.YIELD_COMPARISON.headline}</strong> more annual rental income in this example, an extra
            $12,500 a year.
        </p>
        <p className="cmp-footnote">{D.YIELD_COMPARISON.footnote}</p>
    </div>
);

const Reason4 = () => (
    <>
        <CompareTable
            caption="Who generally pays each outgoing: residential versus a commercial net lease"
            first="Outgoing"
            right="Commercial net lease"
            rows={D.OUTGOINGS}
        />
        <div className="cmp-panel">
            <Illustrative>Illustrative only · net income on a $500,000 property</Illustrative>
            <div className="cmp-net">
                {D.NET_INCOME.rows.map((r, i) => (
                    <dl key={r.label} className={`cmp-net-col ${i === 1 ? 'is-hl' : ''}`}>
                        <dt className="cmp-net-name">{r.label}</dt>
                        <dd><span>Rent</span><span>{fmtAud(r.rent)}</span></dd>
                        <dd><span>Non-recoverable costs</span><span>−{fmtAud(r.costs)}</span></dd>
                        <dd className="cmp-net-total"><span>Net income</span><span>{fmtAud(r.net)}</span></dd>
                        <dd><span>Net yield</span><span>{r.netYield}</span></dd>
                    </dl>
                ))}
            </div>
            <p className="cmp-big">
                <strong>{D.NET_INCOME.headline}</strong> more net income in this example, or {D.NET_INCOME.extra}.
            </p>
            <p className="cmp-footnote">{D.NET_INCOME.footnote}</p>
        </div>
    </>
);

const Reason5 = () => (
    <>
        <CompareTable caption="Residential versus commercial tenancy" first="Tenancy" rows={D.TENANCY} />
        <div className="cmp-split">
            <div className="cmp-panel">
                <Illustrative>Illustrative only · 4% fixed annual increase</Illustrative>
                <HBars
                    max={40000}
                    format={fmtAud}
                    ariaLabel={`Illustrative annual rent with a 4% fixed increase: ${D.ESCALATION.years.map((y) => `${y.label} ${fmtAud(y.value)}`).join(', ')}`}
                    items={D.ESCALATION.years.map((y, i) => ({ ...y, hl: i === D.ESCALATION.years.length - 1 }))}
                />
                <p className="cmp-big"><strong>{D.ESCALATION.headline}</strong> rental income growth over five years.</p>
                <p className="cmp-footnote">{D.ESCALATION.footnote}</p>
            </div>
            <div>
                <h4 className="cmp-h5">Businesses have good reasons to stay</h4>
                <DashList items={D.REASONS_TO_STAY} />
            </div>
        </div>
    </>
);

const Reason6 = () => (
    <>
        <CompareTable caption="Residential versus commercial management" first="" rows={D.MANAGEMENT} />
        <p className="cmp-note">
            <strong>Worth knowing:</strong> commercial leasing commissions and incentives can be substantial when a new
            tenant is needed.
        </p>
    </>
);

const Reason7 = () => (
    <div className="cmp-split">
        <div>
            <h4 className="cmp-h5">How it works</h4>
            <ol className="cmp-steps">
                {D.OWN_PREMISES_STEPS.map((s) => <li key={s}>{s}</li>)}
            </ol>
            <p className="cmp-note">
                <strong>Key difference:</strong> residential property generally can&apos;t be occupied or rented by SMSF
                members or their related parties.
            </p>
        </div>
        <div>
            <p className="cmp-quote">Your tenant can often become the ultimate buyer of your investment.</p>
            <p className="cmp-footnote">
                The lease must be on arm&apos;s-length terms at market rent, and LRBA, liquidity and SMSF compliance
                rules apply. Get independent advice from a licensed adviser, accountant or SMSF specialist first.
            </p>
        </div>
    </div>
);

const REASONS = [
    {
        title: 'Unlock the power of your superannuation.',
        stat: '$200k → $500k',
        teaser: 'Property exposure from $200,000 of super, using a compliant LRBA. Illustrative only.',
        intro: 'Commercial property can give eligible SMSF investors the chance to acquire income-producing property, potentially using borrowed funds through a compliant limited recourse borrowing arrangement (LRBA).',
        Body: Reason1,
        size: 'wide',
    },
    {
        title: 'Retain valuable taxation benefits.',
        stat: '15%',
        teaser: 'The generally applicable SMSF earnings tax in accumulation phase.',
        intro: 'Commercial and industrial property can provide a range of taxation benefits, depending on ownership structure and eligibility.',
        Body: Reason2,
    },
    {
        title: 'Significantly higher rental yields.',
        stat: '5–8%',
        teaser: 'Indicative commercial yields, against 3–4.5% gross for residential.',
        Body: Reason3,
    },
    {
        title: 'Let your tenant pay the outgoings.',
        stat: 'Net leases',
        teaser: 'Rates, water and insurance are generally paid by the tenant.',
        intro: "It's not what you earn, it's what you keep.",
        Body: Reason4,
    },
    {
        title: 'Longer leases. Greater income security.',
        stat: '3–5 yrs',
        teaser: 'Typical initial commercial terms, against 6–12 months residential.',
        intro: "Invest in a business's long-term operational requirements.",
        Body: Reason5,
    },
    {
        title: 'Lower management costs. Less administration.',
        stat: '3–5%',
        teaser: 'Typical commercial management fees, against 6–8% residential.',
        Body: Reason6,
    },
    {
        title: 'Own your own business premises through super.',
        stat: 'Pay rent to your own fund',
        teaser: 'Your SMSF owns the premises; your business pays it market rent.',
        intro: "Why pay rent to someone else when your business could pay rent to your super fund? An eligible SMSF can acquire qualifying business real property and lease it to a related business, subject to arm's-length terms and SMSF compliance requirements.",
        Body: Reason7,
        size: 'wide',
        photo: D.IMAGES.businessOwner,
    },
];

const num = (i) => String(i + 1).padStart(2, '0');

const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Bento grid of the seven reasons. Opening a card shows its detail as a
 * full-width panel straight after that card's row, so the rows below move
 * down and the grid stays in view. One reason is open at a time. Which card
 * ends the row depends on the breakpoint, so it's measured at click time
 * and again on resize.
 */
function ReasonsBento() {
    const [open, setOpen] = useState(null);
    const [after, setAfter] = useState(null);
    const itemRefs = useRef([]);
    const cardRefs = useRef([]);
    const titleRef = useRef(null);
    const panelRef = useRef(null);
    const justOpened = useRef(false);

    const lastInRow = (i) => {
        const top = itemRefs.current[i]?.offsetTop;
        let last = i;
        for (let j = i + 1; j < REASONS.length; j += 1) {
            if (Math.abs(itemRefs.current[j].offsetTop - top) < 2) last = j;
            else break;
        }
        return last;
    };

    const show = (i) => {
        setOpen(i);
        setAfter(lastInRow(i));
        justOpened.current = true;
        trackEvent('reason_open', { campaign: CAMPAIGN_ID, reason: i + 1 });
    };

    const close = () => {
        const i = open;
        setOpen(null);
        setAfter(null);
        cardRefs.current[i]?.focus({ preventScroll: true });
    };

    // Bring the panel into view and move focus to its heading
    useEffect(() => {
        if (open == null || !justOpened.current) return;
        justOpened.current = false;
        titleRef.current?.focus({ preventScroll: true });
        panelRef.current?.scrollIntoView({ block: 'nearest', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    }, [open]);

    // Columns change at the breakpoints, so re-measure the row on resize
    useEffect(() => {
        if (open == null) return undefined;
        const onResize = () => setAfter(lastInRow(open));
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [open]);

    const reason = open == null ? null : REASONS[open];
    const Body = reason?.Body;

    return (
        <ul className="cmp-bento">
            {REASONS.map((r, i) => (
                <React.Fragment key={r.title}>
                    <li
                        ref={(el) => { itemRefs.current[i] = el; }}
                        className={`cmp-bento-item ${r.size === 'wide' ? 'is-wide' : ''} cmp-reveal`}
                    >
                        <button
                            type="button"
                            ref={(el) => { cardRefs.current[i] = el; }}
                            className={`cmp-bento-card ${r.photo ? 'has-photo' : ''}`}
                            aria-expanded={open === i}
                            aria-controls="cmp-reason-panel"
                            onClick={() => (open === i ? close() : show(i))}
                        >
                            {r.photo && <Photo image={{ ...r.photo, alt: '' }} sizes="(max-width: 768px) 90vw, 56vw" className="cmp-bento-photo" />}
                            <span className="cmp-bento-num">{num(i)} / 07</span>
                            <span className="cmp-bento-title">{r.title}</span>
                            <span className="cmp-bento-stat">{r.stat}</span>
                            <span className="cmp-bento-teaser">{r.teaser}</span>
                            <span className="cmp-bento-more">{open === i ? 'Close −' : 'Read more +'}</span>
                        </button>
                    </li>
                    {reason && after === i && (
                        <li
                            className="cmp-bento-panel"
                            id="cmp-reason-panel"
                            ref={panelRef}
                            role="region"
                            aria-labelledby="cmp-reason-panel-title"
                            key={`panel-${open}`}
                        >
                            <div className="cmp-rpanel-bar">
                                <span className="cmp-reason-num">{num(open)} / 07</span>
                                <button type="button" className="cmp-text-btn" onClick={close}>
                                    Close <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <h3 className="cmp-h3 cmp-rpanel-title" id="cmp-reason-panel-title" tabIndex={-1} ref={titleRef}>
                                {reason.title}
                            </h3>
                            {reason.intro && <p className="cmp-reason-intro">{reason.intro}</p>}
                            <div className="cmp-rpanel-body"><Body /></div>
                            <div className="cmp-rpanel-foot">
                                <div className="cmp-rpanel-nav">
                                    <button type="button" className="cmp-text-btn" disabled={open === 0} onClick={() => show(open - 1)}>
                                        ← Previous
                                    </button>
                                    <button type="button" className="cmp-text-btn" disabled={open === REASONS.length - 1} onClick={() => show(open + 1)}>
                                        Next reason →
                                    </button>
                                </div>
                                <a href="#book" className="cmp-btn cmp-btn-primary" onClick={() => trackEvent('cta_click', { campaign: CAMPAIGN_ID, location: `reason-${open + 1}` })}>
                                    Book a discussion
                                </a>
                            </div>
                        </li>
                    )}
                </React.Fragment>
            ))}
        </ul>
    );
}

/** Summary line plus a button that reveals the rest of a section. */
function Expander({ id, label, summary, children }) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <div className="cmp-more-bar cmp-reveal">
                {summary && <p className="cmp-body">{summary}</p>}
                <button
                    type="button"
                    className="cmp-btn cmp-btn-outline"
                    aria-expanded={open}
                    aria-controls={id}
                    onClick={() => {
                        if (!open) trackEvent('section_expand', { campaign: CAMPAIGN_ID, section: id });
                        setOpen((v) => !v);
                    }}
                >
                    {open ? 'Show less' : label}
                    <span className={`cmp-chev ${open ? 'is-open' : ''}`} aria-hidden="true">↓</span>
                </button>
            </div>
            <div id={id} className="cmp-more-region" hidden={!open}>
                {children}
            </div>
        </>
    );
}

// The figures shown up front; the rest sit behind each section's expander
const DOWNTURN_KEY = [0, 1, 3, 4].map((i) => D.DOWNTURN[i]);
const DOWNTURN_MORE = [2, 5].map((i) => D.DOWNTURN[i]);
const INDUSTRIAL_KEY = [D.INDUSTRIAL_STATS[1], D.INDUSTRIAL_STATS[3], D.LEASING_STATS[0], D.LEASING_STATS[2]];
const INDUSTRIAL_MORE = [D.INDUSTRIAL_STATS[2], D.INDUSTRIAL_STATS[4], D.LEASING_STATS[1], D.LEASING_STATS[3], D.LEASING_STATS[4]];

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

const CommercialIndustrialPage = () => {
    usePageTitle(CAMPAIGN.seo.title, { description: CAMPAIGN.seo.description });
    const { setNavOverDarkHero } = useNavVisibility();
    const pageRef = useRef(null);
    const heroRef = useRef(null);
    const bookRef = useRef(null);
    const [showSticky, setShowSticky] = useState(false);
    const [preselect, setPreselect] = useState(null);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        captureAttribution(VARIANT);
    }, []);

    useEffect(() => {
        setNavOverDarkHero(true);
        return () => setNavOverDarkHero(false);
    }, [setNavOverDarkHero]);

    // Organisation structured data for this page
    useEffect(() => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.dataset.campaign = CAMPAIGN_ID;
        script.textContent = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'RealEstateAgent',
            name: 'Arcadea Property',
            url: 'https://www.arcadea.com.au',
            logo: 'https://www.arcadea.com.au/brand-logo-white.png',
            email: D.CONTACT.email,
            areaServed: ['Queensland', 'New South Wales', 'Victoria'],
            sameAs: [
                'https://www.instagram.com/arcadea.property',
                'https://www.facebook.com/profile.php?id=61593654575099',
            ],
        });
        document.head.appendChild(script);
        return () => script.remove();
    }, []);

    // Sections rise into view once (CSS skips the motion for reduced-motion users)
    useEffect(() => {
        const root = pageRef.current;
        if (!root) return undefined;
        const els = root.querySelectorAll('.cmp-reveal');
        if (typeof IntersectionObserver === 'undefined') {
            els.forEach((el) => el.classList.add('is-in'));
            return undefined;
        }
        const io = new IntersectionObserver(
            (entries) => entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add('is-in');
                    io.unobserve(e.target);
                }
            }),
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );
        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);

    // Sticky mobile CTA: shown after the hero, hidden while the booking section is on screen
    useEffect(() => {
        if (typeof IntersectionObserver === 'undefined') return undefined;
        let heroVisible = true;
        let bookVisible = false;
        const update = () => setShowSticky(!heroVisible && !bookVisible);
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.target === heroRef.current) heroVisible = e.isIntersecting;
                if (e.target === bookRef.current) bookVisible = e.isIntersecting;
            });
            update();
        });
        if (heroRef.current) io.observe(heroRef.current);
        if (bookRef.current) io.observe(bookRef.current);
        return () => io.disconnect();
    }, []);

    const onCta = (where) => trackEvent('cta_click', { campaign: CAMPAIGN_ID, location: where });

    const pickLocation = (town) => {
        // A new object each click, so picking the same town again re-ticks it
        setPreselect({ town });
        trackEvent('location_click', { campaign: CAMPAIGN_ID, location: town });
    };

    const form = (
        <CampaignLeadForm
            campaign={CAMPAIGN_ID}
            variant={VARIANT}
            subject="Commercial property: discussion request"
            interestOptions={D.INTEREST_OPTIONS}
            budgetOptions={D.BUDGET_OPTIONS}
            locationOptions={D.LOCATIONS.map((l) => l.town)}
            preselect={preselect}
        />
    );

    return (
        <div className="cmp-page" ref={pageRef}>
            {/* ---------------- Hero ---------------- */}
            <header className="cmp-hero" ref={heroRef}>
                <div className="cmp-hero-media" aria-hidden="true">
                    <Photo image={D.IMAGES.hero} eager className="cmp-hero-photo" />
                </div>
                <div className="cmp-wrap cmp-hero-inner">
                    <span className="cmp-eyebrow cmp-on-photo">Commercial &amp; industrial property</span>
                    <h1 className="cmp-hero-title">
                        The great Australian <span>property investment shift.</span>
                    </h1>
                    <p className="cmp-hero-sub">
                        Seven reasons commercial and industrial property is booming in Australia. The compelling
                        investment alternative to residential property.
                    </p>
                    <div className="cmp-actions">
                        <a href="#book" className="cmp-btn cmp-btn-primary" onClick={() => onCta('hero')}>Book a discussion</a>
                        <a href="#seven-reasons" className="cmp-btn cmp-btn-ghost">See the 7 reasons ↓</a>
                    </div>
                    <p className="cmp-hero-note">
                        General information only, not financial advice.{' '}
                        <a href="#important-information">Read the disclaimer</a>
                    </p>
                </div>
                <div className="cmp-wrap cmp-hero-stats-wrap">
                    <ul className="cmp-hero-stats">
                        {D.HERO_STATS.map((s) => (
                            <li key={s.label}>
                                <span className="cmp-hero-stat-value">{s.value}</span>
                                <span className="cmp-hero-stat-label">{s.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </header>

            {/* ---------------- 01 The shift in residential ---------------- */}
            <section className="cmp-section" aria-labelledby="shift-title">
                <div className="cmp-wrap">
                    <SectionHead
                        id="shift-title"
                        eyebrow="A changing landscape"
                        title="Residential has shifted. So have investors."
                        lede={
                            <p>
                                The 2026 Federal Budget changed the rules for residential investors. Here&apos;s what
                                changed, and what the market has done since.
                            </p>
                        }
                    />
                    <ol className="cmp-cards cols-3">
                        {D.POLICY_CHANGES.map((c, i) => (
                            <li key={c.title} className="cmp-card cmp-reveal">
                                <span className="cmp-card-num">{String(i + 1).padStart(2, '0')}</span>
                                <h3 className="cmp-card-title">{c.title}</h3>
                                <p>{c.body}</p>
                            </li>
                        ))}
                    </ol>
                    <p className="cmp-footnote cmp-reveal">
                        Sources: Australian Taxation Office, 29 June 2026; Property Council of Australia, 1 July 2026.
                    </p>

                    <h3 className="cmp-h3 cmp-reveal">The residential downturn</h3>
                    <Stats items={DOWNTURN_KEY} columns={4} />
                    <p className="cmp-footnote cmp-source-row cmp-reveal">
                        <SourceChip logo="cotality.png" name="Cotality" />
                        <SourceChip logo="abc-news.svg" name="ABC News" />
                        <SourceChip logo="reuters.svg" name="Reuters" />
                        <SourceChip logo="newscomau.png" name="news.com.au" />
                        <span>Sources: Cotality, ABC News, Reuters, news.com.au, November 2026.</span>
                    </p>

                    <Expander id="residential-more" label="View forecasts and detail">
                    <div className="cmp-split cmp-split-forecast">
                        <div className="cmp-reveal">
                            <h3 className="cmp-h4">
                                <SourceChip logo="kpmg.svg" name="KPMG" /> House price forecasts, August 2026
                            </h3>
                            <ul className="cmp-forecasts">
                                {D.KPMG_FORECASTS.map((f) => (
                                    <li key={f.label}>
                                        <span className="cmp-forecast-value">{f.value}</span>
                                        <span>{f.label}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="cmp-footnote">Forecasts, not guarantees. Source: KPMG, August 2026.</p>
                        </div>
                        <div className="cmp-reveal">
                            <h3 className="cmp-h4">
                                <SourceChip logo="commonwealth-bank-horizontal.png" name="Commonwealth Bank" /> Commonwealth Bank, May 2026
                            </h3>
                            <p className="cmp-body">
                                Prices are estimated to be around <strong>3% below the no-reform baseline</strong>, rather
                                than an outright decline.
                            </p>
                        </div>
                    </div>

                    <div className="cmp-downturn">
                        <div className="cmp-downturn-photos cmp-reveal">
                            <Photo image={D.IMAGES.townhouses} sizes="(max-width: 1024px) 90vw, 40vw" className="cmp-photo-card" />
                            <Photo image={D.IMAGES.forSale} sizes="(max-width: 1024px) 90vw, 40vw" className="cmp-photo-card" />
                        </div>
                        <div>
                            <Stats items={DOWNTURN_MORE} columns={2} />
                            <p className="cmp-body cmp-reveal">
                                Cotality independently confirms that federal budget changes have added downward pressure,
                                alongside rising interest rates and affordability constraints.
                            </p>
                            <p className="cmp-footnote">Sources: Cotality, ABC News, Reuters, news.com.au, November 2026.</p>
                        </div>
                    </div>
                    </Expander>
                </div>
            </section>

            {/* ---------------- 02 Industrial is booming ---------------- */}
            <section className="cmp-section cmp-section-alt" aria-labelledby="booming-title">
                <div className="cmp-wrap">
                    <SectionHead
                        id="booming-title"
                        eyebrow="Industrial is booming"
                        title="Rising values. Rising rents."
                        lede={<p>While residential has softened, industrial property has kept growing.</p>}
                    />
                    <Stats items={INDUSTRIAL_KEY} columns={4} />
                    <div className="cmp-split cmp-charts">
                        <GrowthLine data={D.CAPITAL_GROWTH} />
                        <RentBars data={D.PRIME_RENT} />
                    </div>

                    <Expander
                        id="industrial-more"
                        label="View the leasing research"
                        summary="Leasing is booming too: take-up, effective rents and forecast rental growth from CBRE, JLL, Colliers, Knight Frank and Cushman & Wakefield."
                    >
                    <Stats items={INDUSTRIAL_MORE} columns={5} />

                    <ul className="cmp-headlines">
                        {D.RESEARCH_HEADLINES.map((h) => (
                            <li key={h.publisher} className="cmp-headline cmp-reveal">
                                <SourceChip logo={h.logo} name={h.publisher} />
                                <p>{h.headline}</p>
                                <span className="cmp-headline-meta">{h.publisher}, {h.date}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="cmp-footnote">
                        Results vary by location and asset size. Forecasts are not guarantees.
                    </p>
                    </Expander>
                </div>
            </section>

            {/* ---------------- 03 The seven reasons ---------------- */}
            <section className="cmp-section" id="seven-reasons" aria-labelledby="reasons-title">
                <div className="cmp-wrap">
                    <SectionHead
                        id="reasons-title"
                        eyebrow="The seven reasons"
                        title="Why commercial. Why now."
                        lede={<p>Seven ways commercial and industrial property can differ from residential. Open any reason for the detail.</p>}
                    />
                    <ReasonsBento />
                    <p className="cmp-footnote cmp-reveal">
                        Figures marked illustrative are examples with stated assumptions, not forecasts.
                    </p>
                </div>
            </section>

            {/* ---------------- 04 Small-format warehouses ---------------- */}
            <section className="cmp-section cmp-section-alt" aria-labelledby="small-format-title">
                <div className="cmp-wrap">
                    <SectionHead
                        id="small-format-title"
                        eyebrow="Strata warehouses"
                        title="Small format. Big opportunity."
                        lede={<p>Strata warehouses have been among the strongest performers in commercial property.</p>}
                    />
                    <Stats items={D.STRATA_STATS} columns={4} />

                    <Expander
                        id="strata-more"
                        label="View the research"
                        summary={
                            <>
                                Typical units are about <strong>100–300 m²</strong>, with an optional mezzanine office.
                                Demand from small businesses is rising while zoned industrial land is running short.
                            </>
                        }
                    >
                        <div className="cmp-split">
                            <div className="cmp-panel">
                                <h3 className="cmp-h4">Ten-year annualised total returns, Victoria, to 2025</h3>
                                <HBars
                                    max={15}
                                    format={(v) => `${v}%`}
                                    ariaLabel="Ten-year annualised total returns in Victoria to 2025: industrial 13%, office 9%, retail 7%"
                                    items={D.VIC_RETURNS.map((r, i) => ({ ...r, hl: i === 0 }))}
                                />
                                <p className="cmp-footnote">Commercial property sectors only. Past performance is not a reliable indicator of future returns.</p>
                            </div>
                            <div className="cmp-panel">
                                <h3 className="cmp-h4">The typical small-format offering</h3>
                                <p className="cmp-body">
                                    About <strong>100–300 m²</strong>, with an optional mezzanine office (typically 20–50%
                                    of the floor area).
                                </p>
                                <div className="cmp-two-lists">
                                    <div>
                                        <h4 className="cmp-h5">Features</h4>
                                        <DashList items={D.UNIT_FEATURES} />
                                    </div>
                                    <div>
                                        <h4 className="cmp-h5">Ideal for</h4>
                                        <DashList items={D.UNIT_IDEAL_FOR} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h3 className="cmp-h3">
                            SME demand meets land scarcity <SourceChip logo="urbis.svg" name="Urbis" />
                        </h3>
                        <Stats items={D.SME_STATS} columns={3} />
                        <blockquote className="cmp-blockquote">
                            <p>“Small lot industrial in established areas will continue to be in demand.”</p>
                            <cite>Urbis, Industrial Market Outlook, 21 October 2026, p. 23</cite>
                        </blockquote>

                        <ul className="cmp-research">
                            {D.SMALL_FORMAT_RESEARCH.map((r) => (
                                <li key={r.publisher} className="cmp-research-card">
                                    <div className="cmp-research-head">
                                        <SourceChip logo={r.logo} name={r.publisher} />
                                        <span>{r.meta}</span>
                                    </div>
                                    <DashList items={r.points} />
                                </li>
                            ))}
                        </ul>
                        <blockquote className="cmp-blockquote">
                            <p>
                                “The small-format industrial segment remains a standout, with demand expected to outstrip
                                supply for the remainder of the decade.”
                            </p>
                            <cite>Colliers, Q1 2026</cite>
                        </blockquote>
                        <p className="cmp-footnote">Forecasts are not guarantees. Results vary by location and asset.</p>
                    </Expander>
                </div>
            </section>

            {/* ---------------- 05 Who's driving demand ---------------- */}
            <section className="cmp-section" aria-labelledby="demand-title">
                <div className="cmp-wrap">
                    <SectionHead
                        id="demand-title"
                        eyebrow="Who's driving demand"
                        title="Hands-on work needs real space."
                        lede={
                            <p>
                                AI is changing traditional office work, while hands-on work is growing. Trades,
                                manufacturing, logistics, installation, maintenance and field operations all need practical
                                industrial space.
                            </p>
                        }
                    />
                    <DashList items={D.DEMAND_FACTORS} columns={3} />
                    <ul className="cmp-tiles cols-3">
                        {D.BUSINESS_TYPES.map((b) => (
                            <li key={b.title} className="cmp-tile cmp-reveal">
                                <Photo image={b.image} sizes="(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 28vw" />
                                <span className="cmp-tile-title">{b.title}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* ---------------- 06 Current opportunities ---------------- */}
            <section className="cmp-section cmp-section-alt cmp-opps" aria-labelledby="opportunities-title">
                <div className="cmp-wrap">
                    <div className="cmp-opps-head">
                        <SectionHead
                            id="opportunities-title"
                            eyebrow="Current opportunities"
                            title="Nine locations. Three states."
                            lede={<p>Small-format industrial and warehouse units of about 100–300 m², with more projects coming soon.</p>}
                        />
                        <div className="cmp-offer cmp-reveal">
                            <div>
                                <span className="cmp-offer-label">Currently from</span>
                                <span className="cmp-offer-value">{fmtK(D.PRICE.from)} – {fmtK(D.PRICE.to)}</span>
                            </div>
                            <div>
                                <span className="cmp-offer-label">Every property</span>
                                <span className="cmp-offer-value">5% first-year lease in place</span>
                            </div>
                        </div>
                    </div>
                    <ul className="cmp-strips cmp-reveal" aria-label="Locations">
                        {D.LOCATIONS.map((l) => (
                            <li key={l.slug} className="cmp-strip">
                                <a href="#book" onClick={() => pickLocation(l.town)} aria-label={`Enquire about ${l.town}, ${l.state}`}>
                                    <Photo image={{ ...l.image, alt: '' }} sizes="(max-width: 768px) 90vw, 40vw" />
                                    <span className="cmp-strip-state">{l.state}</span>
                                    <span className="cmp-strip-town">{l.town}</span>
                                    <span className="cmp-strip-cta" aria-hidden="true">Enquire →</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                    <p className="cmp-footnote cmp-reveal">
                        Receive income from day one. Lease terms, yields and availability vary by property; ask us for the
                        details of each.
                    </p>
                </div>
            </section>

            {/* ---------------- 07 Book a discussion ---------------- */}
            <section className="cmp-section" id="book" ref={bookRef} aria-labelledby="book-title">
                <div className="cmp-wrap">
                    <div className="cmp-book">
                        <div className="cmp-book-copy cmp-reveal">
                            <span className="cmp-eyebrow">Let&apos;s talk</span>
                            <h2 className="cmp-h2" id="book-title">Book a 20-minute initial discussion.</h2>
                            <p className="cmp-body">
                                On Zoom or Teams, at a time that suits you. No obligation, no pressure. We&apos;ll walk you
                                through current opportunities and answer your questions.
                            </p>
                            <DashList
                                items={[
                                    'Current projects, pricing and lease details',
                                    'How SMSF and business-owner purchases are typically structured',
                                    'What to take to your own adviser',
                                ]}
                            />
                            <ul className="cmp-contact">
                                <li><a href={`mailto:${D.CONTACT.email}`}>{D.CONTACT.email} →</a></li>
                                {D.CONTACT.phone && (
                                    <li><a href={`tel:${D.CONTACT.phone.replace(/\s/g, '')}`}>{D.CONTACT.phone} →</a></li>
                                )}
                            </ul>
                            <p className="cmp-footnote">
                                We&apos;ll share general information about our properties. We don&apos;t give financial, tax or
                                SMSF advice, so we&apos;ll suggest you speak to a licensed adviser before you decide.
                            </p>
                        </div>
                        <div className="cmp-book-form cmp-reveal">
                            {D.BOOKING_URL && (
                                <>
                                    <iframe className="cmp-booking" src={D.BOOKING_URL} title="Book a 20-minute discussion" loading="lazy" />
                                    <p className="cmp-footnote">Prefer us to call you? Use the form below.</p>
                                </>
                            )}
                            {form}
                        </div>
                    </div>
                </div>
            </section>

            {/* ---------------- Important information ---------------- */}
            <section className="cmp-section cmp-fine" id="important-information" aria-labelledby="fine-title">
                <div className="cmp-wrap">
                    <h2 className="cmp-h4" id="fine-title">Important information</h2>
                    <p className="cmp-disclaimer">{D.DISCLAIMER}</p>
                    <p className="cmp-fine-text">{D.SMSF_NOTE}</p>
                    <p className="cmp-fine-text">
                        Arcadea Property does not hold an Australian Financial Services Licence. Licensed Real Estate
                        Agent No. 4857148. Information current as at {D.UPDATED}.
                    </p>
                    <h3 className="cmp-h5">Research referenced</h3>
                    <ul className="cmp-logo-strip">
                        {D.RESEARCH_LOGOS.map(([file, name]) => (
                            <li key={file}><SourceChip logo={file} name={name} /></li>
                        ))}
                    </ul>
                    <p className="cmp-fine-text">
                        Logos identify the sources of figures cited on this page. Their use doesn&apos;t imply any
                        endorsement of Arcadea Property or its properties.
                    </p>
                    <h3 className="cmp-h5">Sources</h3>
                    <ul className="cmp-sources">
                        {D.SOURCES.map((s) => <li key={s}>{s}</li>)}
                    </ul>
                </div>
            </section>

            {/* Sticky CTA on phones */}
            <div className={`cmp-sticky ${showSticky ? 'is-shown' : ''}`} aria-hidden={!showSticky}>
                <a href="#book" className="cmp-btn cmp-btn-primary" tabIndex={showSticky ? 0 : -1} onClick={() => onCta('sticky')}>
                    Book a discussion
                </a>
            </div>
        </div>
    );
};

export default CommercialIndustrialPage;
