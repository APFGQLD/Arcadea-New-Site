import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
const bigALogo = 'https://cms.arcadea.com.au/wp-content/uploads/2026/02/big-a.png';
import './Footer.css';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    {/* Logo and Description */}
                    <div className="footer-section footer-brand">
                        <div className="logo footer-logo">
                            <img
                                src={bigALogo}
                                alt="ARCADEA PROPERTY"
                                className="footer-logo-img"
                            />
                        </div>
                        <p className="footer-tagline">
                            {t('footer.tagline', 'Exquisite Living, Refined Investments')}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h4 className="footer-heading">{t('footer.quickLinks', 'Quick Links')}</h4>
                        <ul className="footer-links">
                            <li><Link to="/">{t('nav.home', 'Home')}</Link></li>
                            <li><Link to="/properties">{t('nav.properties', 'Properties')}</Link></li>
                            <li><Link to="/properties#coastal">Coastal Collection</Link></li>
                            <li><Link to="/properties#island">Island Collection</Link></li>
                            <li><Link to="/services">{t('nav.services', 'Services')}</Link></li>
                            <li><Link to="/about">{t('nav.about', 'About')}</Link></li>
                            <li><Link to="/news">{t('footer.news', 'News')}</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="footer-section">
                        <h4 className="footer-heading">{t('footer.contact', 'Contact')}</h4>
                        <ul className="footer-links">
                            <li><Link to="/#contact">{t('nav.contact', 'Get in Touch')}</Link></li>
                            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                            <li><a href="mailto:info@arcadea.com.au">info@arcadea.com.au</a></li>
                            <li><a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">Sitemap</a></li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="footer-bottom">
                    <p className="copyright">
                        &copy; {new Date().getFullYear()} Arcadea Property. Licensed Real Estate Agent No. 4857148. {t('footer.rights', 'All rights reserved.')}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
