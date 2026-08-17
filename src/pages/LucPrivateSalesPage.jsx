import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
    HomeIcon, 
    BuildingOfficeIcon, 
    SparklesIcon, 
    CheckBadgeIcon,
    ArrowRightIcon,
    EnvelopeIcon,
    PhoneIcon,
    UserIcon
} from '@heroicons/react/24/outline';
import './LucPrivateSalesPage.css';

import { fetchPageAssets } from '../services/sanityService';

const LucPrivateSalesPage = () => {
    const { t } = useTranslation();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [assets, setAssets] = useState({});

    useEffect(() => {
        const loadAssets = async () => {
            const fetched = await fetchPageAssets(['luc-pool', 'luc-bedroom']);
            const assetMap = {};
            fetched.forEach(a => { assetMap[a.identifier] = a.url; });
            setAssets(assetMap);
        };
        loadAssets();
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const form = e.target;
        const formData = new FormData(form);

        formData.append("access_key", "f0f64dac-0d4a-4d5e-b2a5-9a2959d0fb3b");
        formData.append("subject", "New EOI: The Luc Private Sales");
        formData.append("from_name", "Arcadea Private Sales");

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

    const unitTypes = [
        { id: 'type-a', name: 'Type A Villa', beds: '2 Bedroom', status: 'Private Resale', desc: 'Luxury living with expansive private spaces.', icon: <HomeIcon /> },
        { id: 'type-b', name: 'Type B Villa', beds: '2 Bedroom', status: 'Private Resale', desc: 'Sleek design with optimized natural light.', icon: <HomeIcon /> },
        { id: 'type-c', name: 'Type C Villa', beds: '2 Bedroom', status: 'Private Resale', desc: 'Contemporary layout for modern lifestyles.', icon: <HomeIcon /> },
        { id: 'type-d', name: 'Type D Villa', beds: '3 Bedroom', status: 'Private Resale', desc: 'Grand family residence with premium finishes.', icon: <HomeIcon /> },
        { id: 'type-e', name: 'Type E Villa', beds: '2 Bedroom', status: 'Developer Stock', desc: 'Final release stock direct from developer.', icon: <SparklesIcon />, featured: true },
        { id: 'hotel-room', name: 'Courtyard Hotel Room', beds: 'Studio', status: 'Private Resale', desc: 'High-yield hospitality investment opportunity.', icon: <BuildingOfficeIcon /> },
    ];

    if (submitted) {
        return (
            <div className="luc-private-page success-state">
                <div className="glass-container animate-in">
                    <div className="success-icon-wrapper">
                        <CheckBadgeIcon className="success-icon" />
                    </div>
                    <h2 className="luc-heading">Expression of Interest Received</h2>
                    <p className="luc-text">
                        Thank you for your interest in The Luc Private Sales collection. 
                        Our specialized resale team will review your requirements and contact you shortly with available inventory and pricing.
                    </p>
                    <div className="success-actions">
                        <Link to="/properties" className="btn-primary">Return to Portfolio</Link>
                        <button className="btn-secondary" onClick={() => setSubmitted(false)}>Send Another Inquiry</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="luc-private-sales-page" style={assets['luc-pool'] ? { '--hero-bg-image': `url(${assets['luc-pool']})` } : {}}>
            {/* Hero Section */}
            <section className="luc-hero">
                <div className="hero-overlay"></div>
                <div className="hero-content container animate-in">
                    <div className="hero-badge">Exclusive Opportunity</div>
                    <h1 className="hero-title">The Luc <span className="accent">Private Sales</span></h1>
                    <p className="hero-subtitle">
                        Access premium inventory at Berawa's most iconic development. 
                        Secure resale units from existing owners in projects otherwise sold out.
                    </p>
                    <a href="#eoi-form" className="btn-primary hero-btn">Register Your Interest</a>
                </div>
            </section>

            {/* Information Section */}
            <section className="luc-info">
                <div className="container">
                    <div className="info-grid">
                        <div className="info-text animate-in">
                            <h2 className="luc-heading">Why Private Resale?</h2>
                            <p className="luc-text">
                                The Luc is one of the most sought-after developments in Bali. While developer stock is limited, 
                                the private resale market offers a unique chance to enter the project at various price points and configurations. 
                            </p>
                            <div className="features-list">
                                <div className="feature-item">
                                    <CheckBadgeIcon className="feature-icon" />
                                    <span>Immediate Capital Appreciation potential</span>
                                </div>
                                <div className="feature-item">
                                    <CheckBadgeIcon className="feature-icon" />
                                    <span>Specific Unit Locations often unavailable elsewere</span>
                                </div>
                                <div className="feature-item">
                                    <CheckBadgeIcon className="feature-icon" />
                                    <span>Flexible Pricing from motivated owners</span>
                                </div>
                            </div>
                        </div>
                        <div className="info-image animate-in">
                            <div className="glass-card">
                                {assets['luc-bedroom'] && (
                                    <img
                                        src={assets['luc-bedroom']}
                                        alt="Master Bedroom"
                                        className="luc-visual"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Unit Grid */}
            <section className="luc-units">
                <div className="container">
                    <h2 className="luc-heading centered">Available Configurations</h2>
                    <p className="luc-text centered max-w-700">
                        We facilitate resales across the entire spectrum of The Luc's architecture. 
                        From boutique hotel rooms to grand family villas.
                    </p>
                    <div className="unit-grid">
                        {unitTypes.map((unit) => (
                            <div key={unit.id} className={`unit-card glass-card animate-in ${unit.featured ? 'featured' : ''}`}>
                                <div className="unit-icon-box">{unit.icon}</div>
                                <div className="unit-status-tag">{unit.status}</div>
                                <h3 className="unit-name">{unit.name}</h3>
                                <div className="unit-beds">{unit.beds}</div>
                                <p className="unit-desc">{unit.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Video Showcase Section */}
            <section className="luc-video-section">
                <div className="container">
                    <div className="video-grid animate-in">
                        <div className="video-column glass-card">
                            <div className="video-container">
                                <iframe 
                                    width="560" 
                                    height="315" 
                                    src="https://www.youtube.com/embed/D8twbWrbsz4" 
                                    title="The Luc Showcase Video" 
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                        <div className="video-text-column">
                            <h2 className="luc-heading">Experience the Quality</h2>
                            <p className="luc-text">
                                Take a drone tour of the newly finished hotel and explore the exquisite interiors of our Type E villas. 
                                Our commitment to premium finishes and architectural excellence is visible in every frame.
                            </p>
                            <div className="video-features">
                                <div className="feature-mini">
                                    <SparklesIcon className="mini-icon" />
                                    <span>Premium Finishes</span>
                                </div>
                                <div className="feature-mini">
                                    <SparklesIcon className="mini-icon" />
                                    <span>Architectural Excellence</span>
                                </div>
                            </div>
                            <a href="#eoi-form" className="btn-secondary">Ask About This Property</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* EOI Form */}
            <section id="eoi-form" className="luc-form-section">
                <div className="container">
                    <div className="form-wrapper glass-card animate-in">
                        <div className="form-header">
                            <h2 className="luc-heading">Expression of Interest</h2>
                            <p className="luc-text">Leave your details and unit preferences below. Our team will match you with current private listings.</p>
                        </div>
                        
                        <form className="luc-form" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label><UserIcon className="input-icon" /> Full Name</label>
                                    <input type="text" name="name" required placeholder="John Doe" />
                                </div>
                                <div className="form-group">
                                    <label><EnvelopeIcon className="input-icon" /> Email Address</label>
                                    <input type="email" name="email" required placeholder="john@example.com" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label><PhoneIcon className="input-icon" /> WhatsApp / Phone</label>
                                    <input type="tel" name="phone" required placeholder="+61 400 000 000" />
                                </div>
                                <div className="form-group">
                                    <label>Interested In</label>
                                    <select name="unit_type_interest" required>
                                        <option value="">Select Unit Type</option>
                                        {unitTypes.map(u => (
                                            <option key={u.id} value={u.name}>{u.name} ({u.beds})</option>
                                        ))}
                                        <option value="Any / Multiple">Any / Multiple</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label>Preferred Price Range (Optional)</label>
                                <input type="text" name="price_range" placeholder="e.g. $800k - $1.2m" />
                            </div>

                            <div className="form-group full-width">
                                <label>Additional Notes</label>
                                <textarea name="message" rows="4" placeholder="Any specific requirements or questions?"></textarea>
                            </div>

                            <input type="checkbox" name="botcheck" style={{ display: 'none' }} />

                            <button type="submit" className="btn-primary full-width" disabled={loading}>
                                {loading ? 'Processing...' : 'Submit Interest'}
                                <ArrowRightIcon className="btn-icon" />
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LucPrivateSalesPage;
