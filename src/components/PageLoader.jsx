import React, { useState, useEffect } from 'react';
import './PageLoader.css';

const brandLogoWhite = 'https://cms.arcadea.com.au/wp-content/uploads/2026/02/brand-logo-white.png';

const PageLoader = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Function to hide loader
        const hideLoader = () => {
            setLoading(false);
        };

        // Check if page is already loaded
        if (document.readyState === 'complete') {
            // Add a small delay even if loaded to ensure smoothness
            setTimeout(hideLoader, 800);
        } else {
            // Wait for window load event
            window.addEventListener('load', hideLoader);

            // Fallback timeout in case load event doesn't fire or takes too long
            const timeoutId = setTimeout(hideLoader, 3000); // 3 seconds max wait

            return () => {
                window.removeEventListener('load', hideLoader);
                clearTimeout(timeoutId);
            };
        }
    }, []);

    // We keep the component in the DOM but hide it via CSS class for the fade-out effect
    // If we return null immediately when !loading, we lose the fade-out transition.
    // However, after the transition is done (e.g. 1s), we could fully remove it if we wanted,
    // but CSS pointer-events: none is usually sufficient.

    return (
        <div className={`page-loader ${!loading ? 'loader-hidden' : ''}`}>
            <div className="loader-content">
                <img
                    src={brandLogoWhite}
                    alt="Arcadea Property"
                    className="loader-logo"
                />
                {/* Optional spinner below logo */}
                {/* <div className="loader-spinner"></div> */}
            </div>
        </div>
    );
};

export default PageLoader;
