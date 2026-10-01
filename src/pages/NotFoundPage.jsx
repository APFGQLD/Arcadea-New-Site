import React from 'react';
import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';
import './EditorialPage.css';
import './NotFoundPage.css';

const quickLinks = [
    { label: 'Home', path: '/', description: 'Return to the homepage' },
    { label: 'Our Collections', path: '/properties/', description: 'Browse coastal and island properties' },
    { label: 'News & Insights', path: '/news', description: 'Market updates and analysis' },
    { label: 'Get in Touch', path: '/#contact', description: 'Speak with our team' }
];

const NotFoundPage = () => {
    usePageTitle('Page Not Found', { noindex: true });

    return (
        <div className="editorial-page notfound-page">
            <div className="ed-wide notfound-inner">
                {/* Oversized, faint 404 behind the heading */}
                <span className="notfound-code" aria-hidden="true">404</span>

                <span className="ed-eyebrow">Error 404</span>
                <h1 className="notfound-title">This page has moved on.</h1>
                <p className="notfound-text">
                    The page you’re looking for doesn’t exist or may have been moved.
                    Here are a few places to pick up from.
                </p>

                <nav className="notfound-links" aria-label="Helpful links">
                    {quickLinks.map(link => (
                        <Link key={link.path} to={link.path} className="notfound-link">
                            <span className="notfound-link-label">{link.label}</span>
                            <span className="notfound-link-description">{link.description}</span>
                            <span className="notfound-link-arrow" aria-hidden="true">&rarr;</span>
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default NotFoundPage;
