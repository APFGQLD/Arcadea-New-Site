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
    const { navHidden, navOverDarkHero } = useNavVisibility();
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

    // The mobile menu covers the whole screen, so stop the page behind it
    // from scrolling and let Escape close it.
    useEffect(() => {
        if (!isMenuOpen) return undefined;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const handleKey = (e) => { if (e.key === 'Escape') setIsMenuOpen(false); };
        window.addEventListener('keydown', handleKey);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKey);
        };
    }, [isMenuOpen]);

    // Highlight the section the visitor is in. Individual listings live under
    // /project/, so they count as Properties.
    const isActive = (path) => {
        const { pathname } = location;
        if (path === '/') return pathname === '/';
        if (path === '/properties') return pathname.startsWith('/properties') || pathname.startsWith('/project');
        return pathname.startsWith(path);
    };
    const navLinkProps = (path) => ({
        className: isActive(path) ? 'active' : undefined,
        'aria-current': isActive(path) ? 'page' : undefined,
        onClick: closeMenu
    });

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    // Logo follows the theme: white in dark theme, black in light theme.
    // (In light theme the hero gets a light overlay, so the black logo stays readable.)
    // Exception: a page with an always-dark hero gets the white logo and nav
    // text in both themes while the Navbar is still transparent over it.
    const forceScrolled = scrolled;
    const overDarkHero = navOverDarkHero && !forceScrolled && !isMenuOpen;
    const showWhiteLogo = theme === 'dark' || overDarkHero;

    return (
        <nav className={`navbar ${forceScrolled ? 'scrolled' : ''} ${isMenuOpen ? 'menu-open' : ''} ${isHomePage ? 'is-home' : ''} ${navHidden && !isMenuOpen ? 'nav-hidden' : ''} ${overDarkHero ? 'over-dark-hero' : ''}`}>
            <div className="nav-container">
                <Link to="/" className="logo" onClick={closeMenu}>
                    {/* The logo PNGs have a lot of empty space around the wordmark,
                        so this box crops to just the lettering (see Navbar.css) */}
                    <span className="nav-logo-crop">
                        <img
                            src={showWhiteLogo ? brandLogoWhite : brandLogoBlack}
                            alt="ARCADEA PROPERTY"
                            className="nav-logo-img"
                        />
                    </span>
                </Link>

                {/* Mobile Hamburger Button */}
                <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu" aria-expanded={isMenuOpen}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </button>

                {/* Desktop and Mobile Menu */}
                <div className={`nav-wrapper ${isMenuOpen ? 'open' : ''}`}>
                    <ul className="nav-links">
                        {/* --i staggers the links' entrance in the full-screen mobile menu */}
                        <li style={{ '--i': 0 }}><Link to="/" {...navLinkProps('/')}>{t('nav.home')}</Link></li>
                        <li style={{ '--i': 1 }}><Link to="/properties/" {...navLinkProps('/properties')}>{t('nav.properties')}</Link></li>
                        <li style={{ '--i': 2 }}><Link to="/services" {...navLinkProps('/services')}>{t('nav.services')}</Link></li>
                        <li style={{ '--i': 3 }}><Link to="/news" {...navLinkProps('/news')}>{t('nav.news')}</Link></li>
                        <li style={{ '--i': 4 }}><Link to="/about" {...navLinkProps('/about')}>{t('nav.about')}</Link></li>
                        <li style={{ '--i': 5 }}><Link to="/#contact" className="btn-nav" onClick={closeMenu}>{t('nav.contact')}</Link></li>
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
