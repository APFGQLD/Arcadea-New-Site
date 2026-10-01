import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';
import './Services.css';

const Services = () => {
    const { t } = useTranslation();
    const sectionRef = useRef(null);
    useScrollReveal(sectionRef);

    const sections = ['australian', 'financial', 'hotel'];

    return (
        <section ref={sectionRef} id="services" className="ed-section">
            <div className="ed-header reveal reveal-up">
                <span className="ed-eyebrow">{t('services.title')}</span>
                <h2 className="ed-title">{t('services.subtitle')}</h2>
            </div>

            <div className="ed-wide ed-numbered" style={{ '--ed-cols': 3 }}>
                {sections.map((key, index) => (
                    <div key={key} className={`ed-numbered-item reveal reveal-up delay-${(index + 1) * 100}`}>
                        <span className="ed-numbered-index">0{index + 1}</span>
                        <h3 className="ed-numbered-title">{t(`services.pillars.${key}.title`)}</h3>
                        <ul className="home-service-list">
                            {t(`services.pillars.${key}.items`, { returnObjects: true }).map(item => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="home-section-action reveal reveal-up">
                <Link to="/services" className="ed-text-link">{t('services.home_cta', 'Explore Our Services')} &rarr;</Link>
            </div>
        </section>
    );
};

export default Services;
