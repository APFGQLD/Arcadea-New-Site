import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckBadgeIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import CinematicHero from '../components/CinematicHero';
import useScrollReveal from '../hooks/useScrollReveal';
import usePageTitle from '../hooks/usePageTitle';
import { fetchPageAssets } from '../services/sanityService';
import './EditorialPage.css';
import './LucPrivateSalesPage.css';

const unitTypes = [
    { id: 'type-a', name: 'Type A Villa', beds: '2 Bedroom', status: 'Private Resale', desc: 'Luxury living with expansive private spaces.' },
    { id: 'type-b', name: 'Type B Villa', beds: '2 Bedroom', status: 'Private Resale', desc: 'Sleek design with optimised natural light.' },
    { id: 'type-c', name: 'Type C Villa', beds: '2 Bedroom', status: 'Private Resale', desc: 'Contemporary layout for modern lifestyles.' },
    { id: 'type-d', name: 'Type D Villa', beds: '3 Bedroom', status: 'Private Resale', desc: 'Grand family residence with premium finishes.' },
    { id: 'type-e', name: 'Type E Villa', beds: '2 Bedroom', status: 'Developer Stock', desc: 'Final release stock direct from developer.', featured: true },
    { id: 'hotel-room', name: 'Courtyard Hotel Room', beds: 'Studio', status: 'Private Resale', desc: 'High-yield hospitality investment opportunity.' },
];

const benefits = [
    'Immediate capital appreciation potential',
    'Specific unit locations often unavailable elsewhere',
    'Flexible pricing from motivated owners'
];

