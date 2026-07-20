import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChartBarIcon, BanknotesIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import usePageTitle from '../hooks/usePageTitle';
import './CalculatorPage.css';

const CalculatorPage = () => {
    usePageTitle('Financial Tools');
    const { t } = useTranslation();
    const [activeCalculator, setActiveCalculator] = useState(null);

    const handleROICalculator = () => {
        window.open('https://sales.arcadea.com.au/roi', '_blank', 'noopener,noreferrer');
    };

    const handleSuperCalculator = () => {
        setActiveCalculator('super');
    };

    // Load Elfsight script when super calculator is active
    useEffect(() => {
        if (activeCalculator === 'super') {
            const script = document.createElement('script');
            script.src = 'https://elfsightcdn.com/platform.js';
            script.async = true;
            document.body.appendChild(script);

            return () => {
                const existingScript = document.querySelector('script[src="https://elfsightcdn.com/platform.js"]');
                if (existingScript) {
                    document.body.removeChild(existingScript);
                }
            };
        }
    }, [activeCalculator]);

    return (
        <div className="calculator-page">
            <div className="container">
                {activeCalculator ? (
                    <div className="calculator-container">
                        <button 
                            className="back-to-selection" 
                            onClick={() => setActiveCalculator(null)}
                        >
                            <ArrowLeftIcon className="icon-sm" /> 
                            {t('common.back', 'Back to Tools')}
                        </button>
                        
                        {activeCalculator === 'super' && (
                            <div className="elfsight-widget-wrapper fade-in">
                                <h2 className="calculator-title">Superannuation Calculator</h2>
                                <p className="calculator-subtitle">Estimate your superannuation growth and retirement outlook.</p>
                                <div className="elfsight-app-5cd4c2c8-90cc-4eb9-bbac-981630d8ad7a" data-elfsight-app-lazy></div>
                                
                                <div className="calculator-disclaimer">
                                    <span className="disclaimer-title">This is a model, not a prediction</span>
                                    
                                    <p className="disclaimer-text">
                                        The results from this calculator are based on the limited information that you have provided and assumptions made about the future. 
                                        The amounts projected are estimates only provided by this model and are not guaranteed.
                                    </p>
                                    
                                    <p className="disclaimer-text">
                                        Do not rely solely on this calculator to make decisions about your retirement, there may be other factors to take into account. 
                                        Consider your own investment objectives, financial situation and needs. You may wish to get advice from a licensed financial adviser.
                                    </p>
                                    
                                    <p className="disclaimer-text">
                                        All investments involve risk which can lead to no or lower than expected returns, or a loss of part or all of your capital. 
                                        Past performance of any product described on this site is not a reliable indication of future performance. 
                                        Forecast returns are based on assumptions around operational performance, market conditions, and asset growth. 
                                        Actual results may differ.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="selection-view">
                        <div className="selection-header">
                            <h1 className="page-title">{t('calculators.title', 'Financial Tools')}</h1>
                            <p className="page-subtitle">Select a calculator to help with your investment planning.</p>
                        </div>

                        <div className="calculator-grid">
                            <div className="calculator-option-card" onClick={handleROICalculator}>
                                <div className="option-icon-wrapper">
                                    <ChartBarIcon className="option-icon" />
                                </div>
                                <div className="option-content">
                                    <h3>Investment ROI Calculator</h3>
                                    <p>Calculate potential returns and analyse investment performance in detail.</p>
                                    <span className="btn-text">Open Tool ↗</span>
                                </div>
                            </div>

                            <div className="calculator-option-card" onClick={handleSuperCalculator}>
                                <div className="option-icon-wrapper">
                                    <BanknotesIcon className="option-icon" />
                                </div>
                                <div className="option-content">
                                    <h3>Superannuation Calculator</h3>
                                    <p>Model your retirement savings and explore contribution strategies.</p>
                                    <span className="btn-text">Use Calculator →</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalculatorPage;
