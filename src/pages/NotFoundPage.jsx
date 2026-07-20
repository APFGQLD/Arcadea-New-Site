import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    HomeIcon,
    MapIcon,
    InformationCircleIcon,
    EnvelopeIcon
} from '@heroicons/react/24/solid';
import usePageTitle from '../hooks/usePageTitle';
import './NotFoundPage.css';

const NotFoundPage = () => {
    usePageTitle('Page Not Found', { noindex: true });
    const { t } = useTranslation();

    const quickLinks = [
        {
            icon: HomeIcon,
            label: 'Home',
            path: '/',
            description: 'Return to homepage'
        },
        {
            icon: MapIcon,
            label: 'Properties',
            path: '/properties',
            description: 'Browse our collection'
        },
        {
            icon: InformationCircleIcon,
            label: 'About',
            path: '/about',
            description: 'Learn about Arcadea'
        },
        {
            icon: EnvelopeIcon,
            label: 'Contact',
            path: '/#contact',
            description: 'Get in touch'
        }
    ];

    return (
        <div className="notfound-page">
            <div className="notfound-container">
                {/* 404 Number */}
                <div className="notfound-number">
                    <span className="notfound-digit">4</span>
                    <span className="notfound-digit notfound-zero">0</span>
                    <span className="notfound-digit">4</span>
                </div>

                {/* Message */}
                <div className="notfound-content">
                    <h1 className="notfound-title">PAGE NOT FOUND</h1>
                    <p className="notfound-subtitle">
                        The page you're looking for seems to have wandered off the map.
                        <br />
                        Let's get you back on track.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="notfound-links">
                    {quickLinks.map((link, index) => (
                        <Link
                            key={index}
                            to={link.path}
                            className="notfound-link"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="notfound-link-icon">
                                <link.icon className="hero-icon" />
                            </div>
                            <div className="notfound-link-text">
                                <span className="notfound-link-label">{link.label}</span>
                                <span className="notfound-link-description">{link.description}</span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Decorative Elements */}
                <div className="notfound-decoration">
                    <div className="notfound-circle notfound-circle-1"></div>
                    <div className="notfound-circle notfound-circle-2"></div>
                    <div className="notfound-circle notfound-circle-3"></div>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
