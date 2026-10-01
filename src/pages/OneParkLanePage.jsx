import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';
import useScrollReveal from '../hooks/useScrollReveal';
import { fetchPageAssets } from '../services/sanityService';
import { rafThrottle } from '../utils/rafThrottle';
import EnquiryForm from '../components/EnquiryForm';
import './EditorialPage.css';
import './OneParkLanePage.css';

const stats = [
    { value: '101', label: 'Storeys' },
    { value: '197', label: 'Premium Apartments' },
    { value: '2028', label: 'Expected Completion' }
];

const features = [
    {
        title: 'Architectural Excellence',
        text: '101 storey residential tower with 60 storey commercial tower connected by a stunning skybridge at level 22.'
    },
    {
        title: 'Premium Location',
        text: 'Located at 1 Park Lane, Southport – the heart of Gold Coast’s premier business and lifestyle precinct.'
    },
    {
        title: 'Luxury Finishes',
        text: 'Every apartment features premium finishes, floor to ceiling windows, and spectacular views.'
    }
];

const amenities = [
    {
        asset: 'oneparklane-v04',
        title: 'Signature Restaurant & Bar',
        text: 'Fine dining experience with chef’s table and sky deck bar for entertaining.'
    },
    {
        asset: 'oneparklane-v07',
        title: 'Infinity Pool & Sky Deck',
        text: 'Relax in our stunning infinity pool with panoramic Gold Coast skyline views.'
    },
    {
        asset: 'oneparklane-v11',
        title: 'Cutting Edge Fitness Centre',
        text: 'Fully equipped gymnasium with the latest fitness technology and city views.'
    }
];

const requestOptions = ['General Enquiry', 'Request Brochure', 'Request Call Back', 'Pricing & Availability'];

const moreAmenities = ['Resident Lounge & Library', 'Landscaped Gardens', 'Private Dining Rooms', 'Sky Deck Function Spaces'];

