import React from 'react';
const bigALogo = 'https://cms.arcadea.com.au/wp-content/uploads/2026/02/big-a.png';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = 'Loading...' }) => {
    return (
        <div className="loading-spinner-container">
            <div className="loading-logo-wrapper">
                <img
                    src={bigALogo}
                    alt="Loading"
                    className="loading-logo"
                />
                <div className="loading-fade-overlay"></div>
            </div>
            {message && <p className="loading-message">{message}</p>}
        </div>
    );
};

export default LoadingSpinner;
