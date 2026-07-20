import React, { useEffect, useState } from 'react';
import { ChevronDownIcon, ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './FlyBeforeYouBuyPage.css';
import { fetchPageAssets } from '../services/sanityService';

const FlyBeforeYouBuyPage = () => {
    const { t } = useTranslation();
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [assets, setAssets] = useState({});

    useEffect(() => {
        const loadAssets = async () => {
            const fetched = await fetchPageAssets(['fly-campaign-hero', 'fly-campaign-exterior', 'fly-voucher']);
            const assetMap = {};
            fetched.forEach(a => { assetMap[a.identifier] = a.url; });
            setAssets(assetMap);
        };
        loadAssets();
    }, []);

    const toggleTerms = () => {
        setIsTermsOpen(!isTermsOpen);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const form = e.target;
        const formData = new FormData(form);

        formData.append("access_key", "9c254b58-ce4a-412d-b82a-c854756430ee");
        formData.append("subject", "New Lead: Fly Before You Buy Campaign");
        formData.append("from_name", "Fly Before You Buy");

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            if (response.ok) {
                setSubmitted(true);
                // Scroll to form top for success message
                const formSection = document.getElementById('enquire');
                if (formSection) {
                    formSection.scrollIntoView({ behavior: 'smooth' });
                }
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

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="fly-campaign-page" style={assets['fly-bg'] ? { '--hero-bg-image': `url(${assets['fly-bg']})` } : {}}>
            <Navbar />

            {/* Hero Section */}
            <header className="fly-hero">
                <div className="fly-hero-content">
                    <h1>Fly Before You Buy</h1>
                    <p>Experience paradise before you invest.</p>
                    <a href="#enquire" className="btn-gold">Start Your Journey</a>
                </div>
            </header>

            {/* Value Propositions */}
            <section className="fly-intro">
                <div className="fly-intro-grid">
                    <div className="fly-feature-card">
                        <h3>Prime Location</h3>
                        <p>Situated in the heart of Bali’s most desirable district. Our properties offer high rental yield potential and significant capital growth opportunities.</p>
                    </div>
                    <div className="fly-feature-card">
                        <h3>Managed Luxury</h3>
                        <p>Architecturally designed units fully managed by Pertama Properties. We ensure a seamless, hands-off ownership experience for all our investors.</p>
                    </div>
                    <div className="fly-feature-card">
                        <h3>Invest with Confidence</h3>
                        <p>We believe seeing is believing. We have created two unique pathways for you to verify the quality and potential before you commit.</p>
                    </div>
                </div>
            </section>

            {/* Whole Unit Experience */}
            <section className="fly-experience">
                <div className="fly-section-header">
                    <h2>The Inspection Experience</h2>
                    <p>For investors considering full unit ownership</p>
                </div>

                <div className="fly-split-layout">
                    <div className="fly-text-content">
                        <h3>Fly to Bali on Us</h3>
                        <p>Serious about a full investment? We will fly you to Bali to inspect the project site personally. During your visit, you will enjoy luxury accommodation in one of Pertama Properties’ existing premium units.</p>

                        <ul className="fly-list">
                            <li>Flights & Accommodation included</li>
                            <li>Personal site tour & consultation</li>
                            <li>Costs covered upon purchase</li>
                        </ul>

                        <div className="fly-highlight-box">
                            <h4>How it works</h4>
                            <p>Your holding deposit is adjusted from $750 to <strong>$2,500</strong>. If you proceed with the purchase, all trip costs are covered by us. If you choose not to proceed, costs are simply deducted from your deposit.</p>
                        </div>
                    </div>
                    <div className="fly-image-content">
                        {/* Placeholder for an experience/luxury image */}
                        {assets['fly-exterior'] && (
                            <img
                                src={assets['fly-exterior']}
                                alt="Luxury Accommodation"
                                style={{ width: '100%', borderRadius: '8px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                            />
                        )}
                    </div>
                </div>
            </section>

            {/* Fractional Ownership - Freedom Voucher */}
            <section className="fly-fractional">
                <div className="fly-split-layout">
                    <div className="fly-image-content">
                        {/* Placeholder for voucher/travel image */}
                        {assets['fly-voucher'] && <img src={assets['fly-voucher']} alt="Gift Voucher" style={{ width: '100%', borderRadius: '8px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }} />}
                    </div>
                    <div className="fly-text-content">
                        <h3>The Freedom Voucher</h3>
                        <p>Buying a fraction? We believe your rewards should be just as flexible as your investment. Upon successful completion of your purchase, you will receive a high-value Voucher facilitated by Prezzee.</p>

                        <ul className="fly-list">
                            <li>Redeemable at Flight Centre</li>
                            <li>Use for a holiday of your choosing</li>
                            <li>Sent directly after settlement</li>
                        </ul>

                        <div className="fly-highlight-box">
                            <h4>Flexibility</h4>
                            <p>Your Prezzee Smart eGift Card gives you the power of choice. Redeem it at hundreds of top retailers to plan your perfect getaway.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA / Form */}
            <section id="enquire" className="lead-capture">
                <div className="container">
                    <div className="form-container glass-card">
                        {submitted ? (
                            <div className="form-success-message animate-fade-in">
                                <div className="success-icon-box">
                                    <SparklesIcon className="pkg-icon" style={{ color: 'var(--accent-gold)', width: '48px', height: '48px' }} />
                                </div>
                                <h2>Application Received</h2>
                                <p>Thank you for your interest in the "Fly Before You Buy" experience. Our investment team will review your eligibility and contact you within 24 hours.</p>
                                <button onClick={() => setSubmitted(false)} className="btn-gold">Send Another Discovery Request</button>
                            </div>
                        ) : (
                            <>
                                <div className="form-header">
                                    <h2>Start Your Discovery</h2>
                                    <p>Spaces for our "Fly Before You Buy" program are strictly limited. Contact our team to verify eligibility.</p>
                                </div>
                                <form className="campaign-form" onSubmit={handleSubmit}>
                                    <div className="form-row">
                                        <div className="input-group">
                                            <label>First Name</label>
                                            <input type="text" name="first_name" placeholder="John" required />
                                        </div>
                                        <div className="input-group">
                                            <label>Last Name</label>
                                            <input type="text" name="last_name" placeholder="Doe" required />
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label>Email Address</label>
                                        <input type="email" name="email" placeholder="john@example.com" required />
                                    </div>
                                    <div className="input-group">
                                        <label>WhatsApp / Phone</label>
                                        <input type="tel" name="phone" placeholder="+61 400 000 000" required />
                                    </div>
                                    <div className="input-group">
                                        <label>Investment Intent</label>
                                        <select name="investment_intent" required>
                                            <option value="">Select Option</option>
                                            <option value="up to 125k">Up to A$125k</option>
                                            <option value="up to 250k">Up to A$250k</option>
                                            <option value="375+">A$375k or more</option>
                                        </select>
                                    </div>
                                    <input type="checkbox" name="botcheck" style={{ display: 'none' }} />
                                    <button type="submit" className="btn-gold full-width" disabled={loading}>
                                        {loading ? 'Processing...' : (
                                            <>
                                                Claim your Fly Before You Buy Experience
                                                <ArrowRightIcon className="btn-icon-inside" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Terms and Conditions */}
            <section className="fly-terms">
                <div className="container fly-terms-container">
                    <div
                        className={`fly-terms-header ${isTermsOpen ? 'active' : ''}`}
                        onClick={toggleTerms}
                    >
                        <h3>Terms and Conditions</h3>
                        <ChevronDownIcon className="fly-terms-icon" style={{ width: '24px', height: '24px' }} />
                    </div>
                    <div className={`fly-terms-content ${isTermsOpen ? 'open' : ''}`}>
                        <p><strong>General</strong></p>
                        <p>This "Fly Before You Buy" campaign is promoted by APFG in conjunction with Beraban Luxury Lofts and Pertama Properties. The offer is valid for new inquiries only for a limited time.</p>

                        <h4>1. Whole Unit Ownership - Site Inspection</h4>
                        <p>Eligibility for the Bali site inspection requires an increase of the standard holding deposit from $750 AUD to $2,500 AUD. This amount is held in trust. Pertama Properties will arrange economy flights and accommodation in a Pertama managed property for the duration of the inspection (maximum 3 nights, unless otherwise agreed).</p>

                        <p><strong>Purchase:</strong> If the client proceeds to unconditional exchange of contracts for a whole unit, the costs of the flights and accommodation are fully absorbed by the developer (Pertama Properties), and the $2,500 applies towards the purchase price.</p>

                        <p><strong>Non-Purchase:</strong> If the client chooses not to proceed after the trip, the direct costs incurred for flights and accommodation will be deducted from the $2,500 holding deposit. The remaining balance of the deposit will be refunded to the client.</p>

                        <h4>2. Fractional Ownership - Holiday Voucher</h4>
                        <p>Clients purchasing a fractional unit are not eligible for the pre-purchase site inspection trip. Instead, they are eligible to receive a Flight Centre voucher, facilitated via a Prezzee Smart eGift Card.</p>

                        <p><strong>Redemption:</strong> The voucher will be issued within 30 days of the successful settlement and completion of the fractional unit purchase. The value of the voucher is determined by the specific tier of fractional investment purchased. The voucher is redeemable at Flight Centre or any other retailer supported by the Prezzee platform. This benefit is not exchangeable for cash or a discount on the unit price.</p>

                        <p>View accepted retailers at <a href="https://www.prezzee.com.au" target="_blank" rel="noopener noreferrer">https://www.prezzee.com.au</a></p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default FlyBeforeYouBuyPage;
