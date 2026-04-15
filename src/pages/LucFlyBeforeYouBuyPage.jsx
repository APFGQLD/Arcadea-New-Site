import React, { useEffect, useState } from 'react';
import {
    ChevronDownIcon,
    RocketLaunchIcon,
    HomeModernIcon,
    SparklesIcon,
    TicketIcon,
    BuildingStorefrontIcon,
    CameraIcon,
    PresentationChartLineIcon,
    MapPinIcon,
    UserGroupIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './LucFlyBeforeYouBuyPage.css';

const LucFlyBeforeYouBuyPage = () => {
    const { t } = useTranslation();
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const toggleTerms = () => {
        setIsTermsOpen(!isTermsOpen);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const form = e.target;
        const formData = new FormData(form);

        formData.append("access_key", "85e4172e-f3c6-4036-a366-7d50f8719832");
        formData.append("subject", "New Lead: Luc Fly Before You Buy Experience");
        formData.append("from_name", "The Luc Campaign");

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

    const investorPackage = [
        {
            title: "Return Flights for 2",
            desc: "From any major Australian capital city to Denpasar.",
            icon: <RocketLaunchIcon className="pkg-icon" />
        },
        {
            title: "3 Days / 2 Nights",
            desc: "Stay in our flagship Sky Suite—the pinnacle of TUI BLUE luxury.",
            icon: <HomeModernIcon className="pkg-icon" />
        },
        {
            title: "The VIP Treatment",
            desc: "Private airport transfers and daily gourmet breakfast included.",
            icon: <SparklesIcon className="pkg-icon" />
        },
        {
            title: "Signature Dining",
            desc: "An intimate dinner for two on our deck overlooking the sunset.",
            icon: <SparklesIcon className="pkg-icon" />
        },
        {
            title: "Elite Access",
            desc: "Complimentary VIP access to ATLAS Beach Club—the world's largest beach club.",
            icon: <TicketIcon className="pkg-icon" />
        },
        {
            title: "The Morning Ritual",
            desc: "Premium Starbucks voucher to kickstart your discovery.",
            icon: <BuildingStorefrontIcon className="pkg-icon" />
        }
    ];

    return (
        <div className="fly-campaign-page luc-theme">
            <Navbar />

            {/* Hero Section */}
            <header className="fly-hero luc-hero">
                <div className="hero-overlay"></div>
                <div className="fly-hero-content">
                    <div className="badge animate-fade-in">Exclusive Opportunity</div>
                    <h1 className="animate-slide-up">Don't Just Invest in the Future of Bali. <span className="gold-text">Experience it.</span></h1>
                    <p className="animate-slide-up delay-1">
                        Join us for an exclusive 3-Day Investor "Fly Before You Buy" Experience at TUI BLUE Berawa.
                        We’ll handle the flights and the 5-star luxury—you just bring your vision.
                    </p>
                    <div className="hero-actions animate-slide-up delay-2">
                        <a href="#enquire" className="btn-gold large">Claim your Fly Before You Buy Experience</a>
                    </div>
                </div>
            </header>

            {/* Due Diligence Section */}
            <section className="due-diligence">
                <div className="container">
                    <div className="due-diligence-grid">
                        <div className="text-content">
                            <h2 className="section-title">The Ultimate Due Diligence Trip</h2>
                            <p className="lead">
                                Why look at brochures when you can walk the halls, taste the menu, and feel the energy of the world’s most vibrant lifestyle hub?
                            </p>
                            <p>
                                For a limited time, we are inviting serious investors to experience TUI BLUE Berawa first-hand. This isn't just a site visit; it's an immersion into the lifestyle that will drive your investment returns.
                            </p>
                        </div>
                        <Link to="/project/luc" className="video-placeholder-box">
                            <div className="glass-card centered-content">
                                <div className="play-button-visual">
                                    <CameraIcon className="play-icon" />
                                </div>
                                <span className="video-label">Experience TUI BLUE Berawa</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Package Grid */}
            <section className="investor-package">
                <div className="container">
                    <h2 className="section-title centered">Your 3-Day Investor Package Includes</h2>
                    <div className="package-grid">
                        {investorPackage.map((item, index) => (
                            <div key={index} className="package-card glass-card">
                                <div className="icon-box">{item.icon}</div>
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sky Suite Feature */}
            <section className="sky-suite-feature">
                <div className="container">
                    <div className="split-feature">
                        <div className="image-side">
                            <img
                                src="http://thelucnews.com/wp-content/uploads/2026/04/ACC_AC133190918-TB-Berawa_Sky-Suite_Bedroom-240-scaled.jpg"
                                alt="Sky Suite Interior"
                                className="main-img"
                            />
                        </div>
                        <div className="text-side">
                            <h2 className="section-title">Elevated Living. <br /><span className="gold-text">High-Yield Potential.</span></h2>
                            <p>
                                Your stay will be centered in our Sky Suite—an 88sqm masterclass in tropical modernism. Designed to command the highest nightly rates in the Berawa market.
                            </p>
                            <ul className="feature-list">
                                <li><strong>The Super King Bed:</strong> A custom 200x200 cloud-like sleep experience.</li>
                                <li><strong>A Private Sanctuary:</strong> Oversized balcony overlooking the Berawa skyline.</li>
                                <li><strong>5-Star Tech:</strong> Google TV, espresso machine, and a curated minibar.</li>
                                <li><strong>Sensory Luxury:</strong> Indulge in custom-made "Skin Dewi" fragrances.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Ecosystem Section */}
            <section className="ecosystem">
                <div className="container">
                    <div className="ecosystem-header">
                        <h2 className="section-title centered">A 5-Star Ecosystem at Your Fingertips</h2>
                        <p className="centered max-w-700">
                            Investing in TUI BLUE Berawa means owning a piece of The Luc—Canggu’s most sophisticated commercial and residential precinct.
                        </p>
                    </div>
                    <div className="ecosystem-grid">
                        <div className="eco-card glass-card">
                            <div className="eco-img-box">
                                <img src="http://thelucnews.com/wp-content/uploads/2026/04/ACC_AC133190918-TB-Berawa_Sauna-033-scaled.jpg" alt="Wellness" />
                            </div>
                            <div className="eco-info">
                                <h3>The Wellness Hub</h3>
                                <p>Professional fitness center, yoga studio, ice bath, and world-class sauna.</p>
                            </div>
                        </div>
                        <div className="eco-card glass-card">
                            <div className="eco-img-box">
                                <img src="https://thelucnews.com/wp-content/uploads/2026/04/Bachelor-Padel-celebration-for-Ben-Ana-%F0%9F%8E%BE%E2%9C%A8Fun-rallies-great-laughs-and-unforgettable-moments.jpg" alt="Sport" />
                            </div>
                            <div className="eco-info">
                                <h3>Sport & Social</h3>
                                <p>Holywings Padel Club, featuring four tournament-standard courts on-site.</p>
                            </div>
                        </div>
                        <div className="eco-card glass-card">
                            <div className="eco-img-box">
                                <img src="http://thelucnews.com/wp-content/uploads/2026/04/ACC_AC133190918-TB-Berawa_Sundowner-Experiences_Models-264-scaled.jpg" alt="Sunset" />
                            </div>
                            <div className="eco-info">
                                <h3>The Golden Hour</h3>
                                <p>Rooftop pool views of the legendary Bali sunset with the island's elite.</p>
                            </div>
                        </div>
                        <div className="eco-card glass-card">
                            <div className="eco-img-box">
                                <img src="https://atlasbeachfest.com/images/about/highlight.jpg" alt="Atlas" />
                            </div>
                            <div className="eco-info">
                                <h3>The Atlas Advantage</h3>
                                <p>700m from ATLAS Beach Fest—world-class entertainment at your doorstep.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Market Data */}
            <section className="market-boom">
                <div className="container">
                    <div className="boom-grid glass-card">
                        <div className="boom-header">
                            <h2 className="section-title">Berawa: The Center of the Bali Boom</h2>
                            <p>Canggu/Berawa is the economic engine of Bali. The capital appreciation window is wide open.</p>
                        </div>
                        <div className="data-points">
                            <div className="data-item">
                                <PresentationChartLineIcon className="data-icon" />
                                <div>
                                    <h4>Unrivaled ROI</h4>
                                    <p>Projected yields of over 10% and growing due to massive digital nomad demand.</p>
                                </div>
                            </div>
                            <div className="data-item">
                                <MapPinIcon className="data-icon" />
                                <div>
                                    <h4>Infrastructure Growth</h4>
                                    <p>New North Bali Airport approved and "Managed Resort" model dominance for 2026.</p>
                                </div>
                            </div>
                            <div className="data-item">
                                <UserGroupIcon className="data-icon" />
                                <div>
                                    <h4>Professional Management</h4>
                                    <p>Backed by the global power of TUI BLUE for world-class maintenance.</p>
                                </div>
                            </div>
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
                                    <SparklesIcon className="pkg-icon" style={{ color: 'var(--gold-primary)', width: '48px', height: '48px' }} />
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
                                            <option value="individual">Up to A$125k</option>
                                            <option value="fractional">Up to A$250k</option>
                                            <option value="portfolio">A$375k or more</option>
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
                        <h3>Investment Experience Terms</h3>
                        <ChevronDownIcon className="fly-terms-icon" style={{ width: '24px', height: '24px' }} />
                    </div>
                    <div className={`fly-terms-content ${isTermsOpen ? 'open' : ''}`}>
                        <p><strong>Eligibility</strong></p>
                        <p>This program is strictly for qualified investors considering full or fractional ownership at The Luc / TUI BLUE Berawa. Eligibility is determined by the Arcadea Property investment team upon initial consultation.</p>

                        <h4>The Fine Print</h4>
                        <p>The Fly Before You Buy program is available for premier investors with a target entry of $375,000 or above. For investments below this level, a travel reimbursement voucher is provided following the successful settlement of the asset.</p>

                        <h4>1. The Experience Credit (Rebate)</h4>
                        <p>Should a client proceed to unconditional exchange of contracts within 60 days of the experience completion, the direct costs incurred for the "Fly Before You Buy" package (up to an agreed cap) will be applied as a credit toward the final purchase settlement.</p>

                        <h4>2. Participation & Deposit</h4>
                        <p>Participation requires a formal Expression of Interest and a $2,500 holding deposit. Flights included in this package are from the nearest major Australian capital city hub.</p>
                        <p>If you move forward with the purchase, this deposit is applied directly to your investment, and TUI BLUE Berawa covers the entirety of your travel and hospitality costs.</p>
                        <p>If you choose not to proceed, the actual cost of your flights plus a $600 suite and inclusions fee will be deducted from the deposit, with the remaining balance returned to you.</p>

                        <h4>3. ATLAS & Partner Benefits</h4>
                        <p>Access to ATLAS Beach Club and other precinct amenities are subject to availability and the partner's standard operating terms. Arcadea Property provides admission and VIP seating arrangements as specified in the individual package itinerary.</p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LucFlyBeforeYouBuyPage;
