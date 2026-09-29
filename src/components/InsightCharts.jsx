import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
    LabelList,
    ReferenceDot,
} from 'recharts';
import useInView from '../hooks/useInView';
import './InsightCharts.css';

/*
 * Reusable chart building blocks for insight / research pages, built on
 * Recharts. Charts mount (and so animate in) when scrolled into view, every
 * chart has a hover/keyboard tooltip, and each can expose its raw numbers as
 * a table (see <ChartDataTable>) so nothing depends on colour or hover alone.
 *
 * Colours are passed as CSS custom properties (e.g. 'var(--chart-a)') so the
 * page's light/dark themes each supply their own validated steps.
 */

const NARROW = 560; // px — below this, charts switch to compact labels

const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Tracks an element's rendered width. */
function useWidth(ref) {
    const [width, setWidth] = useState(0);
    useLayoutEffect(() => {
        const el = ref.current;
        if (!el || typeof ResizeObserver === 'undefined') return undefined;
        // ResizeObserver reports the initial size as soon as it starts observing
        const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
        ro.observe(el);
        return () => ro.disconnect();
    }, [ref]);
    return width;
}

/**
 * Reserves the chart's height, then renders it once it's in view so the
 * Recharts entry animation plays as the reader arrives rather than on load.
 */
function ChartFrame({ height, ariaLabel, children }) {
    const ref = useRef(null);
    const inView = useInView(ref);
    const width = useWidth(ref);
    return (
        <div className="ic-frame" ref={ref} style={{ height }} role="figure" aria-label={ariaLabel}>
            {inView && width > 0 && children(width)}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Small non-chart pieces                                              */
/* ------------------------------------------------------------------ */

/** Animated number that counts up from 0 once `active` turns true. */
export function CountUp({ value, active, duration = 1400 }) {
    const [display, setDisplay] = useState(0);
    const reduced = prefersReducedMotion();
    useEffect(() => {
        if (!active || reduced) return undefined;
        let frame;
        const start = performance.now();
        const tick = (now) => {
            // rAF's timestamp can precede `start`, so clamp at 0 too
            const t = Math.min(1, Math.max(0, (now - start) / duration));
            const eased = 1 - Math.pow(1 - t, 3);
            setDisplay(Math.round(value * eased));
            if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [value, active, duration, reduced]);
    return <>{reduced ? value : display}</>;
}

/** Pill-style segmented control (radio semantics). */
export function Segmented({ label, options, value, onChange }) {
    return (
        <div className="chart-seg" role="radiogroup" aria-label={label}>
            {options.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={value === opt.value}
                    disabled={opt.disabled}
                    title={opt.title}
                    className={`chart-seg-btn ${value === opt.value ? 'active' : ''}`}
                    onClick={() => onChange(opt.value)}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}

export function Legend({ items }) {
    return (
        <ul className="chart-legend">
            {items.map((item) => (
                <li key={item.label}>
                    <span className={`chart-swatch ${item.variant || ''}`} style={{ '--swatch': item.color }} />
                    {item.label}
                </li>
            ))}
        </ul>
    );
}

/** Collapsible table of the numbers behind a chart. */
export function ChartDataTable({ caption, columns, rows }) {
    return (
        <details className="chart-table">
            <summary>View the data</summary>
            <div className="chart-table-scroll">
                <table>
                    <caption>{caption}</caption>
                    <thead>
                        <tr>
                            {columns.map((c) => (
                                <th key={c} scope="col">{c}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, i) => (
                            <tr key={i}>
                                {row.map((cell, j) =>
                                    j === 0 ? <th key={j} scope="row">{cell}</th> : <td key={j}>{cell}</td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </details>
    );
}

/* ------------------------------------------------------------------ */
/*  Shared Recharts bits                                                */
/* ------------------------------------------------------------------ */

const AXIS_TICK = { fill: 'var(--text-muted)', fontSize: 12 };

const ChartTooltip = ({ active, payload, render }) => {
    if (!active || !payload?.length) return null;
    return <div className="ic-tooltip">{render(payload[0].payload, payload)}</div>;
};

/* ------------------------------------------------------------------ */
/*  Bar chart                                                           */
/*                                                                      */
/*  orientation 'horizontal' → bars grow left-to-right, one row per     */
/*  category (good for long category names). 'vertical' → columns.     */
/*                                                                      */
/*  series: [{ dataKey, name, color, pattern?, colorFor?(row) }]        */
/*    pattern   — hatched fill (secondary encoding for a lighter series) */
/*    colorFor  — per-row colour, e.g. to highlight a leader            */
/* ------------------------------------------------------------------ */

export function InsightBarChart({
    data,
    categoryKey,
    shortCategoryKey,     // used on narrow screens, if given
    subCategoryKey,       // optional second line under vertical-bar categories
    series,
    orientation = 'horizontal',
    domain,
    ticks,
    valueFormat,
    tickFormat = valueFormat,
    labelFor,             // (row, dataKey, value) → value label text
    isHighlighted,        // (row) → bold category label
    renderTooltip,        // (row) → tooltip content
    height: fixedHeight,
    ariaLabel,
}) {
    const patternBase = `ic-hatch-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
    const reduced = prefersReducedMotion();
    const horizontal = orientation === 'horizontal';
    const barSize = 22;
    const rowHeight = series.length * barSize + (series.length - 1) * 2 + 30;
    const height = fixedHeight || (horizontal ? data.length * rowHeight + 40 : 320);

    return (
        <ChartFrame height={height} ariaLabel={ariaLabel}>
            {(width) => {
                const narrow = width < NARROW;
                const axisKey = narrow && shortCategoryKey ? shortCategoryKey : categoryKey;
                const rowFor = (value) => data.find((row) => row[axisKey] === value);

                const CategoryTick = ({ x, y, payload }) => {
                    const row = rowFor(payload.value);
                    const hl = row && isHighlighted?.(row);
                    if (horizontal) {
                        return (
                            <text x={x} y={y} dy="0.35em" textAnchor="end" className={`ic-cat ${hl ? 'is-hl' : ''}`}>
                                {payload.value}
                            </text>
                        );
                    }
                    return (
                        <g transform={`translate(${x},${y})`}>
                            <text y={14} textAnchor="middle" className={`ic-cat ${hl ? 'is-hl' : ''}`}>
                                {payload.value}
                            </text>
                            {subCategoryKey && row && (
                                <text y={31} textAnchor="middle" className="ic-cat-sub">{row[subCategoryKey]}</text>
                            )}
                        </g>
                    );
                };

                const valueLabel = (dataKey, seriesIdx) => function ValueLabel({ x, y, width: w, height: h, value, index }) {
                    if (value == null) return null;
                    const text = labelFor ? labelFor(data[index], dataKey, value) : valueFormat(value);
                    if (horizontal) {
                        return (
                            <text x={x + w + 8} y={y + h / 2} dy="0.35em" className="ic-value">{text}</text>
                        );
                    }
                    // Paired columns are narrower than their labels on small
                    // screens, so push each label outward, away from its partner
                    let tx = x + w / 2;
                    let anchor = 'middle';
                    if (narrow && series.length === 2) {
                        tx = seriesIdx === 0 ? x + w : x;
                        anchor = seriesIdx === 0 ? 'end' : 'start';
                    }
                    return <text x={tx} y={y - 7} textAnchor={anchor} className="ic-value">{text}</text>;
                };

                const numberAxisProps = {
                    type: 'number',
                    domain,
                    ticks,
                    tickFormatter: tickFormat,
                    tick: AXIS_TICK,
                    axisLine: false,
                    tickLine: false,
                    allowDataOverflow: true,
                };
                const categoryAxisProps = {
                    type: 'category',
                    dataKey: axisKey,
                    tick: CategoryTick,
                    axisLine: false,
                    tickLine: false,
                    interval: 0,
                };

                return (
                    <BarChart
                        width={width}
                        height={height}
                        data={data}
                        layout={horizontal ? 'vertical' : 'horizontal'}
                        margin={horizontal
                            ? { top: 4, right: 64, bottom: 4, left: 8 }
                            : { top: 28, right: 8, bottom: subCategoryKey ? 24 : 8, left: 0 }}
                        barGap={2}
                        barSize={horizontal ? barSize : undefined}
                        barCategoryGap={horizontal ? undefined : narrow ? '18%' : '28%'}
                    >
                        <defs>
                            {series.filter((s) => s.pattern).map((s) => (
                                <pattern
                                    key={s.dataKey}
                                    id={`${patternBase}-${s.dataKey}`}
                                    width="6"
                                    height="6"
                                    patternUnits="userSpaceOnUse"
                                    patternTransform="rotate(45)"
                                >
                                    <line x1="0" y1="0" x2="0" y2="6" style={{ stroke: s.color }} strokeWidth="2.5" />
                                </pattern>
                            ))}
                        </defs>
                        <CartesianGrid
                            stroke="var(--chart-grid)"
                            horizontal={!horizontal}
                            vertical={horizontal}
                        />
                        {horizontal ? (
                            <>
                                <XAxis {...numberAxisProps} />
                                <YAxis {...categoryAxisProps} width={narrow ? 118 : 220} />
                            </>
                        ) : (
                            <>
                                <XAxis {...categoryAxisProps} height={subCategoryKey ? 44 : 30} />
                                <YAxis {...numberAxisProps} width={52} />
                            </>
                        )}
                        <Tooltip
                            cursor={{ fill: 'var(--chart-cursor)' }}
                            isAnimationActive={false}
                            content={<ChartTooltip render={renderTooltip} />}
                        />
                        {series.map((s, i) => (
                            <Bar
                                key={s.dataKey}
                                dataKey={s.dataKey}
                                name={s.name}
                                fill={s.pattern ? `url(#${patternBase}-${s.dataKey})` : s.color}
                                stroke={s.pattern ? s.color : undefined}
                                strokeWidth={s.pattern ? 1.5 : 0}
                                radius={horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
                                // Recharts drops zero-height bars (and their labels);
                                // a 2px sliver keeps values like "$0" visible
                                minPointSize={horizontal ? 0 : 2}
                                isAnimationActive={!reduced}
                                animationBegin={i * 120}
                                animationDuration={1100}
                                animationEasing="ease-out"
                            >
                                {s.colorFor && data.map((row) => (
                                    <Cell key={row[categoryKey]} fill={s.colorFor(row)} />
                                ))}
                                <LabelList dataKey={s.dataKey} content={valueLabel(s.dataKey, i)} />
                            </Bar>
                        ))}
                    </BarChart>
                );
            }}
        </ChartFrame>
    );
}

/* ------------------------------------------------------------------ */
/*  Line chart                                                          */
/*  series: [{ dataKey, name, color, dashed? }]                         */
/*  callout: { dataKey, text } — label on that series' final point      */
/* ------------------------------------------------------------------ */

export function InsightLineChart({
    data,
    xKey,
    series,
    domain,
    ticks,
    formatY,
    formatTooltip,
    xTickFormat = (v) => v,
    callout,
    ariaLabel,
}) {
    const reduced = prefersReducedMotion();
    const last = data[data.length - 1];

    return (
        <ChartFrame height={340} ariaLabel={ariaLabel}>
            {(width) => {
                const narrow = width < NARROW;
                const height = narrow ? 290 : 340;
                const lastIdx = data.length - 1;

                const XTick = ({ x, y, payload, index }) => (
                    <text
                        x={x}
                        y={y + 14}
                        className="ic-axis"
                        textAnchor={index === 0 ? 'start' : index === lastIdx ? 'end' : 'middle'}
                    >
                        {xTickFormat(payload.value, index, lastIdx)}
                    </text>
                );

                const CalloutLabel = ({ viewBox }) => (
                    <text x={viewBox.x - 10} y={viewBox.y - 16} textAnchor="end" className="ic-callout">
                        {callout.text}
                    </text>
                );

                return (
                    <LineChart
                        width={width}
                        height={height}
                        data={data}
                        margin={{ top: 36, right: 14, bottom: 8, left: 0 }}
                    >
                        <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
                        <XAxis
                            dataKey={xKey}
                            tick={XTick}
                            axisLine={false}
                            tickLine={false}
                            interval={0}
                            padding={{ left: 6, right: 6 }}
                        />
                        <YAxis
                            domain={domain}
                            ticks={ticks}
                            tickFormatter={formatY}
                            tick={AXIS_TICK}
                            axisLine={false}
                            tickLine={false}
                            width={narrow ? 52 : 62}
                        />
                        <Tooltip
                            cursor={{ stroke: 'var(--text-muted)', strokeDasharray: '3 3' }}
                            isAnimationActive={false}
                            content={
                                <ChartTooltip
                                    render={(row, payload) => (
                                        <>
                                            <strong>{row[xKey]}</strong>
                                            {payload.map((p) => (
                                                <span key={p.dataKey} className="tip-row">
                                                    <span className="chart-swatch" style={{ '--swatch': p.color }} />
                                                    {p.name}: {formatTooltip(p.value)}
                                                </span>
                                            ))}
                                        </>
                                    )}
                                />
                            }
                        />
                        {series.map((s, i) => (
                            <Line
                                key={s.dataKey}
                                type="linear"
                                dataKey={s.dataKey}
                                name={s.name}
                                stroke={s.color}
                                strokeWidth={2.5}
                                strokeDasharray={s.dashed ? '6 5' : undefined}
                                dot={{ r: 4.5, fill: s.color, stroke: 'var(--chart-card)', strokeWidth: 2 }}
                                activeDot={{ r: 6, fill: s.color, stroke: 'var(--chart-card)', strokeWidth: 2 }}
                                isAnimationActive={!reduced}
                                animationBegin={i * 250}
                                animationDuration={1400}
                                animationEasing="ease-in-out"
                            />
                        ))}
                        {callout && (
                            <ReferenceDot
                                x={last[xKey]}
                                y={last[callout.dataKey]}
                                r={0}
                                ifOverflow="visible"
                                label={<CalloutLabel />}
                            />
                        )}
                    </LineChart>
                );
            }}
        </ChartFrame>
    );
}
