import React, { useEffect, useRef, useState } from 'react';
import {
    InformationCircleIcon,
    ArrowTopRightOnSquareIcon,
    ArrowRightIcon,
    CheckCircleIcon,
    PlayIcon,
} from '@heroicons/react/24/outline';
import usePageTitle from '../../hooks/usePageTitle';
import useInView from '../../hooks/useInView';
import { useNavVisibility } from '../../context/NavVisibilityContext';
import { LICENCE } from '../../data/insights/shared';
import { fmtInt } from './format';
import './InsightKit.css';

/*
 * Building blocks for the Arcadea Insights pages (one page per video).
 * Everything that moves animates once, as it scrolls into view, and settles
 * immediately for visitors who prefer reduced motion. Bars are plain HTML
 * rather than SVG so their labels stay at a readable size on phones.
 *
 * Colours come from the chart tokens in components/InsightCharts.css plus
 * the --ins-* tokens in InsightKit.css.
 */

const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/* ------------------------------------------------------------------ */
/*  Numbers                                                             */
/* ------------------------------------------------------------------ */

/**
 * Tweens from its previous value to `value` once `active` is true, so it
 * counts up on arrival and glides when an interactive control changes it.
 */
export function AnimatedNumber({ value, active = true, format = fmtInt, duration = 1200 }) {
    const [display, setDisplay] = useState(0);
    const fromRef = useRef(0);
    const reduced = prefersReducedMotion();

    useEffect(() => {
        if (!active || reduced) return undefined;
        const from = fromRef.current;
        if (from === value) return undefined;
        let frame;
        const start = performance.now();
        const tick = (now) => {
            const t = Math.min(1, Math.max(0, (now - start) / duration));
            const eased = 1 - Math.pow(1 - t, 3);
            const v = from + (value - from) * eased;
            fromRef.current = v;
            setDisplay(v);
            if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [value, active, duration, reduced]);

    return <>{format(reduced ? value : display)}</>;
}

/** One figure: "$0", "3–12 yrs", "16.5%", "+14,718". */
function Figure({ item, active }) {
    const { value, from, decimals = 0, prefix = '', suffix = '', display } = item;
    if (display) return <>{display}</>;
    const fmt = (n) => n.toLocaleString('en-AU', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    return (
        <>
            {from != null && (
                <>
                    {prefix}
                    <AnimatedNumber value={from} active={active} format={fmt} />
                    –
                </>
            )}
            {from == null && prefix}
            <AnimatedNumber value={value} active={active} format={fmt} />
            {suffix}
        </>
    );
}

/* ------------------------------------------------------------------ */
/*  Page shell                                                          */
/* ------------------------------------------------------------------ */

function ReadingProgress() {
    const barRef = useRef(null);
    useEffect(() => {
        let frame = 0;
        const update = () => {
            frame = 0;
            const el = document.documentElement;
            const max = el.scrollHeight - el.clientHeight;
            const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
            if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
        };
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            if (frame) cancelAnimationFrame(frame);
        };
    }, []);
    return <div className="ins-progress" ref={barRef} aria-hidden="true" />;
}

/**
 * Page wrapper: title + meta, scroll to top, white navbar over the dark hero,
 * scroll-reveal for `.reveal`. `seo` is { title, description } from
 * data/insights/shared.js, which prerender.js reads too.
 */
export function InsightPage({ seo, noindex = false, children }) {
    usePageTitle(seo.title, { description: seo.description, noindex });

    const pageRef = useRef(null);
    const { setNavOverDarkHero } = useNavVisibility();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, []);

    useEffect(() => {
        setNavOverDarkHero(true);
        return () => setNavOverDarkHero(false);
    }, [setNavOverDarkHero]);

    // Fade/slide `.reveal` elements in as they arrive, including any that
    // mount later (e.g. cards swapped by an interactive control)
    useEffect(() => {
        const root = pageRef.current;
        if (!root) return undefined;
        if (typeof IntersectionObserver === 'undefined') {
            root.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-revealed'));
            return undefined;
        }
        const seen = new WeakSet();
        const observer = new IntersectionObserver(
            (entries) => entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    observer.unobserve(entry.target);
                }
            }),
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );
        const scan = () => root.querySelectorAll('.reveal:not(.is-revealed)').forEach((el) => {
            if (!seen.has(el)) {
                seen.add(el);
                observer.observe(el);
            }
        });
        scan();
        const mutations = new MutationObserver(scan);
        mutations.observe(root, { childList: true, subtree: true });
        return () => {
            mutations.disconnect();
            observer.disconnect();
        };
    }, []);

    return (
        <div className="ins-page" ref={pageRef}>
            <ReadingProgress />
            {children}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                                */
/* ------------------------------------------------------------------ */

/** The vertical reel, tap to play. Nothing downloads until it's played. */
export function ReelVideo({ src, poster, title, duration }) {
    const videoRef = useRef(null);
    const [playing, setPlaying] = useState(false);

    const play = () => {
        setPlaying(true);
        // Let React swap in the controls first, then start with sound
        requestAnimationFrame(() => videoRef.current?.play().catch(() => {}));
    };

    return (
        <figure className="ins-reel">
            <div className="ins-reel-frame">
                <video
                    ref={videoRef}
                    src={src}
                    poster={poster}
                    preload="none"
                    playsInline
                    controls={playing}
                    aria-label={`Video: ${title}`}
                />
                {!playing && (
                    <button type="button" className="ins-reel-play" onClick={play} aria-label={`Play the video: ${title}`}>
                        <span className="ins-reel-play-icon"><PlayIcon aria-hidden="true" /></span>
                    </button>
                )}
            </div>
            <figcaption>
                <span>Watch the video</span>
                {duration && <span className="ins-reel-dot">·</span>}
                {duration && <span>{duration}</span>}
                <span className="ins-reel-dot">·</span>
                <span>Captions on</span>
            </figcaption>
        </figure>
    );
}

function HeroStats({ stats }) {
    const ref = useRef(null);
    // Low threshold: stacked on phones, the block is taller than the screen
    const inView = useInView(ref, 0.05);
    return (
        <div className={`ins-stats ins-stats-${stats.length}`} ref={ref}>
            {stats.map((s, i) => (
                <div className="ins-stat" key={s.label} style={{ '--i': i }}>
                    <span className="ins-stat-value"><Figure item={s} active={inView} /></span>
                    <span className="ins-stat-label">{s.label}</span>
                    {s.foot && <span className="ins-stat-foot">{s.foot}</span>}
                </div>
            ))}
        </div>
    );
}

/**
 * Dark photo hero (dark in both themes). `image` is { src, srcSet?, position? };
 * `video` is the reel, shown beside the copy on desktop and under it on phones.
 */
export function InsightHero({ eyebrow, title, accent, subtitle, stats, video, image, notice }) {
    return (
        <header className="ins-hero">
            {image && (
                <div className="ins-hero-media" aria-hidden="true" style={{ '--pos': image.position || '50% 50%' }}>
                    <picture>
                        {image.sources?.map((s) => (
                            <source key={s.type} type={s.type} srcSet={s.srcSet} sizes="100vw" />
                        ))}
                        <img src={image.src} alt="" decoding="async" fetchPriority="high" />
                    </picture>
                </div>
            )}
            <div className="container ins-hero-grid">
                <div className="ins-hero-copy">
                    <span className="ins-eyebrow ins-hero-in" style={{ '--d': '0ms' }}>{eyebrow}</span>
                    <h1 className="ins-title ins-hero-in" style={{ '--d': '120ms' }}>
                        {title} {accent && <span>{accent}</span>}
                    </h1>
                    <p className="ins-subtitle ins-hero-in" style={{ '--d': '240ms' }}>{subtitle}</p>
                    {notice && (
                        <p className="ins-notice ins-hero-in" style={{ '--d': '360ms' }}>
                            <InformationCircleIcon aria-hidden="true" />
                            <span>
                                {notice}{' '}
                                <a href="#important-information">Read the full disclaimer and sources</a>
                            </span>
                        </p>
                    )}
                </div>
                {video && (
                    <div className="ins-hero-reel ins-hero-in" style={{ '--d': '300ms' }}>
                        <ReelVideo {...video} />
                    </div>
                )}
                {stats && (
                    <div className="ins-hero-stats">
                        <HeroStats stats={stats} />
                    </div>
                )}
            </div>
        </header>
    );
}

/* ------------------------------------------------------------------ */
/*  Layout                                                              */
/* ------------------------------------------------------------------ */

/** "The short version": the page in four sentences, for skimmers. */
export function ShortVersion({ items }) {
    return (
        <section className="ins-section ins-section-tight" aria-labelledby="short-version">
            <div className="container">
                <div className="ins-short reveal reveal-up">
                    <h2 id="short-version" className="ins-kicker">The short version</h2>
                    <ol>
                        {items.map((item, i) => (
                            <li key={i} className="reveal reveal-up" style={{ transitionDelay: `${120 + i * 90}ms` }}>
                                <span className="ins-short-num" aria-hidden="true">{i + 1}</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </section>
    );
}

/** A numbered section with a heading, a one-paragraph lede and its content. */
export function Section({ id, number, kicker, title, lede, children, aside }) {
    return (
        <section id={id} className="ins-section">
            <div className="container">
                <div className={`ins-section-head reveal reveal-up ${aside ? 'has-aside' : ''}`}>
                    <div>
                        <div className="ins-section-eyebrow">
                            {number != null && <span className="ins-section-num">{String(number).padStart(2, '0')}</span>}
                            {kicker && <span className="ins-badge">{kicker}</span>}
                        </div>
                        <h2 className="ins-h2">{title}</h2>
                        {lede && <div className="ins-lede">{lede}</div>}
                    </div>
                    {aside}
                </div>
                {children}
            </div>
        </section>
    );
}

/** The card a visual sits on, with optional controls, footnote and data table. */
export function Panel({ controls, children, footnote, table, className = '' }) {
    return (
        <div className={`ins-panel reveal reveal-up ${className}`}>
            {controls && <div className="ins-controls">{controls}</div>}
            {children}
            {footnote && <p className="ins-footnote">{footnote}</p>}
            {table}
        </div>
    );
}

/** Two columns on desktop (text + visual), stacked on phones. */
export function Split({ children, reverse, className = '' }) {
    return <div className={`ins-split ${reverse ? 'is-reverse' : ''} ${className}`}>{children}</div>;
}

export function Prose({ children, className = '' }) {
    return <div className={`ins-prose reveal reveal-up ${className}`}>{children}</div>;
}

export function Callout({ icon, title, children, tone = 'gold' }) {
    const Icon = icon || InformationCircleIcon;
    return (
        <aside className={`ins-callout tone-${tone} reveal reveal-up`}>
            <Icon className="ins-callout-icon" aria-hidden="true" />
            <div>
                {title && <strong>{title}</strong>}
                {children}
            </div>
        </aside>
    );
}

/** Live sentence above an interactive visual; announced to screen readers. */
export function LiveNote({ children }) {
    return <p className="ins-live" aria-live="polite">{children}</p>;
}

/* ------------------------------------------------------------------ */
/*  Visuals                                                             */
/* ------------------------------------------------------------------ */

/** Grid of figure cards that count up into view. */
export function KeyFigures({ items, columns }) {
    const ref = useRef(null);
    const inView = useInView(ref, 0.15);
    return (
        <div className={`ins-figures cols-${columns || Math.min(items.length, 4)}`} ref={ref}>
            {items.map((f, i) => (
                <div className={`ins-figure reveal reveal-up ${f.tone ? `tone-${f.tone}` : ''}`} key={f.label} style={{ transitionDelay: `${i * 90}ms` }}>
                    <span className="ins-figure-value"><Figure item={f} active={inView} /></span>
                    <span className="ins-figure-label">{f.label}</span>
                    {f.foot && <span className="ins-figure-foot">{f.foot}</span>}
                </div>
            ))}
        </div>
    );
}

/** Icon cards: "who's who", housing types, buyer types. */
export function FeatureCards({ items, columns }) {
    return (
        <div className={`ins-cards cols-${columns || items.length}`}>
            {items.map((c, i) => {
                const Icon = c.icon;
                return (
                    <article
                        className={`ins-card reveal reveal-up ${c.dim ? 'is-dim' : ''} ${c.highlight ? 'is-hl' : ''}`}
                        key={c.title}
                        style={{ transitionDelay: `${i * 100}ms` }}
                    >
                        {c.tag && <span className="ins-card-tag">{c.tag}</span>}
                        {Icon && <Icon className="ins-card-icon" aria-hidden="true" />}
                        <h3>{c.title}</h3>
                        <p>{c.body}</p>
                    </article>
                );
            })}
        </div>
    );
}

/**
 * Horizontal bars in HTML. Handles negative values (bars grow out from a
 * zero line) and dashed reference markers.
 *
 * items:   [{ label, sub?, value, display?, tone?, highlight? }]
 *          tone: 'primary' | 'accent' | 'neutral' | 'negative' | 'auto' (sign)
 * markers: [{ value, label }]
 * labelWidth: CSS length for the label column. Bars with short labels (years)
 *          keep the side-by-side layout on phones; without it, the label sits
 *          above its bar there.
 */
export function BarList({
    items,
    min = 0,
    max,
    markers = [],
    format = fmtInt,
    labelWidth,
    ariaLabel,
    zeroLabel,
}) {
    const ref = useRef(null);
    const inView = useInView(ref, 0.2);
    const span = max - min;
    const zero = (-min / span) * 100;
    const toneFor = (it) => (it.tone && it.tone !== 'auto' ? it.tone : it.value < 0 ? 'negative' : 'primary');
    // Marker labels can stack on separate lines (level 0, 1…) so they never collide
    const markerRows = markers.length ? Math.max(...markers.map((m) => m.level || 0)) + 1 : 0;

    return (
        <div
            ref={ref}
            className={`ins-bars ${labelWidth ? 'is-compact' : ''} ${markers.length ? 'has-markers' : ''} ${min < 0 ? 'is-diverging' : ''} ${inView ? 'is-in' : ''}`}
            style={{
                '--zero': `${zero}%`,
                '--marker-rows': markerRows,
                ...(labelWidth ? { '--label-w': labelWidth } : null),
            }}
            role="list"
            aria-label={ariaLabel}
        >
            {markers.map((m) => {
                const p = (m.value - min) / span;
                return (
                    <div
                        className={`ins-bars-marker ${p > 0.6 ? 'is-right' : ''}`}
                        style={{ '--p': p, '--level': m.level || 0 }}
                        key={m.label}
                        aria-hidden="true"
                    >
                        <span>{m.label}</span>
                    </div>
                );
            })}
            {min < 0 && zeroLabel && <div className="ins-bars-zero-label" aria-hidden="true">{zeroLabel}</div>}
            {items.map((it, i) => {
                const w = (Math.abs(it.value) / span) * 100;
                const neg = it.value < 0;
                return (
                    <div
                        role="listitem"
                        className={`ins-bar tone-${toneFor(it)} ${it.highlight ? 'is-hl' : ''} ${it.value === 0 ? 'is-zero' : ''}`}
                        key={`${it.label}-${it.sub || ''}`}
                        style={{ '--i': i }}
                    >
                        <div className="ins-bar-label">
                            {it.label}
                            {it.sub && <small>{it.sub}</small>}
                        </div>
                        <div className="ins-bar-track">
                            {markers.map((m) => (
                                <span
                                    key={m.label}
                                    className="ins-bar-mark"
                                    style={{ left: `${((m.value - min) / span) * 100}%` }}
                                    aria-hidden="true"
                                />
                            ))}
                            <span
                                className={`ins-bar-fill ${neg ? 'is-neg' : ''}`}
                                style={{ '--w': `${inView ? Math.max(w, it.value === 0 ? 0 : 0.6) : 0}%` }}
                            />
                        </div>
                        <div className="ins-bar-value">
                            {it.display ?? <AnimatedNumber value={it.value} active={inView} format={format} />}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

/** One bar split into parts, e.g. rent → fee + what's left. */
export function SplitBar({ parts, ariaLabel, format = fmtInt, total: totalOverride }) {
    const ref = useRef(null);
    const inView = useInView(ref, 0.25);
    const total = totalOverride ?? parts.reduce((sum, p) => sum + p.value, 0);
    return (
        <div className={`ins-split-bar ${inView ? 'is-in' : ''}`} ref={ref}>
            <div className="ins-split-track" role="img" aria-label={ariaLabel}>
                {parts.map((p, i) => (
                    <span
                        key={p.label}
                        className={`ins-split-seg tone-${p.tone || 'primary'}`}
                        style={{ '--w': `${inView ? (p.value / total) * 100 : 0}%`, '--i': i }}
                    />
                ))}
            </div>
            <ul className="ins-split-legend">
                {parts.map((p) => (
                    <li key={p.label} className={`tone-${p.tone || 'primary'}`}>
                        <span className="ins-split-swatch" />
                        <span className="ins-split-value">
                            {p.display ?? <AnimatedNumber value={p.value} active={inView} format={format} />}
                        </span>
                        <span className="ins-split-label">{p.label}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

/** A grid of dots, `lit` of them highlighted in turn (58 of 100, 180 quarters…). */
export function DotGrid({ total, lit, columns = 10, ariaLabel, tone = 'accent' }) {
    const ref = useRef(null);
    const inView = useInView(ref, 0.3);
    const step = Math.min(18, 1400 / lit);
    return (
        <div
            ref={ref}
            className={`ins-dots tone-${tone} ${inView ? 'is-in' : ''}`}
            style={{ '--cols': columns }}
            role="img"
            aria-label={ariaLabel}
        >
            {Array.from({ length: total }, (_, i) => (
                <span key={i} className={i < lit ? 'is-lit' : ''} style={{ transitionDelay: i < lit ? `${Math.round(i * step)}ms` : undefined }} />
            ))}
        </div>
    );
}

/** Vertical timeline. state: 'done' | 'now' | 'next'. */
export function Timeline({ items }) {
    const ref = useRef(null);
    const inView = useInView(ref, 0.2);
    return (
        <ol className={`ins-timeline ${inView ? 'is-in' : ''}`} ref={ref}>
            {items.map((it, i) => (
                <li key={`${it.date}-${it.title}`} className={`is-${it.state || 'done'}`} style={{ '--i': i }}>
                    <span className="ins-timeline-dot" aria-hidden="true" />
                    <span className="ins-timeline-date">{it.date}</span>
                    <strong>{it.title}</strong>
                    {it.body && <p>{it.body}</p>}
                </li>
            ))}
        </ol>
    );
}

export function Checklist({ items, icon, columns = 2 }) {
    const Icon = icon || CheckCircleIcon;
    return (
        <ul className={`ins-checklist cols-${columns}`}>
            {items.map((it, i) => (
                <li key={it.title} className="reveal reveal-up" style={{ transitionDelay: `${i * 70}ms` }}>
                    <Icon aria-hidden="true" />
                    <div>
                        <strong>{it.title}</strong>
                        {it.body && <span>{it.body}</span>}
                    </div>
                </li>
            ))}
        </ul>
    );
}

/* ------------------------------------------------------------------ */
/*  Close of the page                                                   */
/* ------------------------------------------------------------------ */

export function InsightCTA({ title, body, actions }) {
    return (
        <section className="ins-section" id="talk-to-us">
            <div className="container">
                <div className="ins-cta reveal reveal-up">
                    <h2 className="ins-h2">{title}</h2>
                    {body && <p>{body}</p>}
                    <div className="ins-cta-actions">
                        {actions.map((a, i) => (
                            <a key={a.href} href={a.href} className={`btn ${i === 0 ? 'btn-primary' : 'btn-secondary'}`}>
                                {a.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export function RelatedInsights({ items }) {
    if (!items?.length) return null;
    return (
        <section className="ins-section ins-section-tight" aria-labelledby="related-insights">
            <div className="container">
                <h2 id="related-insights" className="ins-kicker reveal reveal-up">Read next</h2>
                <div className="ins-related">
                    {items.map((r, i) => (
                        <a key={r.path} href={r.path} className="ins-related-card reveal reveal-up" style={{ transitionDelay: `${i * 100}ms` }}>
                            <span className="ins-related-tag">{r.tag}</span>
                            <strong>{r.title}</strong>
                            <span className="ins-related-blurb">{r.blurb}</span>
                            <span className="ins-related-go">
                                Read the insight <ArrowRightIcon aria-hidden="true" />
                            </span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}

/**
 * "Important information and sources": short disclaimer, the fuller notes,
 * disclosure + licence line, dated sources and any map/data attributions.
 */
export function FinePrint({ disclaimer, details, disclosure, updated, sources, attributions }) {
    return (
        <section className="ins-section ins-section-fine" id="important-information">
            <div className="container">
                <h2 className="ins-h2 ins-fine-title">Important information and sources</h2>
                <aside className="ins-disclaimer" aria-label="Important information">
                    <strong>Important information.</strong> {disclaimer}
                </aside>

                <dl className="ins-fine-details">
                    {details.map((d) => (
                        <div key={d.title}>
                            <dt>{d.title}</dt>
                            <dd>{d.body}</dd>
                        </div>
                    ))}
                </dl>

                <p className="ins-fine-disclosure">
                    {disclosure} {LICENCE}
                </p>
                <p className="ins-fine-updated">Information current as at {updated}.</p>

                <div className="ins-sources">
                    <h3>Sources</h3>
                    <ul>
                        {sources.map((s) => (
                            <li key={s.url}>
                                <a href={s.url} target="_blank" rel="noopener noreferrer">
                                    {s.title}
                                    <ArrowTopRightOnSquareIcon aria-hidden="true" />
                                </a>
                                <span> — {s.publisher}{s.checked ? `, checked ${s.checked}` : ''}</span>
                            </li>
                        ))}
                    </ul>
                    {attributions?.length > 0 && (
                        <p className="ins-attributions">{attributions.join(' ')}</p>
                    )}
                </div>
            </div>
        </section>
    );
}
