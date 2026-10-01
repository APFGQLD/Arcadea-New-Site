import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SunIcon } from '@heroicons/react/24/solid';
import { FaBed, FaBath, FaCar } from 'react-icons/fa6';
import { fetchPropertyCollections, fetchProperties, fetchPageAssets } from '../services/sanityService';
import { formatListingPrice } from '../utils/priceFormat';
import LoadingSpinner from '../components/LoadingSpinner';
import CinematicHero from '../components/CinematicHero';
import './PropertiesPage.css';
import usePageTitle from '../hooks/usePageTitle';

const PropertiesPage = () => {
    usePageTitle('Our Collections', {
        description: 'Explore the Coastal Collection in Australia and the Island Collection in Bali — curated off-plan residences and investment properties in sought-after locations.'
    });
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedCollection, setSelectedCollection] = useState(null);
    const [collections, setCollections] = useState([]);
    const [listings, setListings] = useState([]);
    const [assets, setAssets] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOption, setSortOption] = useState('featured');

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

    // Setup intersection observer for scroll animations
    useEffect(() => {
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

        return () => observer.disconnect();
    }, [collections, selectedCollection]);

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

    // Auto-select collection from URL hash (works for any collection loaded from Sanity)
    useEffect(() => {
        const hash = location.hash.replace('#', '');
        if (hash && collections.some((c) => c.id === hash)) {
            setSelectedCollection(hash);
        }
    }, [location.hash, collections]);

    // Scroll to top and reset sorting when collection changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setSortOption('featured');
    }, [selectedCollection]);

    const getPriceValue = (property) => {
        if (!property.price || property.price.enquiryOnly || property.price.amount == null) return null;
        return property.price.amount;
    };

    const sortedListings = useMemo(() => {
        const sorted = [...listings];
        const compareWithNullsLast = (a, b, getValue, ascending) => {
            const valA = getValue(a);
            const valB = getValue(b);
            if (valA == null && valB == null) return 0;
            if (valA == null) return 1;
            if (valB == null) return -1;
            return ascending ? valA - valB : valB - valA;
        };

        switch (sortOption) {
            case 'price_asc':
                sorted.sort((a, b) => compareWithNullsLast(a, b, getPriceValue, true));
                break;
            case 'price_desc':
                sorted.sort((a, b) => compareWithNullsLast(a, b, getPriceValue, false));
                break;
            case 'beds_desc':
                sorted.sort((a, b) => compareWithNullsLast(a, b, (p) => p.bedrooms, false));
                break;
            case 'name_asc':
                sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
                break;
            default:
                break;
        }
        return sorted;
    }, [listings, sortOption]);

    const activeCollection = collections.find(c => c.id === selectedCollection);

    const handleSelectCollection = (collectionId) => {
        setSelectedCollection(collectionId);
        navigate(`/properties/#${collectionId}`);
    };

    const handleBack = () => {
        setSelectedCollection(null);
        navigate('/properties/');
    };

    // Removed static collections object

    return (
        <div className="properties-page">
            {!selectedCollection ? (
                <div className="selection-view-cinematic">
                    
                    <CinematicHero
                        variant="feature"
                        image={assets['oneparklane-v03']}
                        imageAlt="One Park Lane"
                        tag="Exclusive Pre-Launch"
                        title="One Park Lane"
                        subtitle="Southport, Gold Coast"
                        action={(
                            <button
                                className="btn cine-hero-btn"
                                onClick={() => navigate('/project/one-park-lane')}
                            >
                                Explore the Masterpiece
                            </button>
                        )}
                    />

                    {/* Global Collections - Stacked Cards */}
                    <div className="stacked-collections-section cine-hero-follow">
                        
                        <div className="properties-intro-block animate-on-scroll">
                            <p>
                                Arcadea represents a new paradigm in luxury real estate, curating the world's most exceptional coastal and island properties. We deliver uncompromising architectural brilliance in pristine, sought-after destinations.
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
                    {/* Collection banner: the same photo card the visitor clicked, now full width */}
                    <div className="ed-wide listing-hero-wrap">
                        <button className="ed-text-link listing-back" onClick={handleBack}>
                            &larr; {t('properties.actions.back_to_portfolio', 'Back to Portfolio')}
                        </button>
                        <div className="ed-card listing-hero slide-down">
                            {activeCollection?.image && (
                                <img src={activeCollection.image} alt="" className="ed-card-bg" />
                            )}
                            <div className="ed-card-overlay"></div>

                            {/* Animated waves lapping along the bottom edge of the banner */}
                            <div className="listing-hero-waves" aria-hidden="true">
                                <svg className="waves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                                    viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
                                    <defs>
                                        <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                                    </defs>
                                    <g className="parallax">
                                        <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(var(--wave-color-rgb), 0.55)" />
                                        <use xlinkHref="#gentle-wave" x="48" y="2" fill="rgba(var(--wave-secondary-rgb), 0.5)" />
                                        <use xlinkHref="#gentle-wave" x="48" y="4" fill="rgba(var(--wave-tertiary-rgb), 0.45)" />
                                        <use xlinkHref="#gentle-wave" x="48" y="6" fill="rgba(var(--wave-color-rgb), 0.35)" />
                                        <use xlinkHref="#gentle-wave" x="48" y="8" fill="rgba(var(--wave-secondary-rgb), 0.3)" />
                                    </g>
                                </svg>
                            </div>

                            <div className="ed-card-content listing-hero-content">
                                <h1 className="listing-hero-heading">
                                    {/* Banner keeps a dark scrim in both themes, so always use the white logo */}
                                    {activeCollection?.logoLight ? (
                                        <img src={activeCollection.logoLight} alt={activeCollection.title} className="listing-hero-logo" />
                                    ) : (
                                        activeCollection?.title
                                    )}
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className="ed-wide animate-in">
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
                                    We're currently updating our {activeCollection?.title} collection.
                                    <br />
                                    Check back soon for new exclusive listings.
                                </p>
                                <button className="ed-text-link" onClick={handleBack}>
                                    &larr; {t('properties.actions.back_to_portfolio', 'Back to Collections')}
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="listing-toolbar">
                                    <span className="ed-eyebrow listing-count">
                                        {listings.length} {listings.length === 1
                                            ? t('properties.count_singular', 'Property')
                                            : t('properties.count_plural', 'Properties')}
                                    </span>
                                    <div className="listing-sort">
                                        <label htmlFor="property-sort">{t('properties.sort.label', 'Sort by')}</label>
                                        <select
                                            id="property-sort"
                                            value={sortOption}
                                            onChange={(e) => setSortOption(e.target.value)}
                                        >
                                            <option value="featured">{t('properties.sort.featured', 'Featured')}</option>
                                            <option value="price_asc">{t('properties.sort.price_asc', 'Price: Low to High')}</option>
                                            <option value="price_desc">{t('properties.sort.price_desc', 'Price: High to Low')}</option>
                                            <option value="beds_desc">{t('properties.sort.beds_desc', 'Bedrooms: Most to Least')}</option>
                                            <option value="name_asc">{t('properties.sort.name_asc', 'Name: A-Z')}</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="listing-grid">
                                    {sortedListings.map((property) => {
                                        if (!property) return null;
                                        return (
                                            // A real <a href> (not an onClick navigate) so search
                                            // engines can discover each listing by crawling this page.
                                            <Link
                                                key={property.id}
                                                to={`/project/${property.slug || property.id}`}
                                                className="listing-card"
                                            >
                                                <div className="listing-card-image">
                                                    <img
                                                        src={property.image}
                                                        alt={`${property.title} - ${property.location}`}
                                                        loading="lazy"
                                                        decoding="async"
                                                        width="600"
                                                        height="450"
                                                    />
                                                    {property.tag && <span className="listing-card-tag">{property.tag}</span>}
                                                </div>
                                                <div className="listing-card-body">
                                                    <span className="listing-card-location">{property.location}</span>
                                                    <h3 className="listing-card-title">{property.title}</h3>
                                                    <p className="listing-card-price">{formatListingPrice(property.price)}</p>
                                                    {(property.bedrooms != null || property.bathrooms != null || property.carSpaces != null) && (
                                                        <div className="listing-card-stats">
                                                            {property.bedrooms != null && (
                                                                <span><FaBed /> {property.bedrooms}</span>
                                                            )}
                                                            {property.bathrooms != null && (
                                                                <span><FaBath /> {property.bathrooms}</span>
                                                            )}
                                                            {property.carSpaces != null && (
                                                                <span><FaCar /> {property.carSpaces}</span>
                                                            )}
                                                        </div>
                                                    )}
                                                    {property.features?.length > 0 && (
                                                        <ul className="listing-card-features">
                                                            {property.features.map((feat, idx) => (
                                                                <li key={idx}>{feat}</li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                    <span className="ed-text-link listing-card-link">
                                                        {t('properties.exploreDetails', 'Explore Details')} &rarr;
                                                    </span>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertiesPage;
