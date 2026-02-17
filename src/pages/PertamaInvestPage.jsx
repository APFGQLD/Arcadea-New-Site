import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './PertamaInvestPage.css';

const PertamaInvestPage = () => {
    const { t } = useTranslation();
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const form = e.target;
        const formData = new FormData(form);

        formData.append("access_key", "d4a413d6-a7ef-4387-ac0f-b707ac7b5f78");
        formData.append("subject", "New Investment Inquiry from Pertama Guest");

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            if (response.ok) {
                setSubmitted(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                alert("Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Form error:", error);
            alert("Connection error. Please check your internet.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="pertama-page">
                <header className="pertama-header">
                    <img src="/pertama-logo.png" alt="Pertama Property" className="pertama-partner-logo" />
                    <span className="header-divider">✕</span>
                    <img src="/brand-logo-white.png" alt="Arcadea Property" className="pertama-logo" />
                </header>
                <div className="pertama-section">
                    <div className="form-success animate-in">
                        <div className="success-icon">✓</div>
                        <h2 className="pertama-heading">Thank You</h2>
                        <p className="pertama-text">
                            We have received your details. One of our investment specialists will be in touch shortly.
                        </p>
                        <p className="pertama-text">
                            In the meantime, you can access our comprehensive investment guide below.
                        </p>
                        <button className="form-btn" onClick={() => window.location.href = 'https://www.baliproperty.com.au/investment-guide'}>
                            Download Investment Guide
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pertama-page">
            <header className="pertama-header">
                <img src="/pertama-logo.png" alt="Pertama Property" className="pertama-partner-logo" />
                <span className="header-divider">✕</span>
                <img src="/brand-logo-white.png" alt="Arcadea Property" className="pertama-logo" />
            </header>

            <section className="pertama-hero">
                <div className="pertama-hero-content animate-in">
                    <h1 className="pertama-title">Love the Lifestyle?</h1>
                    <p className="pertama-subtitle">Turn your passion for Bali into a profitable investment.</p>
                </div>
            </section>

            <section className="pertama-section">
                <h2 className="pertama-heading">Make Money from Paradise</h2>
                <p className="pertama-text">
                    You've experienced the magic of staying with us. Now discover how you can own a piece of this paradise.
                    Arcadea Property specializes in high-yield holiday rental investments designed for serious returns.
                </p>

                <div className="pertama-featured-card">
                    <h3 className="featured-label">Featured Opportunity</h3>
                    <h2 className="featured-title">Beraban Luxury Lofts</h2>
                    <p className="featured-desc">The newest addition to our curated collection. Combining modern luxury with classic Bali charm in the heart of Canggu.</p>
                    <Link to="/project/beraban" className="featured-link">View Project Details →</Link>
                </div>

                <h2 className="pertama-heading" style={{ marginTop: '0px' }}>Request Investment Info</h2>
                <p className="pertama-text">
                    Fill in your details below to receive our exclusive investment prospectus.
                </p>

                <div className="pertama-form-container">
                    <form className="pertama-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">Full Name</label>
                            <input type="text" id="name" name="name" className="form-input" required placeholder="John Doe" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <input type="email" id="email" name="email" className="form-input" required placeholder="john@example.com" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone" className="form-label">WhatsApp / Phone</label>
                            <input type="tel" id="phone" name="phone" className="form-input" required placeholder="+61 400 000 000" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="guest_location" className="form-label">I am currently staying at</label>
                            <select id="guest_location" name="guest_location" className="form-select">
                                <option value="Pertama Villa">Pertama Villa</option>
                                <option value="Pertama Resort">Pertama Resort</option>
                                <option value="Other">Other Location</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="message" className="form-label">Specific Interests?</label>
                            <textarea id="message" name="message" className="form-textarea" rows="3" placeholder="I'm interested in ROI details, Beraban Lofts..."></textarea>
                        </div>

                        {/* HoneyPot to prevent spam */}
                        <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

                        <button type="submit" className="form-btn" disabled={loading}>
                            {loading ? 'Sending...' : 'Get In Touch'}
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default PertamaInvestPage;
