import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';

const About = () => {
    const { t } = useTranslation();
    const sectionRef = useRef(null);
    useScrollReveal(sectionRef);

    return (
        <section ref={sectionRef} id="about" className="section-padding" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="container">
                <div className="section-header reveal reveal-up" style={{ marginBottom: 0 }}>
                    <h2 className="section-title">
                        {t('about.title').split(' ')[0]} <span className="text-gold">{t('about.title').split(' ')[1]}</span>
                    </h2>
                    <p className="section-description" style={{ marginBottom: '3rem' }}>
                        {t('about.description')}
                    </p>
                    <Link to="/about" className="btn btn-secondary">{t('nav.about')}</Link>
                </div>
            </div>
        </section>
    );
};

export default About;
