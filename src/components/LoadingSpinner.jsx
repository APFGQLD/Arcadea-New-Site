import React from 'react';
const bigALogo = 'https://cms.arcadea.com.au/wp-content/uploads/2026/02/big-a.png';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = 'Loading...' }) => {
    return (
        <div className="loading-spinner-container">
            <div className="loading-logo-wrapper">
                {/* Base Logo (Faint) */}
                <img
                    src={bigALogo}
                    alt="Loading Base"
                    className="loading-logo-base"
                />
                {/* Fill Logo (Animated) */}
                <img
                    src={bigALogo}
                    alt="Loading Fill"
                    className="loading-logo-fill"
                />
            </div>
            {message && <p className="loading-message">{message}</p>}
        </div>
    );
};

export default LoadingSpinner;
