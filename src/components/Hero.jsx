import React from 'react';
import { useTranslation } from 'react-i18next';
import './Hero.css';

const Hero = () => {
    const { t } = useTranslation();

    return (
        <section id="hero" className="hero">
            <video
                className="hero-video-bg"
                autoPlay
                loop
                muted
                playsInline
                poster="/fallback.png"
                src="https://cms.arcadea.com.au/wp-content/uploads/2026/07/Timeline-1.mp4"
            />
            <div className="hero-overlay"></div>
            <div className="container hero-container">
                <div className="hero-content">
                    <h2 className="hero-subtitle">{t('hero.subtitle')}</h2>
                    <h1 className="hero-title">
                        {t('hero.title')}
                    </h1>
                    <p className="hero-description">
                        {t('hero.description')}
                    </p>
                    <div className="hero-cta">
                        <a href="#properties" className="btn btn-primary">{t('hero.cta')}</a>
                        <a href="#about" className="btn btn-secondary">{t('nav.about')}</a>
                    </div>
                </div>
            </div>
            <div className="hero-scroll-indicator">
                <div className="mouse">
                    <div className="wheel"></div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
