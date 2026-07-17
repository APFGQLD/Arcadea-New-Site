import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { propertyCollections } from '../data/properties';
import useScrollReveal from '../hooks/useScrollReveal';
import './Properties.css';

const Properties = () => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const navigate = useNavigate();

    useScrollReveal();

    const collections = Object.values(propertyCollections);

    return (
        <section id="properties" className="properties section-padding">
            <div className="container">
                <div className="section-header reveal reveal-up">
                    <h2 className="section-title">{t('properties.title').split(' ')[0]} <span className="text-gold">{t('properties.title').split(' ')[1]}</span></h2>
                    <p className="section-description">
                        {t('properties.description')}
                    </p>
                </div>

                <div className="collections-showcase">
                    {collections.map((collection, index) => (
                        <div
                            key={collection.id}
                            className={`collection-showcase-card reveal reveal-up delay-${(index % 3 + 1) * 100}`}
                            data-theme={theme}
                            onClick={() => navigate(`/properties#${collection.id}`)}
                        >
                            <div className="collection-showcase-image" style={{ overflow: 'hidden' }}>
                                <img
                                    src={collection.image}
                                    alt={`${collection.title} - Premium property collection`}
                                    loading="lazy"
                                    decoding="async"
                                    width="800"
                                    height="500"
                                />
                                <div className="collection-showcase-overlay"></div>
                            </div>
                            <div className="collection-showcase-content">
                                {collection.logoLight && collection.logoDark ? (
                                    <div className="collection-showcase-logo">
                                        <img
                                            src={theme === 'dark' ? collection.logoLight : collection.logoDark}
                                            alt={`${collection.title} logo`}
                                            width="300"
                                            height="150"
                                        />
                                    </div>
                                ) : (
                                    <h3 className="collection-showcase-title">{collection.title}</h3>
                                )}
                                <div className="collection-showcase-location">{collection.location}</div>
                                <p className="collection-showcase-description">{collection.description}</p>
                                <button className="btn btn-secondary btn-sm">
                                    {t('properties.exploreCollection', 'Explore Collection')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="properties-action reveal reveal-fade delay-300">
                    <Link to="/properties" className="btn btn-secondary">{t('properties.cta')}</Link>
                </div>
            </div>
        </section>
    );
};

export default Properties;
