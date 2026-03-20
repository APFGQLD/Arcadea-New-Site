import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';

const brandLogoWhite = 'https://cms.arcadea.com.au/wp-content/uploads/2026/02/brand-logo-white.png';
const brandLogoBlack = 'https://cms.arcadea.com.au/wp-content/uploads/2026/02/brand-logo-black.png';
import './Navbar.css';

const Navbar = () => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isHomePage = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    // Logic to determine which logo/color to show
    // 1. If we are on Home and NOT scrolled, we are over the dark Hero -> white logo/text
    // 2. If we are on ANY OTHER page, or we ARE scrolled, or theme is dark -> check theme
    const forceScrolled = !isHomePage || scrolled;
    const showWhiteLogo = (!forceScrolled && !isMenuOpen) || theme === 'dark';

    return (
        <nav className={`navbar ${forceScrolled ? 'scrolled' : ''} ${isMenuOpen ? 'menu-open' : ''}`}>
            <div className="container nav-container">
                <Link to="/" className="logo" onClick={closeMenu}>
                    <img
                        src={showWhiteLogo ? brandLogoWhite : brandLogoBlack}
                        alt="ARCADEA PROPERTY"
                        className="nav-logo-img"
                    />
                </Link>

                {/* Mobile Hamburger Button */}
                <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </button>

                {/* Desktop and Mobile Menu */}
                <div className={`nav-wrapper ${isMenuOpen ? 'open' : ''}`}>
                    <ul className="nav-links">
                        <li><Link to="/" onClick={closeMenu}>{t('nav.home')}</Link></li>
                        <li><Link to="/properties" onClick={closeMenu}>{t('nav.properties')}</Link></li>
                        <li><Link to="/services" onClick={closeMenu}>{t('nav.services')}</Link></li>
                        <li><Link to="/calculator" onClick={closeMenu}>{t('nav.calculators', 'Calculators')}</Link></li>
                        <li><Link to="/about" onClick={closeMenu}>{t('nav.about')}</Link></li>
                        <li><Link to="/#contact" className="btn-nav" onClick={closeMenu}>{t('nav.contact')}</Link></li>
                    </ul>
                    <div className="nav-controls">
                        <LanguageSelector />
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
