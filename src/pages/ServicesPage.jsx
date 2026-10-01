import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import CinematicHero from '../components/CinematicHero';
import useScrollReveal from '../hooks/useScrollReveal';
import { fetchPageAssets } from '../services/sanityService';
import usePageTitle from '../hooks/usePageTitle';
import './EditorialPage.css';
import './ServicesPage.css';

const ServicesPage = () => {
    usePageTitle('Our Services', {
        description: 'End-to-end property and financial solutions: Australian property, hotel and resort investments, and financial service partnerships through trusted advisors.'
    });
    const { t } = useTranslation();
    const [assets, setAssets] = useState({});
    const pageRef = useRef(null);

    useScrollReveal(pageRef);

    useEffect(() => {
        const loadAssets = async () => {
            const fetched = await fetchPageAssets(['services-hero', 'services-secondary', 'services-3', 'services-hero-bg']);
            const assetMap = {};
            fetched.forEach(a => { assetMap[a.identifier] = a.url; });
            setAssets(assetMap);
        };
        loadAssets();
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, []);

    const services = [
        {
            id: 'australian',
            title: t('services.pillars.australian.title'),
            subtitle: 'Premium Coastal Living',
            description: 'Curated selection of high-quality Australian properties with transparent sales processes and exclusive access.',
            benefits: t('services.pillars.australian.items', { returnObjects: true }),
            image: assets['services-hero'],
            link: { to: '/properties/#coastal', label: 'View the Coastal Collection' }
        },
        {
            id: 'financial',
            title: t('services.pillars.financial.title'),
            subtitle: t('services.pillars.financial.subtitle'),
            description: 'Comprehensive financial solutions through our trusted network of partners and advisors.',
            benefits: t('services.pillars.financial.items', { returnObjects: true }),
            image: assets['services-3'],
            link: { to: '/#contact', label: 'Speak with an Advisor' }
        },
        {
            id: 'hotel',
            title: t('services.pillars.hotel.title'),
            subtitle: 'High-Yield International Investments',
            description: 'Access premium hotel and resort investment opportunities with globally respected brands.',
            benefits: t('services.pillars.hotel.items', { returnObjects: true }),
            image: assets['services-secondary'],
            link: { to: '/properties/#island', label: 'View the Island Collection' }
        }
    ];

    const whyChoose = [
        {
            title: 'Trusted Expertise',
            description: 'Over a decade of experience in international and domestic property markets.'
        },
        {
            title: 'Personalised Service',
            description: 'Dedicated advisors who understand your unique investment goals and lifestyle needs.'
        },
        {
            title: 'Strategic Insights',
            description: 'Data-driven market analysis and curated opportunities for optimal returns.'
        }
    ];

    return (
        <div className="editorial-page services-page" ref={pageRef}>
            <CinematicHero
                image={assets['services-hero-bg']}
                imageAlt="Arcadea services"
                tag="Arcadea Services"
                title={t('services.title', 'Our Expertise')}
                subtitle={t('services.subtitle', 'Comprehensive Property & Financial Solutions')}
                action={(
                    <a href="#services-pillars" className="btn cine-hero-btn">
                        Explore Our Services
                    </a>
                )}
            />

            <div className="cine-hero-follow">
                {/* Opening statement */}
                <div className="ed-intro reveal reveal-up">
                    <p>
                        From high-yield international investments to ultra-luxury Australian residences,
                        we provide end-to-end solutions tailored to your wealth creation journey.
                    </p>
                </div>

                {/* Service pillars: photo cards that stack as you scroll */}
                <section className="ed-section" id="services-pillars">
                    <div className="ed-header reveal reveal-up">
                        <span className="ed-eyebrow">What We Do</span>
                        <h2 className="ed-title">Three pillars, one seamless journey.</h2>
                        <p className="ed-subtitle">
                            Property, investment and finance, brought together under one trusted team.
                        </p>
                    </div>

                    <div className="ed-wide services-stack">
                        {services.map((service, idx) => (
                            <article
                                key={service.id}
                                className="ed-card services-card"
                                style={{ '--stack-index': idx }}
                            >
                                {service.image && (
                                    <img src={service.image} alt={service.title} className="ed-card-bg" loading="lazy" decoding="async" />
                                )}
                                <div className="ed-card-overlay services-card-overlay"></div>
                                <div className="ed-card-content services-card-content">
                                    <div className="services-card-main">
                                        <span className="services-card-index ed-on-photo-gold">
                                            0{idx + 1} / 0{services.length}
                                        </span>
                                        <h3 className="services-card-title">{service.title}</h3>
                                        <p className="services-card-subtitle ed-on-photo-gold">{service.subtitle}</p>
                                        <p className="services-card-desc">{service.description}</p>
                                        <Link to={service.link.to} className="ed-text-link">
                                            {service.link.label} &rarr;
                                        </Link>
                                    </div>
                                    {Array.isArray(service.benefits) && (
                                        <ul className="services-card-benefits">
                                            {service.benefits.map(benefit => (
                                                <li key={benefit}>{benefit}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                {/* IPDC feature */}
                <section className="ed-section">
                    <div className="ed-wide ed-panel services-ipdc reveal reveal-up">
                        <div className="services-ipdc-text">
                            <span className="ed-eyebrow">Investment Insight</span>
                            <h2 className="ed-title">Interest Paid During Construction</h2>
                            <p>
                                Off-plan deposits usually sit idle in a trust account for the length of the build.
                                We prioritise developers who offer IPDC, which pays a fixed return on your capital
                                while the property is being built.
                            </p>
                            <Link to="/services/ipdc" className="ed-text-link">
                                Discover how IPDC works &rarr;
                            </Link>
                        </div>
                        <div className="services-ipdc-compare">
                            <div className="services-ipdc-col">
                                <span className="services-ipdc-label">The Traditional Way</span>
                                <p className="services-ipdc-value services-ipdc-muted">Dead Money</p>
                                <p className="services-ipdc-note">Capital locked away with no income during the build.</p>
                            </div>
                            <div className="services-ipdc-col">
                                <span className="services-ipdc-label">The Arcadea Way</span>
                                <p className="services-ipdc-value">Active Returns</p>
                                <p className="services-ipdc-note">Your capital starts working from day one.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Arcadea */}
                <section className="ed-section">
                    <div className="ed-header reveal reveal-up">
                        <span className="ed-eyebrow">Why Choose Arcadea</span>
                        <h2 className="ed-title">Global reach. Local expertise.</h2>
                        <p className="ed-subtitle">
                            We combine global reach with local expertise to deliver exceptional results.
                        </p>
                    </div>
                    <div className="ed-wide ed-numbered" style={{ '--ed-cols': 3 }}>
                        {whyChoose.map((item, idx) => (
                            <div key={item.title} className={`ed-numbered-item reveal reveal-up delay-${(idx + 1) * 100}`}>
                                <span className="ed-numbered-index">0{idx + 1}</span>
                                <h3 className="ed-numbered-title">{item.title}</h3>
                                <p className="ed-numbered-text">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Call to action */}
                <section className="ed-section">
                    <div className="ed-wide ed-card ed-cta reveal reveal-up">
                        {assets['services-hero-bg'] && <img src={assets['services-hero-bg']} alt="" className="ed-card-bg" loading="lazy" />}
                        <div className="ed-card-overlay"></div>
                        <div className="ed-card-content">
                            <span className="ed-eyebrow ed-on-photo-gold">Ready to Begin?</span>
                            <h2 className="ed-cta-title">Let's talk about your goals.</h2>
                            <p className="ed-cta-text">
                                Let's discuss how our services can help you achieve your investment goals.
                            </p>
                            <div className="ed-cta-actions">
                                <Link to="/#contact" className="btn cine-hero-btn">Schedule a Consultation</Link>
                                <Link to="/properties/" className="ed-btn-ghost">View Properties</Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ServicesPage;
