import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';
import { fetchPageAssets } from '../services/sanityService';
import './EditorialPage.css';
import './TheLucReviewsPage.css';

const TheLucReviewsPage = () => {
    usePageTitle('The Luc Reviews', {
        description: 'Guest reviews of The Luc, Berawa — what guests say about their stay, from Google, Booking.com and Tripadvisor.'
    });
    const [assets, setAssets] = useState({});
    const [activeWidget, setActiveWidget] = useState('all'); // 'all' or 'tripadvisor'

    useEffect(() => {
        const loadAssets = async () => {
            const fetched = await fetchPageAssets(['luc-reviews-bg']);
            const assetMap = {};
            fetched.forEach(a => { assetMap[a.identifier] = a.url; });
            setAssets(assetMap);
        };
        loadAssets();
    }, []);

    useEffect(() => {
        // Load Elfsight's script once
        if (!document.querySelector('script[src="https://elfsightcdn.com/platform.js"]')) {
            const script = document.createElement('script');
            script.src = "https://elfsightcdn.com/platform.js";
            script.async = true;
            document.body.appendChild(script);
        }

        // Re-initialise when switching widgets; platform.js usually handles
        // this itself, but a manual trigger helps if it doesn't.
        if (window.ElfsightPlatform) {
            window.ElfsightPlatform.init();
        }
    }, [activeWidget]);

    return (
        <div className="editorial-page luc-reviews-page">
            {/* Banner: same photo card treatment as the collection pages */}
            <div className="ed-wide luc-reviews-top">
                <Link to="/project/luc" className="ed-text-link luc-reviews-back">&larr; The Luc Villas</Link>
                <div className="ed-card luc-reviews-banner">
                    {assets['luc-reviews-bg'] && (
                        <img src={assets['luc-reviews-bg']} alt="" className="ed-card-bg" />
                    )}
                    <div className="ed-card-overlay"></div>
                    <div className="ed-card-content luc-reviews-banner-content">
                        <span className="ed-eyebrow ed-on-photo-gold">Guest Reviews</span>
                        <h1 className="luc-reviews-title">The Luc Reviews</h1>
                        <p className="luc-reviews-subtitle">What our guests are saying about their experience.</p>
                    </div>
                </div>
            </div>

            <div className="ed-wide luc-reviews-body">
                <div className="luc-reviews-toggle" role="group" aria-label="Review source">
                    <button
                        type="button"
                        className={`luc-reviews-pill ${activeWidget === 'all' ? 'active' : ''}`}
                        aria-pressed={activeWidget === 'all'}
                        onClick={() => setActiveWidget('all')}
                    >
                        All Reviews
                    </button>
                    <button
                        type="button"
                        className={`luc-reviews-pill ${activeWidget === 'tripadvisor' ? 'active' : ''}`}
                        aria-pressed={activeWidget === 'tripadvisor'}
                        onClick={() => setActiveWidget('tripadvisor')}
                    >
                        Tripadvisor
                    </button>
                </div>

                <div className="luc-reviews-widget">
                    {activeWidget === 'all' ? (
                        <div key="all-reviews" className="elfsight-app-acf57c1f-ce19-4292-a66f-b2f29d53e6aa" data-elfsight-app-lazy></div>
                    ) : (
                        <div key="tripadvisor-reviews" className="elfsight-app-4ce92bac-b0c5-437f-b582-b8158bac2a2a" data-elfsight-app-lazy></div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TheLucReviewsPage;
