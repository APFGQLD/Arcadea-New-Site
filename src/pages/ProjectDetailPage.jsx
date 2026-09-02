import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useNavVisibility } from '../context/NavVisibilityContext';
import { fetchProjectDetail } from '../services/sanityService';
import {
    MoonIcon,
    SparklesIcon,
    ArrowsPointingOutIcon,
    PresentationChartLineIcon,
    HomeIcon,
    CalendarIcon,
    MapPinIcon,
    ClockIcon,
    CurrencyDollarIcon,
    ShieldCheckIcon,
    BuildingOfficeIcon,
    BriefcaseIcon,
    UsersIcon,
    LightBulbIcon,
    GlobeAltIcon
} from '@heroicons/react/24/solid';
import { FaBed, FaBath, FaToilet, FaCar } from 'react-icons/fa6';
import LoadingSpinner from '../components/LoadingSpinner';
import ComparisonTable from '../components/ComparisonTable';
import usePageTitle from '../hooks/usePageTitle';
import { formatListingPrice } from '../utils/priceFormat';
import './ProjectDetailPage.css';

const STATUS_STYLES = {
    'for sale': 'status-for-sale',
    'under offer': 'status-under-offer',
    'sold': 'status-sold',
    'coming soon': 'status-coming-soon',
    'off market': 'status-off-market',
};

const ProjectDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { theme } = useTheme();
    const { setNavHidden } = useNavVisibility();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const carouselRef = useRef(null);
    const navBannerSentinelRef = useRef(null);
    const [navBannerCompact, setNavBannerCompact] = useState(false);

    usePageTitle(project?.name);

    // The mini section-menu takes over the top of the viewport (replacing the
    // main Navbar) once it becomes sticky, detected via a zero-height sentinel
    // placed just before it: once the sentinel scrolls above the top, the menu
    // has pinned. It starts at the same height as the Navbar (so the handoff
    // is a seamless swap, nothing mismatched to peek out from behind), then
    // eases down to a more compact height once scrolled a bit further, with
    // nothing else on screen at that point for it to clash with.
    useEffect(() => {
        const sentinel = navBannerSentinelRef.current;
        if (!sentinel) return;

        const COMPACT_SCROLL_RANGE = 60; // px scrolled past pin before compacting

        const handleScroll = () => {
            const top = sentinel.getBoundingClientRect().top;
            const pinned = top <= 0;
            setNavHidden(pinned);
            setNavBannerCompact(pinned && top <= -COMPACT_SCROLL_RANGE);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            setNavHidden(false); // Restore the main Navbar when leaving this page
        };
    }, [project, setNavHidden]);

    useEffect(() => {
        const loadProject = async () => {
            setLoading(true);
            try {
                const data = await fetchProjectDetail(id);
                setProject(data);
                setSelectedImageIndex(null); // Reset lightbox on project change
            } catch (err) {
                console.error('Error fetching project detail:', err);
                setError(t('project_detail.error', 'Failed to load project details.'));
            } finally {
                setLoading(false);
            }
        };

        if (id) loadProject();
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [id, t]);

    const handleNextImage = useCallback(() => {
        if (!project?.gallery?.length) return;
        setSelectedImageIndex((prev) => (prev + 1) % project.gallery.length);
    }, [project?.gallery?.length]);

    const handlePrevImage = useCallback(() => {
        if (!project?.gallery?.length) return;
        setSelectedImageIndex((prev) => (prev - 1 + project.gallery.length) % project.gallery.length);
    }, [project?.gallery?.length]);

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
    }, [selectedImageIndex, handleNextImage, handlePrevImage]);

    const scrollCarousel = (direction) => {
        if (!carouselRef.current) return;
        const scrollAmount = carouselRef.current.clientWidth * 0.8;
        carouselRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    // Convert a YouTube watch/share URL into an embeddable URL
    const getYouTubeEmbedUrl = (url) => {
        if (!url) return '';
        const match = url.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
        const videoId = match ? match[1] : null;
        return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : url;
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

    const getIcon = (iconName) => {
        if (!iconName) return <PresentationChartLineIcon className="hero-icon" />;

        const icons = {
            moonicon: MoonIcon,
            sparklesicon: SparklesIcon,
            arrowspointingouticon: ArrowsPointingOutIcon,
            presentationchartlineicon: PresentationChartLineIcon,
            homeicon: HomeIcon,
            calendaricon: CalendarIcon,
            mappinicon: MapPinIcon,
            clockicon: ClockIcon,
            currencydollaricon: CurrencyDollarIcon,
            shieldcheckicon: ShieldCheckIcon,
            buildingofficeicon: BuildingOfficeIcon,
            briefcaseicon: BriefcaseIcon,
            usersicon: UsersIcon,
            lightbulbicon: LightBulbIcon,
            globealticon: GlobeAltIcon,
            bedicon: FaBed,
            bathicon: FaBath,
            toileticon: FaToilet,
            caricon: FaCar
        };

        // Clean name: remove non-alphanumeric, lowercase and ensure it ends with "icon" for lookup
        let cleanName = iconName.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
        if (!cleanName.endsWith('icon')) cleanName += 'icon';

        const Icon = icons[cleanName] || PresentationChartLineIcon;
        return <Icon className="hero-icon" />;
    };

    return (
        <div className="project-detail-page">
            {/* 1. Cinematic Hero Section */}
            <section className="detail-hero" id="hero">
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
                        {(project.price || project.status) && (
                            <div className="hero-listing-row">
                                {project.price && (
                                    <span className="hero-listing-price">{formatListingPrice(project.price)}</span>
                                )}
                                {project.status && (
                                    <span className={`listing-status-pill ${STATUS_STYLES[project.status.toLowerCase()] || ''}`}>
                                        {project.status}
                                    </span>
                                )}
                            </div>
                        )}
                        <button
                            className="action-btn primary-btn hero-cta-btn"
                            onClick={() => {
                                if (project.ctaLink) {
                                    window.open(project.ctaLink, '_blank', 'noopener,noreferrer');
                                } else {
                                    navigate('/#contact');
                                }
                            }}
                        >
                            {project.ctaLabel || t('project_detail.enquire', 'Enquire Now')}
                        </button>
                    </div>
                </div>
            </section>

            {/* Quick Navigation Banner */}
            <div ref={navBannerSentinelRef} aria-hidden="true" />
            <nav className={`detail-nav-banner ${navBannerCompact ? 'nav-compact' : ''}`}>
                <div className="container nav-banner-inner">
                    <button className="nav-banner-link nav-banner-back" onClick={() => navigate('/properties')}>
                        &larr; {t('project_detail.nav_back', 'Portfolio')}
                    </button>
                    <a href="#overview" className="nav-banner-link">{t('project_detail.nav_overview', 'Overview')}</a>
                    {(project.collection === 'island') && (
                        <a href="#comparison" className="nav-banner-link">{t('project_detail.nav_comparison', 'Comparison')}</a>
                    )}
                    <a href="#vision" className="nav-banner-link">{t('project_detail.nav_vision', 'The Vision')}</a>
                    {project.videoUrl && (
                        <a href="#video" className="nav-banner-link">{t('project_detail.nav_video', 'Video')}</a>
                    )}
                    <a href="#resources" className="nav-banner-link">{t('project_detail.nav_resources', 'Resources')}</a>
                    <a href="#location" className="nav-banner-link">{t('project_detail.nav_location', 'Location')}</a>
                    {project.agents?.length > 0 && (
                        <a href="#agent" className="nav-banner-link">{t('project_detail.nav_agent', 'Agent')}</a>
                    )}
                </div>
            </nav>

            {/* 2. Overview & Stats Section */}
            <section className="detail-overview container" id="overview">
                <div className="overview-grid">
                    <div className="overview-info">
                        <h2 className="section-title">{t('project_detail.overview_title', 'The Project')}</h2>
                        <p className="project-description-text">{formatAirtableText(project.description)}</p>
                    </div>

                    {project.quickFacts?.length > 0 && (
                        <div className="project-stats-sidebar">
                            <div className="project-stats-card">
                                <h4 className="stats-card-title">{t('project_detail.quick_facts', 'Quick Facts')}</h4>
                                <div className="stats-inner-grid">
                                    {project.quickFacts.map(fact => (
                                        <div key={fact.id} className="compact-stat">
                                            <div className="stat-icon-small">
                                                {getIcon(fact.icon)}
                                            </div>
                                            <div className="stat-text">
                                                <span className="label">{fact.label}</span>
                                                <span className="value">{fact.value}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* 2.5. Comparison Table (Island Collection Only) */}
            {(project.collection === 'island') && (
                <section className="detail-comparison container" id="comparison">
                    <ComparisonTable project={project} />
                </section>
            )}

            {/* 3. Gallery & Narrative Section */}
            <section className="detail-gallery container" id="vision">
                <div className="section-header-flex">
                    <h2 className="section-title">{t('project_detail.gallery_title', 'The Vision')}</h2>
                    <div className="carousel-controls">
                        <button className="carousel-btn prev" onClick={() => scrollCarousel('left')}>‹</button>
                        <button className="carousel-btn next" onClick={() => scrollCarousel('right')}>›</button>
                    </div>
                </div>
                <div className="carousel-container">
                    <div className="carousel-track" ref={carouselRef}>
                        {project.gallery?.map((item, index) => (
                            <div
                                key={item.id}
                                className="gallery-item carousel-item"
                                onClick={() => setSelectedImageIndex(index)}
                            >
                                <img
                                    src={item.thumbMedium || item.url}
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

            {/* 3.5. Video Section */}
            {project.videoUrl && (
                <section className="detail-video container" id="video">
                    <h2 className="section-title">{t('project_detail.video_title', 'The Film')}</h2>
                    <div className="video-embed-wrapper">
                        <iframe
                            src={getYouTubeEmbedUrl(project.videoUrl)}
                            title={`${project.name} video`}
                            loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </section>
            )}

            {/* 4. Resources Section */}
            <section className="detail-resources bg-secondary" id="resources">
                <div className="container">
                    <h2 className="section-title">{t('project_detail.resources_title', 'Resources')}</h2>
                    <p className="section-subtitle">{t('project_detail.resources_subtitle', 'Explore brochures, tours, and updates.')}</p>

                    <div className="resources-grid">
                        {project.resources?.map((res) => (
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

            {/* 5. Location Section */}
            <section className="detail-location container" id="location">
                <h2 className="section-title">{t('project_detail.location_title', 'Location')}</h2>
                <div className="location-grid">
                    {project.address && (
                        <div className="address-block">
                            <span className="address-label">{t('project_detail.address_label', 'Address')}</span>
                            <p className="address-text">{project.address}</p>
                            <a
                                href={
                                    project.map?.lat && project.map?.lng
                                        ? `https://www.google.com/maps/dir/?api=1&destination=${project.map.lat},${project.map.lng}`
                                        : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(project.address)}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="action-btn secondary-btn address-directions-btn"
                            >
                                {t('project_detail.get_directions', 'Get Directions')}
                            </a>
                        </div>
                    )}
                    {(project.address || (project.map?.lat && project.map?.lng)) && (
                        <div className="map-container border-accent">
                            <iframe
                                width="100%"
                                height="100%"
                                src={
                                    project.map?.lat && project.map?.lng
                                        ? `https://maps.google.com/maps?q=${project.map.lat},${project.map.lng}&z=15&output=embed`
                                        : `https://maps.google.com/maps?q=${encodeURIComponent(project.address)}&z=15&output=embed`
                                }
                                title="Project Location"
                                frameBorder="0"
                                style={{ border: 0, filter: 'grayscale(100%) invert(90%) contrast(80%)' }} // Custom dark mode attempt
                                allowFullScreen
                            ></iframe>
                        </div>
                    )}
                </div>
            </section >

            {/* 6. Agent Section */}
            {project.agents?.length > 0 && (
                <section className="detail-agents bg-secondary" id="agent">
                    <div className="container">
                        <h2 className="section-title">{t('project_detail.agent_title', 'Speak to an Agent')}</h2>
                        <div className="agents-grid">
                            {project.agents.map((agent) => (
                                <div key={agent.id} className="agent-card">
                                    {agent.photo && (
                                        <div className="agent-photo border-accent">
                                            <img
                                                src={agent.photo}
                                                alt={agent.name}
                                                width="300"
                                                height="300"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        </div>
                                    )}
                                    <div className="agent-info">
                                        <h3>{agent.name}</h3>
                                        {agent.jobTitle && <span className="agent-role">{agent.jobTitle}</span>}
                                        {agent.bio && <p className="agent-bio">{formatAirtableText(agent.bio)}</p>}
                                        <div className="agent-contact-links">
                                            {agent.phone && <a href={`tel:${agent.phone}`} className="agent-contact-link">{agent.phone}</a>}
                                            {agent.email && <a href={`mailto:${agent.email}`} className="agent-contact-link">{agent.email}</a>}
                                        </div>
                                        <button className="action-btn primary-btn" onClick={() => navigate('/#contact')}>
                                            {t('project_detail.enquire', 'Enquire Now')}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 7. Lightbox Overlay */}
            {
                selectedImageIndex !== null && project.gallery?.[selectedImageIndex] && (
                    <div className="lightbox-overlay" onClick={() => setSelectedImageIndex(null)}>
                        <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                            <button className="lightbox-close" onClick={() => setSelectedImageIndex(null)}>×</button>

                            <button
                                className="lightbox-prev"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePrevImage();
                                }}
                            >
                                ‹
                            </button>

                            <div className="lightbox-image-container">
                                <div className="lightbox-slider-track">
                                    {project.gallery.map((item, index) => (
                                        <div 
                                            key={item.id || index} 
                                            className={`lightbox-slide ${index === selectedImageIndex ? 'active' : ''}`}
                                        >
                                            <div className="lightbox-image-wrapper">
                                                {/* Progressive Loading: Show medium thumb as blurred background while full loads */}
                                                <img 
                                                    src={item.thumbMedium} 
                                                    className="lightbox-placeholder" 
                                                    alt="" 
                                                    aria-hidden="true"
                                                />
                                                <img
                                                    src={item.url}
                                                    alt={item.caption}
                                                    className="lightbox-image"
                                                    // Eager load current and adjacent images for smoothness
                                                    loading={Math.abs(index - selectedImageIndex) <= 1 ? "eager" : "lazy"}
                                                    onLoad={(e) => e.target.classList.add('loaded')}
                                                />
                                            </div>
                                            {item.caption && <p className="lightbox-caption">{item.caption}</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                className="lightbox-next"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleNextImage();
                                }}
                            >
                                ›
                            </button>

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
