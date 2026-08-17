import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
    BuildingLibraryIcon,
    ShieldCheckIcon,
    StarIcon,
    GlobeAltIcon
} from '@heroicons/react/24/solid';
import './AboutPage.css';
import usePageTitle from '../hooks/usePageTitle';
import { fetchPageAssets } from '../services/sanityService';

const AboutPage = () => {
    usePageTitle('About Us', {
        description: 'Arcadea Property curates exceptional coastal and island real estate, bridging high-yield accessibility and ultra-luxury living across Australia and Bali.'
    });
    const { t } = useTranslation();
    const { theme } = useTheme();
    const [assets, setAssets] = useState({});

    useEffect(() => {
        const loadAssets = async () => {
            const fetched = await fetchPageAssets(['about-1', 'about-2', 'about-3', 'about-hero']);
            const assetMap = {};
            fetched.forEach(a => { assetMap[a.identifier] = a.url; });
            setAssets(assetMap);
        };
        loadAssets();
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, []);

    const [visibleSteps, setVisibleSteps] = useState([]);
    const processRefs = useRef([]);
    const statsRef = useRef(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    const collections = [
        {
            id: 'coastal',
            title: t('about_page.collections.coastal.title'),
            tagline: t('about_page.collections.coastal.tagline'),
            description: t('about_page.collections.coastal.description'),
            keywords: ['Unrivaled', 'Sanctuary', 'Panoramas', 'Iconic', 'Prestige'],
            image: assets['about-2'] || '',
            featured: true
        },
        {
            id: 'island',
            title: t('about_page.collections.island.title'),
            tagline: t('about_page.collections.island.tagline'),
            description: t('about_page.collections.island.description'),
            keywords: ['Yield', 'Growth', 'Turnkey', 'Passive', 'Managed'],
            image: assets['about-1'] || ''
        }
    ];

    const values = [
        {
            icon: BuildingLibraryIcon,
            title: t('about_page.values.precision.title'),
            description: t('about_page.values.precision.description')
        },
        {
            icon: ShieldCheckIcon,
            title: t('about_page.values.trust.title'),
            description: t('about_page.values.trust.description')
        },
        {
            icon: StarIcon,
            title: t('about_page.values.excellence.title'),
            description: t('about_page.values.excellence.description')
        },
        {
            icon: GlobeAltIcon,
            title: t('about_page.values.global.title'),
            description: t('about_page.values.global.description')
        }
    ];

    const process = [
        {
            number: '01',
            title: t('about_page.process.steps.discovery.title'),
            description: t('about_page.process.steps.discovery.description')
        },
        {
            number: '02',
            title: t('about_page.process.steps.curation.title'),
            description: t('about_page.process.steps.curation.description')
        },
        {
            number: '03',
            title: t('about_page.process.steps.structure.title'),
            description: t('about_page.process.steps.structure.description')
        },
        {
            number: '04',
            title: t('about_page.process.steps.acquisition.title'),
            description: t('about_page.process.steps.acquisition.description')
        },
        {
            number: '05',
            title: t('about_page.process.steps.elevation.title'),
            description: t('about_page.process.steps.elevation.description')
        }
    ];

    // Scroll animation for process steps
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const index = processRefs.current.indexOf(entry.target);
                    if (entry.isIntersecting) {
                        setVisibleSteps(prev => [...new Set([...prev, index])]);
                    } else {
                        setVisibleSteps(prev => prev.filter(i => i !== index));
                    }
                });
            },
            { threshold: 0.3 }
        );

        processRefs.current.forEach(ref => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    // Count-up animation for stats
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    animateValue('years-stat', 0, 10, 2000);
                    animateValue('properties-stat', 0, 100, 2000);
                    animateValue('sales-stat', 0, 100, 2000);
                }
            },
            { threshold: 0.5 }
        );

        if (statsRef.current) {
            observer.observe(statsRef.current);
        }

        return () => observer.disconnect();
    }, [hasAnimated]);

    const animateValue = (id, start, end, duration) => {
        const element = document.getElementById(id);
        if (!element) return;

        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                element.textContent = end + (id === 'sales-stat' ? 'M+' : id === 'properties-stat' ? '+' : '+');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + (id === 'sales-stat' ? 'M+' : id === 'properties-stat' ? '+' : '+');
            }
        }, 16);
    };

    return (
        <div className="about-page" style={assets['about-hero'] ? { '--hero-bg-image': `url(${assets['about-hero']})` } : {}}>
            {/* Hero Section */}
            <section className="about-hero" data-theme={theme}>
                <div className="about-hero-overlay"></div>
                <div className="about-hero-content">
                    <h1 className="about-hero-title">{t('about_page.hero.title')}</h1>
                    <p className="about-hero-subtitle">
                        {t('about_page.hero.subtitle')}
                    </p>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="about-story section-padding">
                <div className="container">
                    <div className="about-story-grid">
                        <div className="about-story-content">
                            <h2 className="section-title-caps">{t('about_page.story.title')}</h2>
                            <h3 className="about-story-headline">
                                {t('about_page.story.headline')} <span className="text-gold">{t('about_page.story.headline_accent')}</span>
                            </h3>
                            <p className="about-story-text">
                                {t('about_page.story.paragraph1')}
                            </p>
                            <p className="about-story-text">
                                {t('about_page.story.paragraph2')}
                            </p>
                            <p className="about-story-text">
                                {t('about_page.story.paragraph3')}
                            </p>
                        </div>
                        <div className="about-story-image">
                            {assets['about-3'] && (
                                <img
                                    src={assets['about-3']}
                                    alt="Luxury architecture"
                                    width="800"
                                    height="600"
                                    loading="lazy"
                                    decoding="async"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* The Two Collections */}
            <section className="about-collections section-padding" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="container">
                    <h2 className="section-title-caps text-center">{t('about_page.collections.title')}</h2>
                    <p className="section-subtitle text-center">
                        {t('about_page.collections.subtitle')}
                    </p>

                    <div className="collections-grid">
                        {collections.map((collection) => (
                            <Link
                                to={`/properties#${collection.id}`}
                                key={collection.id}
                                className={`collection-card-about ${collection.featured ? 'featured' : ''}`}
                                style={{ display: 'block', textDecoration: 'none' }}
                            >
                                <div className="collection-card-image">
                                    {collection.featured && <span className="collection-card-badge">Signature Collection</span>}
                                    {collection.image && (
                                        <img
                                            src={collection.image}
                                            alt={collection.title}
                                            width="800"
                                            height="600"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    )}
                                    <div className="collection-card-overlay"></div>
                                </div>
                                <div className="collection-card-content">
                                    <h3 className="collection-card-title">{collection.title}</h3>
                                    <p className="collection-card-tagline">{collection.tagline}</p>
                                    <p className="collection-card-description">{collection.description}</p>
                                    <div className="collection-keywords">
                                        {collection.keywords.map((keyword, idx) => (
                                            <span key={idx} className="keyword-tag">{keyword}</span>
                                        ))}
                                    </div>
                                    <span className="btn btn-secondary btn-sm">
                                        {t('about_page.collections.cta')}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="about-values section-padding">
                <div className="container">
                    <h2 className="section-title-caps text-center">{t('about_page.values.title')}</h2>
                    <p className="section-subtitle text-center">
                        {t('about_page.values.subtitle')}
                    </p>

                    <div className="values-grid">
                        {values.map((value, idx) => (
                            <div key={idx} className="value-card">
                                <div className="value-icon">
                                    <value.icon className="hero-icon" />
                                </div>
                                <h3 className="value-title">{value.title}</h3>
                                <p className="value-description">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Process */}
            <section className="about-process section-padding" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="container">
                    <h2 className="section-title-caps text-center">{t('about_page.process.title')}</h2>
                    <p className="section-subtitle text-center">
                        {t('about_page.process.subtitle')}
                    </p>

                    <div className="process-timeline">
                        {process.map((step, idx) => (
                            <div
                                key={idx}
                                ref={el => processRefs.current[idx] = el}
                                className={`process-step ${visibleSteps.includes(idx) ? 'visible' : ''}`}
                            >
                                <div className="process-number">{step.number}</div>
                                <div className="process-content">
                                    <h3 className="process-title">{step.title}</h3>
                                    <p className="process-description">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Arcadea */}
            <section className="about-why section-padding">
                <div className="container">
                    <h2 className="section-title-caps text-center">{t('about_page.why.title')}</h2>
                    <div className="why-grid" ref={statsRef}>
                        <div className="why-item">
                            <h3 className="why-number" id="years-stat">10+</h3>
                            <p className="why-label">{t('about_page.why.years')}</p>
                        </div>
                        <div className="why-item">
                            <h3 className="why-number"><span id="properties-stat">100+</span></h3>
                            <p className="why-label">{t('about_page.why.properties')}</p>
                        </div>
                        <div className="why-item">
                            <h3 className="why-number">$<span id="sales-stat">100M+</span></h3>
                            <p className="why-label">{t('about_page.why.sales')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="about-cta section-padding" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="container text-center">
                    <h2 className="section-title-caps">{t('about_page.cta.title')}</h2>
                    <p className="section-subtitle">
                        {t('about_page.cta.subtitle')}
                    </p>
                    <Link to="/#contact" className="btn btn-primary btn-large">
                        {t('about_page.cta.button')}
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
