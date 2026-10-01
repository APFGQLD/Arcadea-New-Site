import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import CinematicHero from '../components/CinematicHero';
import useScrollReveal from '../hooks/useScrollReveal';
import useInView from '../hooks/useInView';
import { fetchPageAssets, fetchPropertyCollections } from '../services/sanityService';
import usePageTitle from '../hooks/usePageTitle';
import './EditorialPage.css';
import './AboutPage.css';

/** Counts up from 0 to `value` once it scrolls into view. */
const StatCounter = ({ value, prefix = '', suffix = '' }) => {
    const ref = useRef(null);
    const inView = useInView(ref, 0.5);
    const [display, setDisplay] = useState(value);

    useEffect(() => {
        if (!inView) return undefined;
        const duration = 2000;
        const start = performance.now();
        let frame;
        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.floor(eased * value));
            if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [inView, value]);

    return <span ref={ref}>{prefix}{display}{suffix}</span>;
};

const AboutPage = () => {
    usePageTitle('About Us', {
        description: 'Arcadea Property curates exceptional coastal and island real estate, bridging high-yield accessibility and ultra-luxury living across Australia and Bali.'
    });
    const { t } = useTranslation();
    const [assets, setAssets] = useState({});
    const [collectionLogos, setCollectionLogos] = useState({});
    const pageRef = useRef(null);

    useScrollReveal(pageRef);

    useEffect(() => {
        const loadAssets = async () => {
            const [fetched, collections] = await Promise.all([
                fetchPageAssets(['about-1', 'about-2', 'about-3', 'about-hero']),
                fetchPropertyCollections()
            ]);
            const assetMap = {};
            fetched.forEach(a => { assetMap[a.identifier] = a.url; });
            setAssets(assetMap);
            const logoMap = {};
            collections.forEach(c => { if (c.logoLight) logoMap[c.id] = c.logoLight; });
            setCollectionLogos(logoMap);
        };
        loadAssets();
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, []);

    const collections = [
        {
            id: 'coastal',
            title: t('about_page.collections.coastal.title'),
            tagline: t('about_page.collections.coastal.tagline'),
            description: t('about_page.collections.coastal.description'),
            keywords: t('about_page.collections.coastal.keywords', { returnObjects: true }),
            image: assets['about-2']
        },
        {
            id: 'island',
            title: t('about_page.collections.island.title'),
            tagline: t('about_page.collections.island.tagline'),
            description: t('about_page.collections.island.description'),
            keywords: t('about_page.collections.island.keywords', { returnObjects: true }),
            image: assets['about-1']
        }
    ];

    const values = ['precision', 'trust', 'excellence', 'global'].map(key => ({
        title: t(`about_page.values.${key}.title`),
        description: t(`about_page.values.${key}.description`)
    }));

    const process = ['discovery', 'curation', 'structure', 'acquisition', 'elevation'].map(key => ({
        title: t(`about_page.process.steps.${key}.title`),
        description: t(`about_page.process.steps.${key}.description`)
    }));

    const stats = [
        { value: 10, suffix: '+', label: t('about_page.why.years') },
        { value: 100, suffix: '+', label: t('about_page.why.properties') },
        { value: 100, prefix: '$', suffix: 'M+', label: t('about_page.why.sales') }
    ];

    return (
        <div className="editorial-page about-page" ref={pageRef}>
            <CinematicHero
                image={assets['about-hero']}
                imageAlt="Arcadea luxury interior"
                tag={t('about_page.hero.eyebrow')}
                title={<>{t('about_page.hero.title')} <em className="about-hero-accent">{t('about_page.hero.title_accent')}</em></>}
                subtitle={t('about_page.hero.subtitle')}
                action={(
                    <Link to="/properties/" className="btn cine-hero-btn">
                        {t('about_page.collections.cta')}
                    </Link>
                )}
            />

            <div className="cine-hero-follow">
                {/* Opening statement */}
                <div className="ed-intro reveal reveal-up">
                    <p>{t('about_page.story.paragraph2')}</p>
                </div>

                {/* Our Story */}
                <section className="ed-section">
                    <div className="ed-wide ed-split">
                        <div className="ed-split-text reveal reveal-up">
                            <span className="ed-eyebrow">{t('about_page.story.title')}</span>
                            <h2 className="ed-title">
                                {t('about_page.story.headline')}{' '}
                                <span className="about-gold-text">{t('about_page.story.headline_accent')}</span>
                            </h2>
                            <p>{t('about_page.story.paragraph1')}</p>
                            <p>{t('about_page.story.paragraph3')}</p>
                        </div>
                        <div className="ed-split-image reveal reveal-up delay-200">
                            {assets['about-3'] && (
                                <img src={assets['about-3']} alt="Luxury architecture" loading="lazy" decoding="async" />
                            )}
                        </div>
                    </div>
                </section>

                {/* The Two Collections */}
                <section className="ed-section">
                    <div className="ed-header reveal reveal-up">
                        <span className="ed-eyebrow">{t('about_page.collections.title')}</span>
                        <h2 className="ed-title">{t('about_page.collections.headline', 'Two collections. One standard.')}</h2>
                        <p className="ed-subtitle">{t('about_page.collections.subtitle')}</p>
                    </div>

                    <div className="ed-wide ed-collections">
                        {collections.map((col, idx) => (
                            <Link
                                key={col.id}
                                to={`/properties/#${col.id}`}
                                className={`ed-card ed-collection-card reveal reveal-up delay-${(idx + 1) * 100}`}
                            >
                                {col.image && <img src={col.image} alt={col.title} className="ed-card-bg" loading="lazy" />}
                                <div className="ed-card-overlay"></div>
                                <div className="ed-card-content ed-collection-content">
                                    {collectionLogos[col.id] ? (
                                        <img src={collectionLogos[col.id]} alt={`${col.title} logo`} className="ed-collection-logo" />
                                    ) : (
                                        <h3 className="ed-collection-title">{col.title}</h3>
                                    )}
                                    <p className="ed-collection-tagline ed-on-photo-gold">{col.tagline}</p>
                                    <div className="ed-collection-reveal">
                                        <p className="ed-collection-desc">{col.description}</p>
                                        {Array.isArray(col.keywords) && (
                                            <ul className="ed-collection-keywords">
                                                {col.keywords.map(keyword => <li key={keyword}>{keyword}</li>)}
                                            </ul>
                                        )}
                                        <span className="ed-text-link">{t('about_page.collections.cta')} &rarr;</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Values */}
                <section className="ed-section">
                    <div className="ed-header reveal reveal-up">
                        <span className="ed-eyebrow">{t('about_page.values.title')}</span>
                        <h2 className="ed-title">{t('about_page.values.subtitle')}</h2>
                    </div>
                    <div className="ed-wide ed-numbered">
                        {values.map((value, idx) => (
                            <div key={value.title} className={`ed-numbered-item reveal reveal-up delay-${(idx + 1) * 100}`}>
                                <span className="ed-numbered-index">0{idx + 1}</span>
                                <h3 className="ed-numbered-title">{value.title}</h3>
                                <p className="ed-numbered-text">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Process */}
                <section className="ed-section">
                    <div className="ed-wide about-process">
                        <div className="about-process-intro reveal reveal-up">
                            <span className="ed-eyebrow">{t('about_page.process.title')}</span>
                            <h2 className="ed-title">{t('about_page.process.subtitle')}</h2>
                        </div>
                        <ol className="about-process-list">
                            {process.map((step, idx) => (
                                <li key={step.title} className="about-process-step reveal reveal-up">
                                    <span className="about-process-number">0{idx + 1}</span>
                                    <div>
                                        <h3 className="about-process-title">{step.title}</h3>
                                        <p className="about-process-text">{step.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                {/* Stats */}
                <section className="ed-section">
                    <div className="ed-header reveal reveal-up">
                        <span className="ed-eyebrow">{t('about_page.why.title')}</span>
                    </div>
                    <div className="ed-wide about-stats">
                        {stats.map(stat => (
                            <div key={stat.label} className="about-stat reveal reveal-up">
                                <div className="about-stat-number">
                                    <StatCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                                </div>
                                <p className="about-stat-label">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Call to action */}
                <section className="ed-section">
                    <div className="ed-wide ed-card ed-cta reveal reveal-up">
                        {assets['about-hero'] && <img src={assets['about-hero']} alt="" className="ed-card-bg" loading="lazy" />}
                        <div className="ed-card-overlay"></div>
                        <div className="ed-card-content">
                            <span className="ed-eyebrow ed-on-photo-gold">{t('about_page.cta.title')}</span>
                            <h2 className="ed-cta-title">{t('about_page.cta.headline', "Let's find your next address.")}</h2>
                            <p className="ed-cta-text">{t('about_page.cta.subtitle')}</p>
                            <div className="ed-cta-actions">
                                <Link to="/#contact" className="btn cine-hero-btn">{t('about_page.cta.button')}</Link>
                                <Link to="/properties/" className="ed-btn-ghost">{t('about_page.cta.secondary')}</Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AboutPage;
