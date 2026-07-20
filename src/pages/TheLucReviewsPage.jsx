import React, { useState, useEffect } from 'react';
import './TheLucReviewsPage.css';
import { fetchPageAssets } from '../services/sanityService';

const TheLucReviewsPage = () => {
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

        // Load Elfsight script if it's not already there
        if (!document.querySelector('script[src="https://elfsightcdn.com/platform.js"]')) {
            const script = document.createElement('script');
            script.src = "https://elfsightcdn.com/platform.js";
            script.async = true;
            document.body.appendChild(script);
        }

        // Re-initialize Elfsight whenever the widget changes
        // Elfsight's platform.js usually handles this, but a manual trigger can help if it doesn't
        if (window.ElfsightPlatform) {
            window.ElfsightPlatform.init();
        }
    }, [activeWidget]);

    return (
        <div className="the-luc-reviews-page">
            <div className="reviews-hero" style={assets['luc-reviews-bg'] ? { '--hero-bg-image': `url(${assets['luc-reviews-bg']})` } : {}}>
                <div className="container">
                    <h1 className="reviews-title">The Luc Reviews</h1>
                    <p className="reviews-subtitle">What our guests are saying about their experience.</p>
                    
                    <div className="reviews-toggle-container">
                        <div className="reviews-toggle">
                            <button 
                                className={`toggle-btn ${activeWidget === 'all' ? 'active' : ''}`}
                                onClick={() => setActiveWidget('all')}
                            >
                                All Reviews
                            </button>
                            <button 
                                className={`toggle-btn ${activeWidget === 'tripadvisor' ? 'active' : ''}`}
                                onClick={() => setActiveWidget('tripadvisor')}
                            >
                                Tripadvisor
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="reviews-container section-padding">
                <div className="container">
                    <div className="widget-wrapper">
                        {activeWidget === 'all' ? (
                            <div key="all-reviews" className="elfsight-app-acf57c1f-ce19-4292-a66f-b2f29d53e6aa" data-elfsight-app-lazy></div>
                        ) : (
                            <div key="tripadvisor-reviews" className="elfsight-app-4ce92bac-b0c5-437f-b582-b8158bac2a2a" data-elfsight-app-lazy></div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TheLucReviewsPage;
