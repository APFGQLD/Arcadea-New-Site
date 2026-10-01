import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import brandLogoWhite from '../assets/brand-logo-white.png';
import brandLogoBlack from '../assets/brand-logo-black.png';
import './Footer.css';

const exploreLinks = [
    { to: '/', key: 'nav.home', label: 'Home' },
    { to: '/properties/', key: 'nav.properties', label: 'Properties' },
    { to: '/properties/#coastal', label: 'Coastal Collection' },
    { to: '/properties/#island', label: 'Island Collection' },
    { to: '/services', key: 'nav.services', label: 'Services' },
    { to: '/about', key: 'nav.about', label: 'About' },
    { to: '/news', key: 'nav.news', label: 'News' }
];

const socialLinks = [
    { href: 'https://www.instagram.com/arcadea.property', label: 'Instagram' },
    { href: 'https://www.facebook.com/profile.php?id=61593654575099', label: 'Facebook' }
];

const Footer = () => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const year = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-inner">
                {/* Columns */}
                <div className="footer-columns">
                    <div className="footer-brand">
                        <p className="footer-tagline">
                            {t('footer.tagline', 'Exquisite Living, Refined Investments')}
                        </p>
                        <p className="footer-about">
                            Curated coastal and island property across Australia and Bali, for investors and those seeking a sanctuary.
                        </p>
                    </div>

                    <nav className="footer-col" aria-label="Footer">
                        <h3 className="footer-heading">{t('footer.explore', 'Explore')}</h3>
                        <ul className="footer-links">
                            {exploreLinks.map(link => (
                                <li key={link.to}>
                                    <Link to={link.to}>{link.key ? t(link.key, link.label) : link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="footer-col">
                        <h3 className="footer-heading">{t('footer.contact', 'Contact')}</h3>
                        <ul className="footer-links">
                            <li><a href="mailto:info@arcadea.com.au">info@arcadea.com.au</a></li>
                            <li><Link to="/#contact">{t('footer.enquiry', 'Make an Enquiry')}</Link></li>
                        </ul>

                        <h3 className="footer-heading footer-heading-follow">{t('footer.follow', 'Follow')}</h3>
                        <ul className="footer-links footer-social">
                            {socialLinks.map(link => (
                                <li key={link.label}>
                                    <a href={link.href} target="_blank" rel="noopener noreferrer">{link.label} &#8599;</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Legal */}
                <div className="footer-bottom">
                    <p className="footer-legal">
                        &copy; {year} Arcadea Property. Licensed Real Estate Agent No. 4857148. {t('footer.rights', 'All rights reserved.')}
                    </p>
                    <div className="footer-legal-links">
                        <Link to="/privacy-policy">Privacy Policy</Link>
                        <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">Sitemap</a>
                    </div>
                </div>
            </div>

            {/* Oversized wordmark sign-off. The logo PNG has a lot of empty
                space around the lettering, so this box crops to it (see CSS). */}
            <div className="footer-wordmark" aria-hidden="true">
                <img src={theme === 'dark' ? brandLogoWhite : brandLogoBlack} alt="" />
            </div>
        </footer>
    );
};

export default Footer;
