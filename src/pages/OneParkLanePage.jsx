import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './OneParkLanePage.css';

const OneParkLanePage = () => {
    const trackRef = useRef(null);
    const contentRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();

    // Manual JS Sticky Logic
    useEffect(() => {
        const handleScroll = () => {
            // Safety check
            if (!trackRef.current || !contentRef.current) return;

            const scrollY = window.scrollY;
            const trackHeight = trackRef.current.offsetHeight;
            const windowHeight = window.innerHeight;
            const maxTranslate = trackHeight - windowHeight;
            const componentOffsetTop = trackRef.current.offsetTop;
            const relativeScroll = scrollY - componentOffsetTop;

            // Pinning Logic
            const translateY = Math.max(0, Math.min(relativeScroll, maxTranslate));
            contentRef.current.style.transform = `translate3d(0, ${translateY}px, 0)`;

            // Progress Calculation (0 to 1)
            if (maxTranslate > 0) {
                setProgress(Math.max(0, Math.min(1, relativeScroll / maxTranslate)));
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        const handleMouseMove = (e) => {
            if (!contentRef.current) return;
            const { clientX, clientY } = e;
            // Calculate distance from center of window (-50 to 50)
            const x = (clientX / window.innerWidth - 0.5) * 100;
            const y = (clientY / window.innerHeight - 0.5) * 100;
            
            contentRef.current.style.setProperty('--mouse-x', `${x}`);
            contentRef.current.style.setProperty('--mouse-y', `${y}`);
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    // Animation Helpers
    const getOpacity = (start, end) => {
        if (progress < start) return 0;
        if (progress >= end) return 1;
        return (progress - start) / (end - start);
    };

    const getFadeOut = (windowStart, windowEnd) => {
        if (progress < windowStart) return 1;
        if (progress >= windowEnd) return 0;
        return 1 - (progress - windowStart) / (windowEnd - windowStart);
    };

    return (
        <div className="opl-page">
            <div ref={trackRef} className="opl-hero-track">
                <div ref={contentRef} className="opl-js-sticky-content">
                    <button className="shared-back-link" onClick={() => navigate('/properties')}>
                        &larr; Back to Portfolio
                    </button>

                    {/* Background Layer 1: Animated Gradient & Glassmorphism */}
                    <div className="opl-hero-bg" style={{ opacity: getFadeOut(0.25, 0.45) }}>
                        <div className="opl-hero-gradient-bg">
                            <div className="opl-gradient-blob blob-1"></div>
                            <div className="opl-gradient-blob blob-2"></div>
                            <div className="opl-gradient-blob blob-3"></div>
                            <div className="opl-glass-overlay"></div>
                        </div>
                    </div>

                    {/* Background Layer 2: Final Image (Fades In) */}
                    <div className="opl-hero-bg" style={{ opacity: getOpacity(0.25, 0.45) }}>
                        <img
                            src="https://cms.arcadea.com.au/wp-content/uploads/2026/02/V03_FINAL_lowres.jpeg"
                            alt="One Park Lane Interior"
                            onError={(e) => {
                                console.warn("Image load failed");
                            }}
                        />
                        <div className="opl-overlay"></div>
                    </div>

                    {/* Layer 1: Initial Title */}
                    <div
                        className="opl-layer"
                        style={{
                            opacity: getFadeOut(0.1, 0.3),
                            transform: `translateY(-${50 * (1 - getFadeOut(0.1, 0.3))}px)`
                        }}
                    >
                        <h1 className="opl-title-init">
                            Australia's Newest Icon Rises
                        </h1>
                    </div>

                    {/* Layer 2: Sequence Title */}
                    <div className="opl-layer">
                        <div className="opl-title-seq-wrapper">
                            <span
                                className="opl-seq-word"
                                style={{
                                    opacity: getOpacity(0.35, 0.45),
                                    transform: `translateY(${30 * (1 - getOpacity(0.35, 0.45))}px)`
                                }}
                            >
                                One
                            </span>
                            <span
                                className="opl-seq-word"
                                style={{
                                    opacity: getOpacity(0.5, 0.6),
                                    transform: `translateY(${30 * (1 - getOpacity(0.5, 0.6))}px)`
                                }}
                            >
                                Park
                            </span>
                            <span
                                className="opl-seq-word"
                                style={{
                                    opacity: getOpacity(0.65, 0.75),
                                    transform: `translateY(${30 * (1 - getOpacity(0.65, 0.75))}px)`
                                }}
                            >
                                Lane
                            </span>
                        </div>
                    </div>

                    <div className="opl-scroll-prompt" style={{ opacity: getFadeOut(0.05, 0.15) }}>
                        Scroll to Explore
                    </div>
                </div>
            </div>

            {/* Section 2: Extraordinary & Iconic */}
            <section className="opl-section-text">
                <div className="opl-container-narrow">
                    <span className="opl-subtitle">The Landmark</span>
                    <h2 className="opl-heading-lux">Extraordinary & Iconic</h2>
                    <div className="opl-divider"></div>
                    <p className="opl-body-text">
                        The towers of One Park Lane will stand together as an unparalleled landmark and a gateway to Southport’s newly imagined CBD.
                    </p>
                    <p className="opl-body-text">
                        Designed by renowned architects BKK, the modern and slender spires will transcend the skyline at an awe-inspiring 101 and 60 storeys. Comprising luxury 2 & 3 bedroom residences and 4 bedroom penthouses, where elegant and striking design meets sought-after amenities.
                    </p>
                </div>
            </section>

            {/* Section 3: Project Overview */}
            <section className="opl-section-overview">
                <div className="opl-mesh-gradient"></div>
                <div className="opl-container">

                    {/* Stats Row */}
                    <div className="opl-stats-grid">
                        <div className="opl-stat-item">
                            <span className="opl-stat-number">101</span>
                            <span className="opl-stat-label">Storeys</span>
                        </div>
                        <div className="opl-stat-item">
                            <span className="opl-stat-number">197</span>
                            <span className="opl-stat-label">Premium Apartments</span>
                        </div>
                        <div className="opl-stat-item">
                            <span className="opl-stat-number">2028</span>
                            <span className="opl-stat-label">Expected Completion</span>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="opl-features-text-grid">
                        <div className="opl-feature-text-block">
                            <h4>Architectural Excellence</h4>
                            <p>101 storey residential tower with 60 storey commercial tower connected by a stunning skybridge at level 22.</p>
                        </div>
                        <div className="opl-feature-text-block">
                            <h4>Premium Location</h4>
                            <p>Located at 1 Park Lane, Southport – the heart of Gold Coast’s premier business and lifestyle precinct.</p>
                        </div>
                        <div className="opl-feature-text-block">
                            <h4>Luxury Finishes</h4>
                            <p>Every apartment features premium finishes, floor to ceiling windows, and spectacular views.</p>
                        </div>
                    </div>

                </div>
            </section>

            {/* Section 4: Fixed Image Parallax */}
            <div className="opl-fixed-image-section"></div>

            {/* Section 5: World Class Amenities */}
            <section className="opl-section-amenities">
                <div className="opl-container">
                    <h2 className="opl-heading-lux">World Class Amenities</h2>
                    <div className="opl-divider"></div>
                    <p className="opl-body-text" style={{ maxWidth: '700px', margin: '0 auto 4rem auto' }}>
                        Indulge in resort-style living with our comprehensive range of luxury amenities designed for the discerning resident.
                    </p>

                    <div className="opl-amenities-grid">
                        <div className="opl-amenity-card">
                            <div className="opl-amenity-img">
                                <img src="https://cms.arcadea.com.au/wp-content/uploads/2026/02/V04_FINAL_lowres.jpeg" alt="Signature Restaurant & Bar" />
                            </div>
                            <div className="opl-amenity-content">
                                <h3>Signature Restaurant & Bar</h3>
                                <p>Fine dining experience with chef's table and sky deck bar for entertaining.</p>
                            </div>
                        </div>
                        <div className="opl-amenity-card">
                            <div className="opl-amenity-img">
                                <img src="https://cms.arcadea.com.au/wp-content/uploads/2026/07/V07_FINAL_lowres.jpeg" alt="Infinity Pool & Sky Deck" />
                            </div>
                            <div className="opl-amenity-content">
                                <h3>Infinity Pool & Sky Deck</h3>
                                <p>Relax in our stunning infinity pool with panoramic Gold Coast skyline views.</p>
                            </div>
                        </div>
                        <div className="opl-amenity-card">
                            <div className="opl-amenity-img">
                                <img src="https://cms.arcadea.com.au/wp-content/uploads/2026/07/V11_FINAL_lowres.jpeg" alt="Cutting Edge Fitness Centre" />
                            </div>
                            <div className="opl-amenity-content">
                                <h3>Cutting Edge Fitness Centre</h3>
                                <p>Fully equipped gymnasium with the latest fitness technology and city views.</p>
                            </div>
                        </div>
                    </div>

                    <div className="opl-premium-list-wrapper">
                        <h4>Additional Premium Amenities:</h4>
                        <ul className="opl-premium-list">
                            <li>Resident Lounge & Library</li>
                            <li>Landscaped Gardens</li>
                            <li>Private Dining Rooms</li>
                            <li>Sky Deck Function Spaces</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Section 6: Final Info / Blueprint Grid */}
            <section className="opl-section-final">
                <div className="opl-blueprint-grid"></div>
                <div className="opl-container">
                    <h2 className="opl-heading-lux">Next Steps</h2>
                    <div className="opl-cta-wrapper">
                        <button className="opl-btn-cta" onClick={() => window.open('https://1parklane.au/invitation', '_blank')}>Visit Project Website</button>
                        <button className="opl-btn-cta" onClick={() => navigate('/#contact')}>Request Brochure</button>
                        <button className="opl-btn-cta" onClick={() => window.open('https://portal.apfg.au/pricelist', '_blank')}>View Pricelist</button>
                        <button className="opl-btn-cta" onClick={() => navigate('/#contact')}>Request Call Back</button>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default OneParkLanePage;
