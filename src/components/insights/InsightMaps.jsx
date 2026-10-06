import React, { useId, useRef } from 'react';
import useInView from '../../hooks/useInView';
import { fmtSigned } from './format';
import { AUSTRALIA, GOLD_COAST } from '../../data/insights/mapShapes';

/*
 * Maps for the insight pages, drawn from the same outlines as the videos
 * (see scripts/build-insight-maps.js). Lines draw on, then markers and
 * labels pop in, once the map scrolls into view. Exact figures always sit
 * in readable HTML next to each map, so the map itself can stay uncluttered.
 */

const toPath = (pts) => `M${pts.map((p) => p.join(' ')).join('L')}`;

/* ------------------------------------------------------------------ */
/*  Gold Coast: rail line, G:link light rail and growth centres         */
/* ------------------------------------------------------------------ */

export function GoldCoastMap() {
    const ref = useRef(null);
    const inView = useInView(ref, 0.25);
    const maskId = `gc-glink-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
    const { width, height, outline, rail, lightRail, markers } = GOLD_COAST;

    return (
        <figure className={`ins-map ${inView ? 'is-in' : ''}`} ref={ref}>
            <svg
                viewBox={`0 0 ${width} ${height}`}
                role="img"
                aria-label="Map of the City of Gold Coast. The heavy rail line runs north to south through Coomera, Helensvale and Robina. The G:link light rail runs from Helensvale through Southport to Burleigh Heads."
            >
                <defs>
                    <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={width} height={height}>
                        <path
                            className="ins-map-draw"
                            d={toPath(lightRail)}
                            pathLength="1"
                            style={{ stroke: '#fff', strokeWidth: 14, '--delay': '1000ms' }}
                        />
                    </mask>
                </defs>

                <path className="ins-map-land" d={outline} />

                {/* Heavy rail, stations joined in order */}
                <path
                    className="ins-map-draw"
                    d={toPath(rail)}
                    pathLength="1"
                    style={{ stroke: 'var(--chart-a)', strokeWidth: 5, '--delay': '300ms' }}
                />
                {rail.map(([x, y], i) => (
                    <circle
                        key={`rail-${i}`}
                        className="ins-map-pop"
                        cx={x}
                        cy={y}
                        r="5.5"
                        style={{ fill: 'var(--chart-card)', stroke: 'var(--chart-a)', strokeWidth: 3, '--delay': `${500 + i * 110}ms` }}
                    />
                ))}

                {/* G:link, stops joined in order; drawn on through a mask so the dashes stay put */}
                <path
                    d={toPath(lightRail)}
                    mask={`url(#${maskId})`}
                    style={{ fill: 'none', stroke: 'var(--chart-b)', strokeWidth: 4.5, strokeDasharray: '10 7', strokeLinecap: 'round' }}
                />

                {/* Growth centres */}
                {markers.map((m, i) => {
                    const [x, y] = m.at;
                    const left = m.side === 'left';
                    const dx = left ? -18 : 18;
                    return (
                        <g key={m.label} className="ins-map-pop" style={{ '--delay': `${1700 + i * 160}ms` }}>
                            <circle cx={x} cy={y} r="15" style={{ fill: 'rgba(var(--accent-gold-rgb), 0.25)' }} />
                            <circle cx={x} cy={y} r="8" style={{ fill: 'var(--accent-gold-light)', stroke: 'var(--chart-card)', strokeWidth: 2.5 }} />
                            <text
                                className="ins-map-label"
                                x={x + dx}
                                y={y + (m.note ? -4 : 8)}
                                textAnchor={left ? 'end' : 'start'}
                                fontSize="25"
                            >
                                {m.label}
                            </text>
                            {m.note && (
                                <text
                                    className="ins-map-label ins-map-sub"
                                    x={x + dx}
                                    y={y + 20}
                                    textAnchor={left ? 'end' : 'start'}
                                    fontSize="17"
                                >
                                    PDA
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
            <ul className="ins-map-legend">
                <li><span className="ins-map-key" style={{ '--fill': 'var(--chart-a)' }} />Heavy rail (stations joined)</li>
                <li><span className="ins-map-key is-dashed" style={{ '--fill': 'var(--chart-b)' }} />G:link light rail (stops joined)</li>
                <li><span className="ins-map-key is-dot" style={{ '--fill': 'var(--accent-gold-light)' }} />Centres named in the strategy; PDA = Priority Development Area</li>
            </ul>
        </figure>
    );
}

/* ------------------------------------------------------------------ */
/*  Australia: net interstate flows to and from Queensland              */
/* ------------------------------------------------------------------ */

// Where each state's label sits: [x, y of the value line, text-anchor].
// Sized to stay legible at phone width (viewBox is 1000 wide).
const LABEL_AT = {
    WA: [230, 390, 'middle'],
    NT: [505, 215, 'middle'],
    SA: [545, 500, 'middle'],
    NSW: [745, 580, 'middle'],
    VIC: [655, 760, 'middle'],
    TAS: [775, 895, 'end'],
    ACT: [995, 790, 'end'],
};

/**
 * flows: [{ code, net }] — net movement to Queensland (negative = more left
 * Queensland for that state than came the other way).
 */
export function AustraliaFlowMap({ flows, ariaLabel }) {
    const ref = useRef(null);
    const inView = useInView(ref, 0.25);
    const { width, height, states, points } = AUSTRALIA;
    const target = [points.Brisbane[0] - 70, points.Brisbane[1] - 20];
    const maxAbs = Math.max(...flows.map((f) => Math.abs(f.net)));
    const signOf = Object.fromEntries(flows.map((f) => [f.code, Math.sign(f.net)]));
    const order = [...flows].sort((a, b) => Math.abs(b.net) - Math.abs(a.net)).map((f) => f.code);

    const arrows = flows.map((f) => {
        const gain = f.net > 0;
        const origin = points[f.code];
        const [A, B] = gain ? [origin, target] : [target, origin];
        const sw = 2.5 + 9 * Math.sqrt(Math.abs(f.net) / maxAbs);
        // Bow each curve to one side of the straight line
        const mx = (A[0] + B[0]) / 2;
        const my = (A[1] + B[1]) / 2;
        const dx = B[0] - A[0];
        const dy = B[1] - A[1];
        const len = Math.hypot(dx, dy);
        const bow = Math.min(90, len * 0.18);
        const C = [mx + (dy / len) * bow, my - (dx / len) * bow];
        // Arrowhead along the curve's end tangent; stop the line short of the tip
        const tx = B[0] - C[0];
        const ty = B[1] - C[1];
        const tl = Math.hypot(tx, ty);
        const ux = tx / tl;
        const uy = ty / tl;
        const head = 16 + sw * 1.4;
        const end = [B[0] - ux * head * 0.7, B[1] - uy * head * 0.7];
        const wing = head * 0.55;
        const headPts = [
            [B[0], B[1]],
            [B[0] - ux * head - uy * wing, B[1] - uy * head + ux * wing],
            [B[0] - ux * head + uy * wing, B[1] - uy * head - ux * wing],
        ];
        const rank = order.indexOf(f.code);
        return {
            ...f,
            gain,
            sw,
            d: `M${A[0]} ${A[1]}Q${C[0].toFixed(1)} ${C[1].toFixed(1)} ${end[0].toFixed(1)} ${end[1].toFixed(1)}`,
            head: headPts.map((p) => p.map((n) => n.toFixed(1)).join(' ')).join(' '),
            delay: 500 + rank * 180,
        };
    });

    return (
        <figure className={`ins-map ${inView ? 'is-in' : ''}`} ref={ref}>
            <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ariaLabel}>
                {states.map((s) => (
                    <path
                        key={s.code}
                        className={`ins-map-land ${s.code === 'QLD' ? 'is-home' : signOf[s.code] > 0 ? 'is-gain' : signOf[s.code] < 0 ? 'is-loss' : ''}`}
                        d={s.d}
                    />
                ))}

                {arrows.map((a) => {
                    const color = a.gain ? 'var(--chart-a)' : 'var(--ins-neg)';
                    return (
                        <g key={a.code}>
                            <path
                                className="ins-map-draw"
                                d={a.d}
                                pathLength="1"
                                style={{ stroke: color, strokeWidth: a.sw, '--delay': `${a.delay}ms`, opacity: 0.92 }}
                            />
                            <polygon
                                className="ins-map-pop"
                                points={a.head}
                                style={{ fill: color, '--delay': `${a.delay + 1200}ms` }}
                            />
                        </g>
                    );
                })}

                {/* ACT is too small to label in place: leader line out to sea */}
                <g className="ins-map-pop" style={{ '--delay': '1400ms' }}>
                    <circle cx={points.ACT[0]} cy={points.ACT[1]} r="6" style={{ fill: 'var(--text-primary)' }} />
                    <path
                        d={`M${points.ACT[0]} ${points.ACT[1]}L${LABEL_AT.ACT[0] - 60} ${LABEL_AT.ACT[1] - 80}`}
                        style={{ stroke: 'var(--text-muted)', strokeWidth: 2, fill: 'none' }}
                    />
                </g>

                {flows.map((f, i) => {
                    const [x, y, anchor] = LABEL_AT[f.code];
                    return (
                        <g key={f.code} className="ins-map-pop" style={{ '--delay': `${1500 + i * 90}ms` }}>
                            <text className="ins-map-label ins-map-sub" x={x} y={y - 46} textAnchor={anchor} fontSize="34">
                                {f.code}
                            </text>
                            <text className="ins-map-label" x={x} y={y} textAnchor={anchor} fontSize="46">
                                {fmtSigned(f.net)}
                            </text>
                        </g>
                    );
                })}

                <g className="ins-map-pop" style={{ '--delay': '400ms' }}>
                    <text className="ins-map-label ins-map-sub" x={points.QLD[0] - 30} y={points.QLD[1] - 92} textAnchor="middle" fontSize="36">
                        QLD
                    </text>
                    <text className="ins-map-label" x={points.QLD[0] - 30} y={points.QLD[1] - 42} textAnchor="middle" fontSize="52">
                        {fmtSigned(flows.reduce((sum, f) => sum + f.net, 0))}
                    </text>
                </g>
            </svg>
            <ul className="ins-map-legend">
                <li><span className="ins-map-key" style={{ '--fill': 'var(--chart-a)' }} />Net gain to Queensland</li>
                <li><span className="ins-map-key" style={{ '--fill': 'var(--ins-neg)' }} />Net loss from Queensland</li>
                <li>Line width shows the size of the net flow</li>
            </ul>
        </figure>
    );
}