const LucPrivateSalesPage = () => {
    usePageTitle('The Luc Private Sales', {
        description: "Access resale villas and hotel rooms at The Luc, Berawa — premium inventory from existing owners in a development that's otherwise sold out."
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [assets, setAssets] = useState({});
    const pageRef = useRef(null);

    useScrollReveal(pageRef, 0.15, [assets, submitted]);

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

    if (submitted) {
        return (
            <div className="editorial-page luc-ps-page luc-ps-success" ref={pageRef}>
                <div className="ed-wide ed-panel luc-ps-success-panel">
                    <CheckBadgeIcon className="luc-ps-success-icon" aria-hidden="true" />
                    <span className="ed-eyebrow">The Luc Private Sales</span>
                    <h1 className="ed-title">Expression of Interest Received</h1>
                    <p className="luc-ps-success-text">
                        Thank you for your interest in The Luc Private Sales collection.
                        Our specialised resale team will review your requirements and contact you shortly with available inventory and pricing.
                    </p>
                    <div className="luc-ps-success-actions">
                        <Link to="/properties/#island" className="ed-text-link">Return to Portfolio &rarr;</Link>
                        <button type="button" className="ed-text-link luc-ps-link-button" onClick={() => setSubmitted(false)}>
                            Send Another Enquiry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="editorial-page luc-ps-page" ref={pageRef}>
            <CinematicHero
                image={assets['luc-pool']}
                imageAlt="The Luc pool"
                align="left"
                tag="Exclusive Opportunity"
                title={<>The Luc <em className="luc-ps-accent">Private Sales</em></>}
                subtitle="Access premium inventory at Berawa's most iconic development. Secure resale units from existing owners in projects otherwise sold out."
                action={<a href="#eoi-form" className="cine-hero-link">Register Your Interest &rarr;</a>}
            />

            <div className="cine-hero-follow">
                {/* Why private resale */}
                <section className="ed-section luc-ps-why">
                    <div className="ed-wide ed-split">
                        <div className="ed-split-text reveal reveal-up">
                            <span className="ed-eyebrow">Private Resale</span>
                            <h2 className="ed-title">Why private resale?</h2>
                            <p>
                                The Luc is one of the most sought-after developments in Bali. While developer stock is limited,
                                the private resale market offers a unique chance to enter the project at various price points and configurations.
                            </p>
                            <ul className="luc-ps-benefits">
                                {benefits.map(item => <li key={item}>{item}</li>)}
                            </ul>
                        </div>
                        <div className="ed-split-image reveal reveal-up delay-200">
                            {assets['luc-bedroom'] && (
                                <img src={assets['luc-bedroom']} alt="Master bedroom at The Luc" loading="lazy" decoding="async" />
                            )}
                        </div>
                    </div>
                </section>

                {/* Configurations */}
                <section className="ed-section">
                    <div className="ed-header reveal reveal-up">
                        <span className="ed-eyebrow">Configurations</span>
                        <h2 className="ed-title">Available configurations</h2>
                        <p className="ed-subtitle">
                            We facilitate resales across the entire spectrum of The Luc's architecture,
                            from boutique hotel rooms to grand family villas.
                        </p>
                    </div>
                    <div className="ed-wide luc-ps-units">
                        {unitTypes.map((unit, idx) => (
                            <div
                                key={unit.id}
                                className={`luc-ps-unit reveal reveal-up delay-${(idx % 3 + 1) * 100} ${unit.featured ? 'featured' : ''}`}
                            >
                                <span className="luc-ps-unit-status">{unit.status}</span>
                                <h3 className="luc-ps-unit-name">{unit.name}</h3>
                                <span className="luc-ps-unit-beds">{unit.beds}</span>
                                <p className="luc-ps-unit-desc">{unit.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Video */}
                <section className="ed-section">
                    <div className="ed-wide luc-ps-video">
                        <div className="luc-ps-video-frame reveal reveal-up">
                            <iframe
                                src="https://www.youtube-nocookie.com/embed/D8twbWrbsz4"
                                title="The Luc Showcase Video"
                                loading="lazy"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <div className="luc-ps-video-text reveal reveal-up delay-200">
                            <span className="ed-eyebrow">The Film</span>
                            <h2 className="ed-title">Experience the quality</h2>
                            <p>
                                Take a drone tour of the newly finished hotel and explore the exquisite interiors of our Type E villas.
                                Our commitment to premium finishes and architectural excellence is visible in every frame.
                            </p>
                            <ul className="luc-ps-tags">
                                <li>Premium Finishes</li>
                                <li>Architectural Excellence</li>
                            </ul>
                            <a href="#eoi-form" className="ed-text-link">Ask About This Property &rarr;</a>
                        </div>
                    </div>
                </section>

                {/* Expression of interest */}
                <section id="eoi-form" className="ed-section luc-ps-form-section">
                    <div className="ed-wide ed-panel luc-ps-form-panel reveal reveal-up">
                        <div className="luc-ps-form-intro">
                            <span className="ed-eyebrow">Register Your Interest</span>
                            <h2 className="ed-title">Expression of Interest</h2>
                            <p>Leave your details and unit preferences below. Our team will match you with current private listings.</p>
                        </div>

                        <form className="luc-ps-form" onSubmit={handleSubmit}>
                            <div className="luc-ps-field">
                                <label htmlFor="luc-name">Full Name</label>
                                <input id="luc-name" type="text" name="name" required placeholder="Your full name" />
                            </div>
                            <div className="luc-ps-field">
                                <label htmlFor="luc-email">Email Address</label>
                                <input id="luc-email" type="email" name="email" required placeholder="your@email.com" />
                            </div>
                            <div className="luc-ps-field">
                                <label htmlFor="luc-phone">WhatsApp / Phone</label>
                                <input id="luc-phone" type="tel" name="phone" required placeholder="+61 400 000 000" />
                            </div>
                            <div className="luc-ps-field">
                                <label htmlFor="luc-unit">Interested In</label>
                                <select id="luc-unit" name="unit_type_interest" required defaultValue="">
                                    <option value="" disabled>Select unit type</option>
                                    {unitTypes.map(u => (
                                        <option key={u.id} value={u.name}>{u.name} ({u.beds})</option>
                                    ))}
                                    <option value="Any / Multiple">Any / Multiple</option>
                                </select>
                            </div>
                            <div className="luc-ps-field full">
                                <label htmlFor="luc-price">Preferred Price Range (Optional)</label>
                                <input id="luc-price" type="text" name="price_range" placeholder="e.g. $800k - $1.2m" />
                            </div>
                            <div className="luc-ps-field full">
                                <label htmlFor="luc-message">Additional Notes</label>
                                <textarea id="luc-message" name="message" rows="4" placeholder="Any specific requirements or questions?"></textarea>
                            </div>

                            <input type="checkbox" name="botcheck" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />

                            <button type="submit" className="luc-ps-submit" disabled={loading}>
                                {loading ? 'Sending…' : 'Submit Interest'}
                                {!loading && <ArrowRightIcon className="luc-ps-submit-icon" aria-hidden="true" />}
                            </button>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default LucPrivateSalesPage;
