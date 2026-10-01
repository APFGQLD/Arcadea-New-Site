import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { fetchPropertyCollections } from '../services/sanityService';
import useScrollReveal from '../hooks/useScrollReveal';
import './Properties.css';

const Properties = () => {
    const { t } = useTranslation();
    const sectionRef = useRef(null);

    const [collections, setCollections] = useState([]);

    useScrollReveal(sectionRef, 0.15, [collections]);

    useEffect(() => {
        const loadCollections = async () => {
            const data = await fetchPropertyCollections();
            setCollections(data);
        };
        loadCollections();
    }, []);

    return (
        <section ref={sectionRef} id="properties" className="ed-section">
            <div className="ed-header reveal reveal-up">
                <span className="ed-eyebrow">{t('properties.title')}</span>
                <h2 className="ed-title">{t('properties.home_headline', 'Global Collections')}</h2>
                <p className="ed-subtitle">{t('properties.description')}</p>
            </div>

            <div className="ed-wide ed-collections">
                {collections.map((collection, index) => (
                    <Link
                        key={collection.id}
                        to={`/properties/#${collection.id}`}
                        className={`ed-card ed-collection-card reveal reveal-up delay-${(index % 3 + 1) * 100}`}
                    >
                        <img
                            src={collection.image}
                            alt={`${collection.title} - Premium property collection`}
                            className="ed-card-bg"
                            loading="lazy"
                            decoding="async"
                        />
                        <div className="ed-card-overlay"></div>
                        <div className="ed-card-content ed-collection-content">
                            {/* Cards keep a dark scrim in both themes, so always use the white logo */}
                            {collection.logoLight ? (
                                <img src={collection.logoLight} alt={`${collection.title} logo`} className="ed-collection-logo" />
                            ) : (
                                <h3 className="ed-collection-title">{collection.title}</h3>
                            )}
                            <p className="ed-collection-tagline ed-on-photo-gold">{collection.location}</p>
                            <div className="ed-collection-reveal">
                                <p className="ed-collection-desc">{collection.description}</p>
                                <span className="ed-text-link">{t('properties.exploreCollection', 'Explore Collection')} &rarr;</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="home-section-action reveal reveal-up">
                <Link to="/properties/" className="ed-text-link">{t('properties.cta')} &rarr;</Link>
            </div>
        </section>
    );
};

export default Properties;
