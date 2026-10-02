import React from 'react';
import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';
import { INSIGHTS } from '../data/insights';
import './EditorialPage.css';
import './BlogPage.css';

const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-AU', { year: 'numeric', month: 'long' });

// "September 2026 · Research report"
const metaLine = (insight) => [formatDate(insight.date), insight.category].filter(Boolean).join(' · ');

const InsightsPage = () => {
    // noindex while the reports listed here are still awaiting compliance sign-off
    usePageTitle('Insights', {
        description: 'In-depth research and modelling on property investment from the Arcadea Property team.',
        noindex: true,
    });

    const [featured, ...rest] = INSIGHTS;

    return (
        <div className="editorial-page blog-page">
            <header className="ed-wide blog-header">
                <span className="ed-eyebrow">Insights</span>
                <h1 className="blog-header-title">Research &amp; Reports</h1>
                <p className="blog-header-subtitle">
                    In-depth research and modelling on property investment, tax and market trends.
                </p>
            </header>

            <div className="ed-wide">
                {!featured ? (
                    <div className="blog-status">
                        <h2 className="blog-status-title">Reports coming soon</h2>
                        <p className="blog-status-message">
                            We're preparing in-depth research on property investment. Check back soon.
                        </p>
                    </div>
                ) : (
                    <>
                        <Link to={featured.path} className="ed-card blog-featured">
                            {featured.image && (
                                <img
                                    src={featured.image}
                                    alt={featured.imageAlt || featured.title}
                                    className="ed-card-bg"
                                    loading="eager"
                                    decoding="async"
                                />
                            )}
                            <div className="ed-card-overlay blog-featured-overlay"></div>
                            <div className="ed-card-content blog-featured-content">
                                <span className="blog-featured-badge">Latest Report</span>
                                <span className="blog-featured-meta ed-on-photo-gold">{metaLine(featured)}</span>
                                <h2 className="blog-featured-title">{featured.title}</h2>
                                <p className="blog-featured-excerpt">{featured.summary}</p>
                                <span className="ed-text-link">Read Report &rarr;</span>
                            </div>
                        </Link>

                        {rest.length > 0 && (
                            <div className="blog-grid">
                                {rest.map((insight) => (
                                    <Link key={insight.path} to={insight.path} className="blog-card">
                                        <div className="blog-card-image">
                                            {insight.image && (
                                                <img
                                                    src={insight.image}
                                                    alt={insight.imageAlt || insight.title}
                                                    loading="lazy"
                                                    decoding="async"
                                                    width="800"
                                                    height="600"
                                                />
                                            )}
                                        </div>
                                        <span className="blog-card-meta">{metaLine(insight)}</span>
                                        <h2 className="blog-card-title">{insight.title}</h2>
                                        <p className="blog-card-excerpt">{insight.summary}</p>
                                        <span className="ed-text-link blog-card-link">Read Report &rarr;</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default InsightsPage;
