import React, { useState, useEffect } from 'react';
import { rafThrottle } from '../utils/rafThrottle';
import './CinematicHero.css';

/**
 * Full-screen sticky hero that shrinks into a rounded card as the page
 * scrolls, while its text fades and lifts away. Used across the Home,
 * Properties, About and Services pages.
 *
 * variant="feature" is for showcasing a single project: an oversized title
 * with a short, letter-spaced location line instead of a body subtitle.
 * align="left" lines the text up with the page's content edge instead of
 * centring it.
 */
const CinematicHero = ({ image, imageAlt = '', video, tag, title, subtitle, action, variant, align = 'center' }) => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = rafThrottle(() => setScrollY(window.scrollY));
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            handleScroll.cancel();
        };
    }, []);

    const scrollProgress = Math.min(scrollY / 600, 1);
    const heroScale = 1 - (scrollProgress * 0.15);
    const heroRadius = scrollProgress * 40;
    const textOpacity = Math.max(0, 1 - (scrollProgress * 2));
    const textTranslate = scrollProgress * -100;

    return (
        <div className={['cine-hero', variant && `cine-hero--${variant}`, align === 'left' && 'cine-hero--left'].filter(Boolean).join(' ')}>
            <div className="cine-hero-sticky">
                <div
                    className="cine-hero-bg"
                    style={{ transform: `scale(${heroScale})`, borderRadius: `${heroRadius}px` }}
                >
                    {video ? (
                        <video autoPlay loop muted playsInline poster={image} className="cine-hero-image">
                            <source src={video} type="video/mp4" />
                        </video>
                    ) : (
                        image && <img src={image} alt={imageAlt} className="cine-hero-image" />
                    )}
                    <div className="cine-hero-overlay"></div>
                </div>

                <div
                    className="cine-hero-text"
                    style={{
                        opacity: textOpacity,
                        transform: `translate(-50%, calc(-50% + ${textTranslate}px))`
                    }}
                >
                    {tag && <div className="cine-hero-tag">{tag}</div>}
                    <h1 className="cine-hero-title">{title}</h1>
                    {subtitle && <p className="cine-hero-subtitle">{subtitle}</p>}
                    {action}
                </div>

                <div className="cine-hero-scroll" style={{ opacity: textOpacity }}>
                    <span>Scroll to Explore</span>
                    <div className="cine-hero-scroll-line"></div>
                </div>
            </div>
        </div>
    );
};

export default CinematicHero;