const OneParkLanePage = () => {
    usePageTitle('One Park Lane', {
        description: "One Park Lane, Southport — 101-storey residential tower with 157 premium apartments in the heart of the Gold Coast's premier business and lifestyle precinct."
    });
    const trackRef = useRef(null);
    const contentRef = useRef(null);
    const pageRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [assets, setAssets] = useState({});
    const [requestType, setRequestType] = useState('General Enquiry');
    const navigate = useNavigate();

    // Next Steps buttons open the enquiry form below with the request preselected
    const openEnquiry = (type) => {
        setRequestType(type);
        document.getElementById('enquire')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    useScrollReveal(pageRef, 0.15, [assets]);

    useEffect(() => {
        const loadAssets = async () => {
            const fetched = await fetchPageAssets(['oneparklane-v03', 'oneparklane-v04', 'oneparklane-v07', 'oneparklane-v11']);
            const assetMap = {};
            fetched.forEach(a => { assetMap[a.identifier] = a.url; });
            setAssets(assetMap);
        };
        loadAssets();
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, []);

    // Pins the intro for the length of its 400vh track and reports how far
    // through it the visitor has scrolled (0 to 1), which drives the titles.
    useEffect(() => {
        const updateScrollPosition = () => {
            if (!trackRef.current || !contentRef.current) return;

            const scrollY = window.scrollY;
            const trackHeight = trackRef.current.offsetHeight;
            const windowHeight = window.innerHeight;
            const maxTranslate = trackHeight - windowHeight;
            const componentOffsetTop = trackRef.current.offsetTop;
            const relativeScroll = scrollY - componentOffsetTop;

            const translateY = Math.max(0, Math.min(relativeScroll, maxTranslate));
            contentRef.current.style.transform = `translate3d(0, ${translateY}px, 0)`;

            if (maxTranslate > 0) {
                setProgress(Math.max(0, Math.min(1, relativeScroll / maxTranslate)));
            }
        };
        const handleScroll = rafThrottle(updateScrollPosition);

        window.addEventListener('scroll', handleScroll, { passive: true });
        updateScrollPosition();

        // The gradient glows drift slightly with the mouse
        const updateMousePosition = (clientX, clientY) => {
            if (!contentRef.current) return;
            const x = (clientX / window.innerWidth - 0.5) * 100;
            const y = (clientY / window.innerHeight - 0.5) * 100;
            contentRef.current.style.setProperty('--mouse-x', `${x}`);
            contentRef.current.style.setProperty('--mouse-y', `${y}`);
        };
        const handleMouseMove = rafThrottle((e) => updateMousePosition(e.clientX, e.clientY));

        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
            handleScroll.cancel();
            handleMouseMove.cancel();
        };
    }, []);

    const getOpacity = (start, end) => {
        if (progress < start) return 0;
        if (progress >= end) return 1;
        return (progress - start) / (end - start);
    };

    const getFadeOut = (windowStart, windowEnd) => {
        if (progress < windowStart) return 1;
        if (progress >= windowEnd) return 0;
        return 1 - (progress - windowStart) / (windowEnd - windowStart);
    };

    const words = [['One', 0.35, 0.45], ['Park', 0.5, 0.6], ['Lane', 0.65, 0.75]];

    return (
        <div className="editorial-page opl-page" ref={pageRef}>
            {/* 1. Scroll-driven intro */}
            <div ref={trackRef} className="opl-hero-track">
                <div ref={contentRef} className="opl-js-sticky-content">
                    <div className="ed-wide opl-back">
                        <button className="ed-text-link opl-back-link" onClick={() => navigate('/properties/')}>
                            &larr; Back to Portfolio
                        </button>
                    </div>

                    {/* Background 1: drifting gold and teal glows */}
                    <div className="opl-hero-bg" style={{ opacity: getFadeOut(0.25, 0.45) }}>
                        <div className="opl-hero-gradient-bg">
                            <div className="opl-gradient-blob blob-1"></div>
                            <div className="opl-gradient-blob blob-2"></div>
                            <div className="opl-gradient-blob blob-3"></div>
                            <div className="opl-glass-overlay"></div>
                        </div>
                    </div>

                    {/* Background 2: the tower photo fades in */}
                    <div className="opl-hero-bg" style={{ opacity: getOpacity(0.25, 0.45) }}>
                        {assets['oneparklane-v03'] && (
                            <img src={assets['oneparklane-v03']} alt="One Park Lane Exterior" className="opl-main-image" />
                        )}
                        <div className="opl-overlay"></div>
                    </div>

                    {/* Opening line */}
                    <div
                        className="opl-layer"
                        style={{
                            opacity: getFadeOut(0.1, 0.3),
                            transform: `translateY(-${50 * (1 - getFadeOut(0.1, 0.3))}px)`
                        }}
                    >
                        <div className="opl-intro">
                            <span className="opl-intro-eyebrow">Southport, Gold Coast</span>
                            <h1 className="opl-title-init">Australia’s Newest Icon Rises</h1>
                        </div>
                    </div>

                    {/* "One Park Lane", one word at a time */}
                    <div className="opl-layer">
                        <div className="opl-title-seq-wrapper" aria-label="One Park Lane">
                            {words.map(([word, start, end]) => (
                                <span
                                    key={word}
                                    className="opl-seq-word"
                                    aria-hidden="true"
                                    style={{
                                        opacity: getOpacity(start, end),
                                        transform: `translateY(${30 * (1 - getOpacity(start, end))}px)`
                                    }}
                                >
                                    {word}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="opl-scroll-prompt" style={{ opacity: getFadeOut(0.05, 0.15) }}>
                        <span>Scroll to Explore</span>
                        <div className="opl-scroll-line"></div>
                    </div>
                </div>
            </div>

            {/* 2. The Landmark */}
            <section className="ed-intro opl-landmark">
                <div className="reveal reveal-up">
                    <span className="ed-eyebrow">The Landmark</span>
                    <h2 className="ed-title">Extraordinary &amp; Iconic</h2>
                    <p className="opl-lead">
                        The towers of One Park Lane will stand together as an unparalleled landmark and a gateway to Southport’s newly imagined CBD.
                    </p>
                    <p className="opl-body">
                        Designed by renowned architects BKK, the modern and slender spires will transcend the skyline at an awe-inspiring 101 and 60 storeys. Comprising luxury 2 &amp; 3 bedroom residences and 4 bedroom penthouses, where elegant and striking design meets sought-after amenities.
                    </p>
                </div>
            </section>

            {/* 3. Key numbers and features */}
            <section className="ed-section">
                <div className="ed-wide opl-stats">
                    {stats.map(stat => (
                        <div key={stat.label} className="opl-stat reveal reveal-up">
                            <span className="opl-stat-number">{stat.value}</span>
                            <span className="opl-stat-label">{stat.label}</span>
                        </div>
                    ))}
                </div>

                <div className="ed-wide ed-numbered opl-features" style={{ '--ed-cols': 3 }}>
                    {features.map((feature, idx) => (
                        <div key={feature.title} className={`ed-numbered-item reveal reveal-up delay-${(idx + 1) * 100}`}>
                            <span className="ed-numbered-index">0{idx + 1}</span>
                            <h3 className="ed-numbered-title">{feature.title}</h3>
                            <p className="ed-numbered-text">{feature.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. Full-width photo, fixed behind a rounded window */}
            <section className="ed-section opl-window-section">
                <div
                    className="ed-wide opl-window reveal reveal-up"
                    style={assets['oneparklane-v04'] ? { backgroundImage: `url(${assets['oneparklane-v04']})` } : undefined}
                    role="img"
                    aria-label="One Park Lane skybridge"
                ></div>
            </section>

            {/* 5. Amenities */}
            <section className="ed-section">
                <div className="ed-header reveal reveal-up">
                    <span className="ed-eyebrow">Amenities</span>
                    <h2 className="ed-title">World Class Amenities</h2>
                    <p className="ed-subtitle">
                        Indulge in resort-style living with a comprehensive range of luxury amenities designed for the discerning resident.
                    </p>
                </div>

                <div className="ed-wide opl-amenities">
                    {amenities.map((amenity, idx) => (
                        <div key={amenity.title} className={`opl-amenity reveal reveal-up delay-${(idx + 1) * 100}`}>
                            <div className="opl-amenity-image">
                                {assets[amenity.asset] && <img src={assets[amenity.asset]} alt={amenity.title} loading="lazy" />}
                            </div>
                            <h3 className="opl-amenity-title">{amenity.title}</h3>
                            <p className="opl-amenity-text">{amenity.text}</p>
                        </div>
                    ))}
                </div>

                <div className="ed-wide opl-more reveal reveal-up">
                    <span className="opl-more-label">Also included</span>
                    <ul className="opl-more-list">
                        {moreAmenities.map(item => <li key={item}>{item}</li>)}
                    </ul>
                </div>
            </section>

            {/* 6. Next steps */}
            <section className="ed-section">
                <div className="ed-wide ed-card ed-cta reveal reveal-up">
                    {assets['oneparklane-v11'] && <img src={assets['oneparklane-v11']} alt="" className="ed-card-bg" loading="lazy" />}
                    <div className="ed-card-overlay"></div>
                    <div className="ed-card-content">
                        <span className="ed-eyebrow ed-on-photo-gold">Next Steps</span>
                        <h2 className="ed-cta-title">Secure your place in the sky.</h2>
                        <p className="ed-cta-text">
                            Explore the project, request the brochure and pricing, or speak with our team.
                        </p>
                        <div className="ed-cta-actions opl-cta-actions">
                            <a href="https://1parklane.au/invitation" target="_blank" rel="noopener noreferrer" className="btn cine-hero-btn">
                                Visit Project Website
                            </a>
                            <a href="https://portal.apfg.au/pricelist" target="_blank" rel="noopener noreferrer" className="ed-btn-ghost">
                                View Pricelist
                            </a>
                            <button className="ed-btn-ghost" onClick={() => openEnquiry('Request Brochure')}>
                                Request Brochure
                            </button>
                            <button className="ed-btn-ghost" onClick={() => openEnquiry('Request Call Back')}>
                                Request Call Back
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. Enquiry */}
            <section className="ed-section opl-enquire" id="enquire">
                <div className="ed-wide ed-panel enquiry-panel reveal reveal-up">
                    <div className="enquiry-panel-intro">
                        <span className="ed-eyebrow">Enquire</span>
                        <h2 className="ed-title">Register your interest</h2>
                        <p>
                            Request the brochure, arrange a call back, or ask about pricing and availability.
                            Our team will be in touch shortly.
                        </p>
                    </div>
                    <div className="enquiry-panel-form">
                        <EnquiryForm
                            subject={`One Park Lane: ${requestType}`}
                            details={{ Property: 'One Park Lane, Southport' }}
                            requestOptions={requestOptions}
                            requestType={requestType}
                            onRequestTypeChange={setRequestType}
                            messagePlaceholder="Anything you'd like us to know, such as preferred residence type or the best time to call"
                            idPrefix="opl-enquiry"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default OneParkLanePage;
