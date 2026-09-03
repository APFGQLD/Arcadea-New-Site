import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useNavVisibility } from '../context/NavVisibilityContext';
import { rafThrottle } from '../utils/rafThrottle';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';

import brandLogoWhite from '../assets/brand-logo-white.png';
import brandLogoBlack from '../assets/brand-logo-black.png';
import './Navbar.css';

const Navbar = () => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const { navHidden } = useNavVisibility();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isHomePage = location.pathname === '/';

    useEffect(() => {
        const handleScroll = rafThrottle(() => {
            setScrolled(window.scrollY > 50);
        });
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            handleScroll.cancel();
        };
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    // Logo follows the theme: white in dark theme, black in light theme.
    // (In light theme the hero gets a light overlay, so the black logo stays readable.)
    const forceScrolled = scrolled;
    const showWhiteLogo = theme === 'dark';

    return (
        <nav className={`navbar ${forceScrolled ? 'scrolled' : ''} ${isMenuOpen ? 'menu-open' : ''} ${isHomePage ? 'is-home' : ''} ${navHidden && !isMenuOpen ? 'nav-hidden' : ''}`}>
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
                        <li><Link to="/news" onClick={closeMenu}>{t('nav.news')}</Link></li>
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
