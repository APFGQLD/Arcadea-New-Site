import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { SunIcon } from '@heroicons/react/24/solid';
import { fetchPropertyCollections, fetchProperties, fetchPageAssets } from '../services/sanityService';
import LoadingSpinner from '../components/LoadingSpinner';
import './PropertiesPage.css';
import usePageTitle from '../hooks/usePageTitle';

const PropertiesPage = () => {
    usePageTitle('Our Collections', {
        description: 'Explore the Coastal Collection in Australia and the Island Collection in Bali — curated off-plan residences and investment properties in sought-after locations.'
    });
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { theme } = useTheme();
    const [selectedCollection, setSelectedCollection] = useState(null);
    const [collections, setCollections] = useState([]);
    const [listings, setListings] = useState([]);
    const [assets, setAssets] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scrollY, setScrollY] = useState(0);

    // Fetch data on mount
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [collectionsData, fetchedAssets] = await Promise.all([
                    fetchPropertyCollections(),
                    fetchPageAssets(['oneparklane-v03'])
                ]);
                setCollections(collectionsData);
                const assetMap = {};
                fetchedAssets.forEach(a => { assetMap[a.identifier] = a.url; });
                setAssets(assetMap);
            } catch (err) {
                console.error("Failed to load initial data", err);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);

    // Track scroll for cinematic effect
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Setup intersection observer for scroll animations
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        const animateElements = document.querySelectorAll('.animate-on-scroll');
        animateElements.forEach((el) => observer.observe(el));
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
    }, [collections]);

    // Calculate cinematic transform values
    const scrollProgress = Math.min(scrollY / 600, 1); // 0 to 1 over 600px of scroll
    const heroScale = 1 - (scrollProgress * 0.15); // Scales from 1 to 0.85
    const heroRadius = scrollProgress * 40; // Border radius from 0 to 40px
    const textOpacity = 1 - (scrollProgress * 2); // Fades out faster
    const textTranslate = scrollProgress * -100; // Moves up

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
                // Fetch the properties from the selected collection from Sanity
                const data = await fetchProperties(selectedCollection);
                setListings(data ? data.properties || [] : []);
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

    // Removed static collections object

    return (
        <div className="properties-page">
            {!selectedCollection ? (
                <div className="selection-view-cinematic">
                    
                    {/* Spacer to allow scrolling */}
                    <div className="cinematic-scroll-container">
                        <div className="cinematic-sticky-wrapper">
                            
                            <div 
                                className="cinematic-hero-bg"
                                style={{
                                    transform: `scale(${heroScale})`,
                                    borderRadius: `${heroRadius}px`,
                                }}
                            >
                                {assets['oneparklane-v03'] && (
                                    <img 
                                        src={assets['oneparklane-v03']}
                                        alt="One Park Lane" 
                                        className="cinematic-hero-image"
                                    />
                                )}
                                <div className="cinematic-hero-overlay"></div>
                            </div>
                            
                            <div 
                                className="cinematic-text-wrapper"
                                style={{
                                    opacity: Math.max(0, textOpacity),
                                    transform: `translate(-50%, calc(-50% + ${textTranslate}px))`
                                }}
                            >
                                <div className="cinematic-tag">Exclusive Pre-Launch</div>
                                <h1 className="cinematic-title">One Park Lane</h1>
                                <p className="cinematic-location">Southport, Gold Coast</p>
                                
                                <button 
                                    className="btn cinematic-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate('/project/one-park-lane');
                                    }}
                                >
                                    Explore the Masterpiece
                                </button>
                            </div>
                            
                            {/* Scroll Indicator */}
                            <div className="scroll-indicator" style={{ opacity: Math.max(0, textOpacity) }}>
                                <span>Scroll to Explore</span>
                                <div className="scroll-line"></div>
                            </div>
                        </div>
                    </div>

                    {/* Global Collections - Stacked Cards */}
                    <div className="stacked-collections-section relative-content">
                        
                        <div className="properties-intro-block animate-on-scroll">
                            <p>
                                Arcadea represents a new paradigm in luxury real estate, curating the world's most exceptional coastal and island properties. We deliver uncompromising architectural brilliance and guaranteed returns in pristine, sought-after destinations.
                            </p>
                        </div>

                        <div className="collections-header-editorial animate-on-scroll">
                            <h2 className="editorial-title">{t('properties.explore_title', 'Global Collections')}</h2>
                            <p className="editorial-subtitle">{t('properties.explore_subtitle', 'Curated luxury across the world’s most sought-after destinations.')}</p>
                        </div>
                        
                        <div className="stacked-collections-list">
                            {collections.map((col, index) => (
                                <div 
                                    key={col.id}
                                    className="stacked-collection-card animate-on-scroll"
                                    style={{ transitionDelay: `${index * 0.2}s` }}
                                    onClick={() => handleSelectCollection(col.id)}
                                >
                                    <div className="stacked-collection-image-wrapper">
                                        <img src={col.image} className="stacked-collection-bg" alt={col.title} loading="lazy" />
                                        <div className="stacked-collection-overlay"></div>
                                    </div>
                                    <div className="stacked-collection-content">
                                        {col.logoLight && col.logoDark ? (
                                            <div className="stacked-collection-logo-container">
                                                {/* Cards keep a dark scrim in both themes, so always use the white logo */}
                                                <img
                                                    src={col.logoLight}
                                                    alt={`${col.title} logo`}
                                                    className="stacked-collection-logo"
                                                />
                                            </div>
                                        ) : (
                                            <h3 className="stacked-collection-title">{col.title}</h3>
                                        )}
                                        <p className="stacked-collection-location">{col.location}</p>
                                        <div className="stacked-collection-reveal">
                                            <p className="stacked-collection-desc">{col.description}</p>
                                            <span className="stacked-collection-link">View Listings &rarr;</span>
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
                            {collections.find(c => c.id === selectedCollection)?.logoLight && collections.find(c => c.id === selectedCollection)?.logoDark ? (
                                <div className="listing-logo-container">
                                    <img
                                        src={theme === 'dark' ? collections.find(c => c.id === selectedCollection)?.logoLight : collections.find(c => c.id === selectedCollection)?.logoDark}
                                        alt={collections.find(c => c.id === selectedCollection)?.title}
                                        className="listing-brand-logo"
                                    />
                                </div>
                            ) : (
                                <h1 className="page-title">{collections.find(c => c.id === selectedCollection)?.title}</h1>
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
                                    We're currently updating our {collections.find(c => c.id === selectedCollection)?.title} collection.
                                    <br />
                                    Check back soon for new exclusive listings.
                                </p>
                                <button className="btn btn-primary" onClick={handleBack}>
                                    ← {t('properties.actions.back_to_portfolio', 'Back to Collections')}
                                </button>
                            </div>
                        ) : (
                            <div className="property-grid">
                                {listings.map((property) => {
                                    if (!property) return null;
                                    return (
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
                                                    {property.features?.map((feat, idx) => (
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
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertiesPage;
