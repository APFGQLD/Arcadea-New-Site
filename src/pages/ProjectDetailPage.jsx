import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { fetchProjectDetail } from '../services/airtableService';
import {
    MoonIcon,
    SparklesIcon,
    ArrowsPointingOutIcon,
    PresentationChartLineIcon,
    ArrowDownTrayIcon,
    ArrowRightIcon,
    PlusIcon,
    MinusIcon
} from '@heroicons/react/24/solid';
import LoadingSpinner from '../components/LoadingSpinner';
import ComparisonTable from '../components/ComparisonTable';
import './ProjectDetailPage.css';

const ProjectDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { theme } = useTheme();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const carouselRef = useRef(null);

    useEffect(() => {
        const loadProject = async () => {
            setLoading(true);
            try {
                const data = await fetchProjectDetail(id);
                setProject(data);
            } catch (err) {
                console.error('Error fetching project detail:', err);
                setError(t('project_detail.error', 'Failed to load project details.'));
            } finally {
                setLoading(false);
            }
        };

        if (id) loadProject();
        window.scrollTo(0, 0);
    }, [id, t]);

    // Handle Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (selectedImageIndex === null) return;
            if (e.key === 'ArrowRight') handleNextImage();
            if (e.key === 'ArrowLeft') handlePrevImage();
            if (e.key === 'Escape') setSelectedImageIndex(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImageIndex]);

    const handleNextImage = () => {
        setSelectedImageIndex((prev) => (prev + 1) % project.gallery.length);
    };

    const handlePrevImage = () => {
        setSelectedImageIndex((prev) => (prev - 1 + project.gallery.length) % project.gallery.length);
    };

    const scrollCarousel = (direction) => {
        if (!carouselRef.current) return;
        const scrollAmount = carouselRef.current.clientWidth * 0.8;
        carouselRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    const [expandedUnitId, setExpandedUnitId] = useState(null);

    const toggleUnit = (id) => {
        setExpandedUnitId(prev => prev === id ? null : id);
    };

    const formatPrice = (price) => {
        if (!price) return 'TBC';
        // Check if price is a number string or number
        const numPrice = Number(price);
        if (!isNaN(numPrice)) {
            return `A$ ${numPrice.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
        }
        return price; // Return as is if fully formatted string already (fallback)
    };

    const formatCompactPrice = (price) => {
        if (!price) return 'TBC';
        const numPrice = Number(price);
        if (!isNaN(numPrice)) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD', // Using USD symbol $ but represents AUD context
                notation: "compact",
                maximumFractionDigits: 1
            }).format(numPrice).replace('US', ''); // Remove US code if present, ensuring generic $
        }
        return price;
    };

    // Format project name from slug for loading screen
    const formatSlugToName = (slug) => {
        if (!slug) return '';
        return slug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    if (loading) {
        const projectName = formatSlugToName(id);
        return (
            <div className="project-detail-loading">
                <div className="loading-content">
                    <LoadingSpinner message="" />
                    <h2 className="loading-title">
                        {projectName ? `Loading ${projectName}` : t('common.loading', 'Loading Project Details...')}
                    </h2>
                    <p className="loading-subtitle">Please wait while we prepare your experience</p>
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="project-detail-error">
                <p>{error || t('project_detail.not_found', 'Project not found.')}</p>
                <button className="btn btn-secondary" onClick={() => navigate('/properties')}>
                    {t('common.back', 'Back to Portfolio')}
                </button>
            </div>
        );
    }

    const formatAirtableText = (text) => {
        if (!text) return null;
        // Simple split/map to handle **bold** markers without dangerouslySetInnerHTML
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <div className="project-detail-page">
            {/* 1. Cinematic Hero Section */}
            <section className="detail-hero">
                <div className="hero-background">
                    <img
                        src={project.heroImage}
                        alt={project.name}
                        width="1920"
                        height="1080"
                        loading="eager"
                        decoding="async"
                    />
                    <div className="hero-overlay"></div>
                </div>
                <div className="hero-content container">
                    <button className="back-link-floating" onClick={() => navigate('/properties')}>
                        ← {t('common.back', 'Back to Portfolio')}
                    </button>
                    <div className="hero-welcome-area centered">
                        {project.statusTag && (
                            <div className="project-status-pill">
                                {project.statusTag}
                            </div>
                        )}
                        <h1 className="project-title-hero">
                            <span className="welcome-text">{t('project_detail.welcome', 'Welcome to')}</span>{" "}
                            <span className="project-name-accent">{project.name}</span>
                        </h1>
                    </div>
                </div>
            </section>

            {/* 2. Overview & Stats Section */}
            <section className="detail-overview container">
                <div className="overview-grid">
                    <div className="overview-info">
                        <h2 className="section-title">{t('project_detail.overview_title', 'The Project')}</h2>
                        <p className="project-description-text">{formatAirtableText(project.description)}</p>
                    </div>

                    <div className="project-stats-sidebar">
                        <div className="project-stats-card">
                            <h4 className="stats-card-title">{t('project_detail.quick_facts', 'Quick Facts')}</h4>
                            <div className="stats-inner-grid">
                                <div className="compact-stat">
                                    <div className="stat-icon-small">
                                        <MoonIcon className="hero-icon" />
                                    </div>
                                    <div className="stat-text">
                                        <span className="label">{t('project_detail.beds', 'Bedrooms')}</span>
                                        <span className="value">{project.stats.beds}</span>
                                    </div>
                                </div>
                                <div className="compact-stat">
                                    <div className="stat-icon-small">
                                        <SparklesIcon className="hero-icon" />
                                    </div>
                                    <div className="stat-text">
                                        <span className="label">{t('project_detail.baths', 'Bathrooms')}</span>
                                        <span className="value">{project.stats.baths}</span>
                                    </div>
                                </div>
                                <div className="compact-stat">
                                    <div className="stat-icon-small">
                                        <ArrowsPointingOutIcon className="hero-icon" />
                                    </div>
                                    <div className="stat-text">
                                        <span className="label">{t('project_detail.size', 'Unit Sizes')}</span>
                                        <span className="value">{project.stats.size}</span>
                                    </div>
                                </div>
                                {project.stats.ipdc && (
                                    <div className="compact-stat">
                                        <div className="stat-icon-small">
                                            <PresentationChartLineIcon className="hero-icon" />
                                        </div>
                                        <div className="stat-text">
                                            <span className="label">{t('project_detail.ipdc', 'IPDC')}</span>
                                            <span className="value">{project.stats.ipdc}%</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Gallery & Narrative Section (Placeholder for implementation) */}
            <section className="detail-gallery container">
                <div className="section-header-flex">
                    <h2 className="section-title">{t('project_detail.gallery_title', 'The Vision')}</h2>
                    <div className="carousel-controls">
                        <button className="carousel-btn prev" onClick={() => scrollCarousel('left')}>‹</button>
                        <button className="carousel-btn next" onClick={() => scrollCarousel('right')}>›</button>
                    </div>
                </div>
                <div className="carousel-container">
                    <div className="carousel-track" ref={carouselRef}>
                        {project.gallery.map((item, index) => (
                            <div
                                key={item.id}
                                className="gallery-item carousel-item"
                                onClick={() => setSelectedImageIndex(index)}
                            >
                                <img
                                    src={item.thumbnail || item.url}
                                    alt={item.caption}
                                    width="800"
                                    height="600"
                                    loading="lazy"
                                    decoding="async"
                                />
                                <div className="gallery-item-overlay">
                                    <span className="zoom-icon">+</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Take a Look Section */}
            <section className="detail-resources bg-secondary">
                <div className="container">
                    <h2 className="section-title">{t('project_detail.resources_title', 'Take a Look')}</h2>
                    <p className="section-subtitle">{t('project_detail.resources_subtitle', 'Explore brochures, tours, and updates.')}</p>

                    <div className="resources-grid">
                        {project.resources.map((res) => (
                            <a key={res.id} href={res.link} target="_blank" rel="noopener noreferrer" className={`resource-card ${res.image ? 'has-image' : ''}`}>
                                {res.image ? (
                                    <div className="resource-card-image">
                                        <img src={res.image} alt={res.label} loading="lazy" />
                                        <div className="resource-card-overlay">
                                            <span className="resource-arrow">→</span>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="resource-icon">
                                            {res.type === 'Brochure (PDF)' && <span>📄</span>}
                                            {res.type === 'Virtual Tour (URL)' && <span>👓</span>}
                                            {res.type === 'Monthly Update' && <span>📅</span>}
                                        </div>
                                        <span className="resource-arrow">→</span>
                                    </>
                                )}
                                <div className="resource-info">
                                    <h4>{res.label}</h4>
                                    <span className="resource-type">{res.type}</span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Unit Availability Table */}
            {/* 4. Unit Availability Accordion */}
            <section className="detail-units container">
                <h2 className="section-title">{t('project_detail.units_title', 'Availability & Unit Types')}</h2>
                <div className="units-accordion">
                    {project.units.map(unit => {
                        const total = unit.totalUnits || 0;
                        const sold = unit.soldUnits || 0;
                        const available = Math.max(0, total - sold);
                        const percentAvailable = total > 0 ? (available / total) * 100 : 0;

                        let barColorClass = 'high';
                        if (percentAvailable < 20) barColorClass = 'low';
                        else if (percentAvailable < 50) barColorClass = 'med';

                        return (
                            <div
                                key={unit.id}
                                className={`accordion-item ${expandedUnitId === unit.id ? 'expanded' : ''}`}
                                style={{
                                    backgroundImage: unit.image ? `url(${unit.image})` : undefined,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                                onClick={() => toggleUnit(unit.id)}
                            >
                                <div className="item-overlay"></div>

                                <div className="accordion-header">
                                    <div className="unit-info-basic">
                                        <span className="unit-type">{unit.config}</span>
                                    </div>
                                    <div className="unit-info-meta">
                                        <span className="unit-price">
                                            {t('project_detail.from', 'From')} {formatPrice(unit.minPrice || unit.price)}
                                        </span>
                                        <span className="accordion-icon">
                                            {expandedUnitId === unit.id ?
                                                <MinusIcon className="hero-icon" /> :
                                                <PlusIcon className="hero-icon" />
                                            }
                                        </span>
                                    </div>
                                    <div className="availability-bar-container">
                                        <div
                                            className={`availability-bar-fill ${barColorClass}`}
                                            style={{ width: `${percentAvailable}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="accordion-content">
                                    <div className="unit-content-wrapper" onClick={(e) => e.stopPropagation()}>
                                        <div className="unit-content-header">
                                            {unit.description && (
                                                <div className="unit-description">
                                                    <p>{unit.description}</p>
                                                </div>
                                            )}

                                            <div className="unit-stats-row">
                                                <div className="unit-availability-stat">
                                                    <span className={`availability-count ${barColorClass}`}>
                                                        {available}
                                                    </span>
                                                    <span className="availability-label">{t('project_detail.units_available', 'Units Available')}</span>
                                                    <div className="availability-bar-visual">
                                                        <div
                                                            className={`availability-bar-fill ${barColorClass}`}
                                                            style={{ width: `${percentAvailable}%` }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                <div className="unit-extra-stats">
                                                    <div className="stat-item share-stat">
                                                        <div className="swap-visible">
                                                            <span className="stat-value">100%</span>
                                                            <span className="stat-label">Total Share</span>
                                                        </div>
                                                        {unit.percentage && (
                                                            <div className="swap-hidden">
                                                                <span className="stat-value">
                                                                    {(unit.percentage * 100).toLocaleString('en-US', { maximumFractionDigits: 2 })}%
                                                                </span>
                                                                <span className="stat-label">Min Share</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {(unit.price || unit.minPrice) && (
                                                        <div className="stat-item price-stat">
                                                            <div className="swap-visible">
                                                                <span className="stat-value">{formatCompactPrice(unit.price)}</span>
                                                                <span className="stat-label">Full Price</span>
                                                            </div>
                                                            <div className="swap-hidden">
                                                                <span className="stat-value">{formatCompactPrice(unit.minPrice)}</span>
                                                                <span className="stat-label">Min Price</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="unit-actions-row">
                                                {unit.floorPlan && (
                                                    <a href={unit.floorPlan} target="_blank" rel="noopener noreferrer" className="action-btn secondary-btn">
                                                        {t('project_detail.download_fp', 'Floor Plan')}
                                                        <ArrowDownTrayIcon className="hero-icon-sm" style={{ marginLeft: '0.5rem' }} />
                                                    </a>
                                                )}
                                                <button className="action-btn primary-btn" onClick={() => {
                                                    if (project.collection === 'Coastal' || project.collection === 'coastal') {
                                                        navigate('/#contact');
                                                    } else if (unit.salesLink) {
                                                        window.open(unit.salesLink, '_blank', 'noopener,noreferrer');
                                                    }
                                                }}>
                                                    {(project.collection === 'Coastal' || project.collection === 'coastal')
                                                        ? t('project_detail.request_info', 'Request More Information')
                                                        : t('project_detail.reserve', 'Reserve Now')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 4.5. Comparison Table (Island Collection Only) */}
            {(project.collection === 'Island' || project.collection === 'island') && (
                <section className="detail-comparison container">
                    <ComparisonTable project={project} />
                </section>
            )}

            {/* 5. Developer Section */}
            <section className="detail-developer bg-secondary">
                <div className="container developer-flex">
                    <div className="developer-info">
                        <h2 className="section-title">{t('project_detail.dev_title', 'The Developer')}</h2>
                        <h3>{project.developer.name}</h3>
                        <p>{formatAirtableText(project.developer.description)}</p>
                    </div>
                    {project.developer.image && (
                        <div className="developer-image border-accent">
                            <img
                                src={project.developer.image}
                                alt={project.developer.name}
                                width="400"
                                height="400"
                                loading="lazy"
                                decoding="async"
                            />
                        </div>
                    )}
                </div>
            </section>

            {/* 6. Location Section */}
            <section className="detail-location container">
                <h2 className="section-title">{t('project_detail.location_title', 'Location')}</h2>
                <div className="location-grid">
                    <div className="hotspots-list">
                        {(() => {
                            // Sort hotspots by distance (low to high)
                            const sortedHotspots = [...project.hotspots].sort((a, b) => {
                                return (parseFloat(a.distance) || 0) - (parseFloat(b.distance) || 0);
                            });

                            const maxDistance = Math.max(...sortedHotspots.map(h => parseFloat(h.distance) || 0), 1000); // Default to 1000 divisor if empty

                            return sortedHotspots.map(spot => {
                                const dist = parseFloat(spot.distance) || 0;
                                const widthPercent = Math.min((dist / maxDistance) * 100, 100);

                                return (
                                    <div key={spot.id} className="hotspot-item">
                                        <div className="hotspot-header">
                                            <div className="spot-info">
                                                <span className="spot-category">{spot.category}</span>
                                                <span className="spot-name">{spot.name}</span>
                                            </div>
                                            <div className="spot-proximity">
                                                <span className="distance">
                                                    {dist > 1000 ? `${(dist / 1000).toFixed(1)}km` : `${dist}m`}
                                                </span>
                                                <span className="time">{spot.time} {t('project_detail.mins', 'mins')}</span>
                                            </div>
                                        </div>
                                        <div className="distance-bar-track">
                                            <div
                                                className="distance-bar-fill"
                                                style={{ width: `${widthPercent}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            });
                        })()}
                    </div>
                    <div className="map-container border-accent">
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://maps.google.com/maps?q=${project.map.lat},${project.map.lng}&z=15&output=embed`}
                            title="Project Location"
                            frameBorder="0"
                            style={{ border: 0, filter: 'grayscale(100%) invert(90%) contrast(80%)' }} // Custom dark mode attempt
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </section >
            {/* 7. Lightbox Overlay */}
            {
                selectedImageIndex !== null && (
                    <div className="lightbox-overlay" onClick={() => setSelectedImageIndex(null)}>
                        <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                            <button className="lightbox-close" onClick={() => setSelectedImageIndex(null)}>×</button>

                            <button className="lightbox-prev" onClick={handlePrevImage}>‹</button>
                            <div className="lightbox-image-container">
                                <img
                                    src={project.gallery[selectedImageIndex].url}
                                    alt={project.gallery[selectedImageIndex].caption}
                                    className="lightbox-image"
                                    width="1200"
                                    height="900"
                                    loading="eager"
                                    decoding="async"
                                />
                                {project.gallery[selectedImageIndex].caption && (
                                    <div className="lightbox-caption">
                                        {project.gallery[selectedImageIndex].caption}
                                    </div>
                                )}
                            </div>
                            <button className="lightbox-next" onClick={handleNextImage}>›</button>

                            <div className="lightbox-counter">
                                {(selectedImageIndex + 1)} / {project.gallery.length}
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default ProjectDetailPage;
