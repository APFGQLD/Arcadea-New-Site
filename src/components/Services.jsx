import React from 'react';
import { useTranslation } from 'react-i18next';
import useScrollReveal from '../hooks/useScrollReveal';
import './Services.css';

const Services = () => {
    const { t } = useTranslation();
    useScrollReveal();

    const sections = ['hotel', 'financial', 'australian'];

    return (
        <section id="services" className="services section-padding">
            <div className="container">
                <div className="section-header reveal reveal-up">
                    <h2 className="section-title">
                        {t('services.title').split(' ')[0]} <span className="text-gold">{t('services.title').split(' ')[1]}</span>
                    </h2>
                    <p className="section-description">
                        {t('services.subtitle')}
                    </p>
                </div>

                <div className="services-grid">
                    {sections.map((key, index) => (
                        <div key={key} className={`service-card reveal reveal-up delay-${(index % 3 + 1) * 100}`}>
                            <div className="service-card-content">
                                <h3 className="service-card-title">{t(`services.pillars.${key}.title`)}</h3>
                                {key === 'financial' && (
                                    <p className="service-card-subtitle">{t(`services.pillars.${key}.subtitle`)}</p>
                                )}
                                <ul className="service-list">
                                    {t(`services.pillars.${key}.items`, { returnObjects: true }).map((item, index) => (
                                        <li key={index} className="service-item">
                                            <span className="service-icon">
                                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            </span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
