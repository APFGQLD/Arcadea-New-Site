import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { SunIcon } from '@heroicons/react/24/solid';
import { propertyCollections } from '../data/properties';
import { fetchProjectsByCollection } from '../services/airtableService';
import LoadingSpinner from '../components/LoadingSpinner';
import './PropertiesPage.css';

const PropertiesPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { theme } = useTheme();
    const [selectedCollection, setSelectedCollection] = useState(null);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch listings when collection changes
    useEffect(() => {
        if (!selectedCollection) {
            setListings([]);
            return;
        }

        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                const collectionName = selectedCollection === 'island' ? 'Island' : 'Coastal';
                const data = await fetchProjectsByCollection(collectionName);
                setListings(data);
            } catch (err) {
                console.error('Data loading error:', err);
                setError(t('properties.error_loading', 'Failed to load properties. Please check your configuration.'));
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [selectedCollection]);

    // Auto-select collection from URL hash
    useEffect(() => {
        const hash = location.hash.replace('#', '');
        if (hash && (hash === 'island' || hash === 'coastal')) {
            setSelectedCollection(hash);
        }
    }, [location.hash]);

    // Scroll to top when collection changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [selectedCollection]);

    const handleSelectCollection = (collectionId) => {
        setSelectedCollection(collectionId);
    };

    const handleBack = () => {
        setSelectedCollection(null);
    };

    const collections = Object.values(propertyCollections);

    return (
        <div className="properties-page">
            {!selectedCollection ? (
                <div className="container">
                    <div className="selection-view animate-in">
                        <h1 className="page-title">{t('properties.explore_title', 'Explore Our Collections')}</h1>
                        <p className="page-subtitle">{t('properties.explore_subtitle', 'Select a destination to view our exclusive listings.')}</p>

                        <div className="collections-grid">
                            {collections.map((col) => (
                                <div
                                    key={col.id}
                                    className="collection-card"
                                    onClick={() => handleSelectCollection(col.id)}
                                >
                                    <div className="collection-image">
                                        <img
                                            src={col.image}
                                            alt={`${col.title} - Premium property collection`}
                                            loading="lazy"
                                            decoding="async"
                                            width="800"
                                            height="600"
                                        />
                                        <div className="collection-overlay"></div>
                                    </div>
                                    <div className="collection-info">
                                        {col.logoLight && col.logoDark ? (
                                            <div className="collection-logo-container">
                                                <img
                                                    src={theme === 'dark' ? col.logoLight : col.logoDark}
                                                    alt={`${col.title} logo`}
                                                    className="collection-brand-logo"
                                                    width="200"
                                                    height="100"
                                                />
                                            </div>
                                        ) : (
                                            <h2 className="collection-title">{col.title}</h2>
                                        )}
                                        <span className="collection-location">{col.location}</span>
                                        <p className="collection-desc">{col.description}</p>
                                        <div className="collection-cta">
                                            <button className="btn btn-secondary btn-sm">{t('properties.actions.view_details', 'View Listings')}</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            ) : (
                <div className="listing-view">
                    <div className="listing-header wave-header slide-down">
                        <div className="container header-content">
                            {propertyCollections[selectedCollection].logoLight && propertyCollections[selectedCollection].logoDark ? (
                                <div className="listing-logo-container">
                                    <img
                                        src={theme === 'dark' ? propertyCollections[selectedCollection].logoLight : propertyCollections[selectedCollection].logoDark}
                                        alt={propertyCollections[selectedCollection].title}
                                        className="listing-brand-logo"
                                    />
                                </div>
                            ) : (
                                <h1 className="page-title">{propertyCollections[selectedCollection].title}</h1>
                            )}
                        </div>

                        {/* Wave Divider */}
                        <div className="wave-container">
                            <svg className="waves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                                viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
                                <defs>
                                    <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                                </defs>
                                <g className="parallax">
                                    <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(var(--wave-color-rgb), 0.25)" />
                                    <use xlinkHref="#gentle-wave" x="48" y="2" fill="rgba(var(--wave-secondary-rgb), 0.2)" />
                                    <use xlinkHref="#gentle-wave" x="48" y="4" fill="rgba(var(--wave-tertiary-rgb), 0.15)" />
                                    <use xlinkHref="#gentle-wave" x="48" y="6" fill="rgba(var(--wave-color-rgb), 0.1)" />
                                    <use xlinkHref="#gentle-wave" x="48" y="8" fill="rgba(var(--wave-secondary-rgb), 0.05)" />
                                </g>
                            </svg>
                        </div>
                    </div>

                    <div className="container">
                        <button className="back-link" onClick={handleBack}>
                            ← {t('properties.actions.back_to_portfolio', 'Back to Portfolio')}
                        </button>
                    </div>

                    <div className="container animate-in" style={{ marginTop: '0' }}>
                        {loading ? (
                            <LoadingSpinner message={t('properties.loading', 'Loading properties...')} />
                        ) : error ? (
                            <div className="error-container">
                                <p>{t('properties.error', 'Unable to load properties. Please try again later.')}</p>
                                <button className="btn btn-secondary" onClick={() => setSelectedCollection(null)}>
                                    {t('properties.actions.back_to_portfolio', 'Go Back')}
                                </button>
                            </div>
                        ) : listings.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">
                                    <SunIcon className="hero-icon" />
                                </div>
                                <h2 className="empty-state-title">No Properties Available</h2>
                                <p className="empty-state-message">
                                    We're currently updating our {propertyCollections[selectedCollection].title} collection.
                                    <br />
                                    Check back soon for new exclusive listings.
                                </p>
                                <button className="btn btn-primary" onClick={handleBack}>
                                    ← {t('properties.actions.back_to_portfolio', 'Back to Collections')}
                                </button>
                            </div>
                        ) : (
                            <div className="property-grid">
                                {listings.map((property) => (
                                    <div
                                        key={property.id}
                                        className="property-card"
                                        onClick={() => navigate(`/project/${property.slug || property.id}`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="property-image">
                                            <img
                                                src={property.image}
                                                alt={`${property.title} - ${property.location}`}
                                                loading="lazy"
                                                decoding="async"
                                                width="600"
                                                height="400"
                                            />
                                            {property.tag && <span className="property-tag">{property.tag}</span>}
                                        </div>
                                        <div className="property-info">
                                            <div className="property-location">{property.location}</div>
                                            <h3 className="property-title">{property.title}</h3>
                                            <p className="property-price">{property.price}</p>
                                            <ul className="property-features">
                                                {property.features.map((feat, idx) => (
                                                    <li key={idx}>{feat}</li>
                                                ))}
                                            </ul>
                                            <button
                                                className="property-link"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/project/${property.slug || property.id}`);
                                                }}
                                            >
                                                {t('properties.exploreDetails', 'Explore Details')}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertiesPage;
