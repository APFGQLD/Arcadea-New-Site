import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';

/** Home page opening statement, in the same style as the Properties intro. */
const About = () => {
    const { t } = useTranslation();
    const sectionRef = useRef(null);
    useScrollReveal(sectionRef);

    return (
        <section ref={sectionRef} id="about" className="ed-intro">
            <div className="reveal reveal-up">
                <span className="ed-eyebrow">{t('about.title')}</span>
                <p>{t('about.description')}</p>
                <Link to="/about" className="ed-text-link home-intro-link">{t('about.link', 'Our Story')} &rarr;</Link>
            </div>
        </section>
    );
};

export default About;
