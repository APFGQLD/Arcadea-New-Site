import React, { useState } from 'react';
import { PlayIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { InsightPage, InsightHero } from '../../components/insights/InsightKit';
import { Segmented } from '../../components/InsightCharts';
import { INSIGHTS, GENERAL_ADVICE, LICENCE } from '../../data/insights/shared';

// Newest first; 001 last
const ORDER = ['stampDuty', 'rates', 'migration', 'goldCoastGrowth', 'defenceHousing', 'newVsEstablished'];
const ITEMS = ORDER.map((key) => INSIGHTS[key]);

const FILTERS = ['All', ...new Set(ITEMS.map((i) => i.tag))];

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

const InsightsIndexPage = () => {
    const [filter, setFilter] = useState('All');
    const shown = filter === 'All' ? ITEMS : ITEMS.filter((i) => i.tag === filter);

    return (
        <InsightPage
            title="Arcadea Insights"
            description="Short, sourced explainers on Queensland property: stamp duty, interest rates, migration, Gold Coast growth, defence housing and the 2026 tax changes."
        >
            <InsightHero
                eyebrow="Arcadea Insights · Queensland property"
                title="The numbers behind the move."
                accent="Explained, and sourced."
                subtitle="Short explainers on what's shaping Queensland property, each with a video, the data behind it, and every source listed. General information, never a forecast."
                image={HERO_IMAGE}
            />

            <section className="ins-section">
                <div className="container">
                    <div className="ins-index-head">
                        <h2 className="ins-kicker">{shown.length} insight{shown.length === 1 ? '' : 's'}</h2>
                        <Segmented
                            label="Filter by topic"
                            options={FILTERS.map((f) => ({ value: f, label: f }))}
                            value={filter}
                            onChange={setFilter}
                        />
                    </div>

                    <div className="ins-index-grid">
                        {shown.map((item, i) => (
                            <a
                                key={item.path}
                                href={item.path}
                                className="ins-index-card reveal reveal-up"
                                style={{ transitionDelay: `${i * 80}ms` }}
                            >
                                <span className="ins-index-thumb">
                                    <img src={item.poster} alt="" loading="lazy" decoding="async" />
                                    <span className="ins-index-play" aria-hidden="true"><PlayIcon /></span>
                                    <span className="ins-index-duration">{item.duration}</span>
                                </span>
                                <span className="ins-index-body">
                                    <span className="ins-related-tag">{item.tag} · {item.date}</span>
                                    <strong>{item.title}</strong>
                                    <span className="ins-related-blurb">{item.blurb}</span>
                                    <span className="ins-related-go">
                                        Read the insight <ArrowRightIcon aria-hidden="true" />
                                    </span>
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            <section className="ins-section ins-section-tight">
                <div className="container">
                    <aside className="ins-disclaimer">
                        <strong>Important information.</strong> {GENERAL_ADVICE} Each insight lists its sources and the
                        date its figures were checked. Arcadea markets new property in Queensland and may benefit. {LICENCE}
                    </aside>
                </div>
            </section>
        </InsightPage>
    );
};

export default InsightsIndexPage;
