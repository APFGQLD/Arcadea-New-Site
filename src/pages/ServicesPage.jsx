import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
    BuildingOffice2Icon,
    ChartBarIcon,
    HomeIcon,
    ShieldCheckIcon,
    UsersIcon,
    LightBulbIcon,
    CheckCircleIcon
} from '@heroicons/react/24/solid';
import './ServicesPage.css';
import usePageTitle from '../hooks/usePageTitle';
import { fetchPageAssets } from '../services/sanityService';

const ServicesPage = () => {
    usePageTitle('Our Services', {
        description: 'End-to-end property and financial solutions: Australian property, hotel and resort investments, and financial service partnerships through trusted advisors.'
    });
    const { t } = useTranslation();
    const { theme } = useTheme();
    const [assets, setAssets] = useState({});

    useEffect(() => {
        const loadAssets = async () => {
            const fetched = await fetchPageAssets(['services-hero', 'services-secondary', 'services-3', 'services-hero-bg']);
            const assetMap = {};
            fetched.forEach(a => { assetMap[a.identifier] = a.url; });
            setAssets(assetMap);
        };
        loadAssets();
        window.scrollTo(0, 0);
    }, []);

    const services = [
        {
            id: 'australian',
            icon: HomeIcon,
            title: t('services.pillars.australian.title'),
            subtitle: 'Premium Coastal Living',
            description: 'Curated selection of high-quality Australian properties with transparent sales processes and exclusive access.',
            benefits: [
                'High Quality & Curated Australian Property',
                'Transparent Sales Process',
                'CoPosit and Deposit Bonds',
                'Exclusive Listings and Developments'
            ],
            image: assets['services-hero'] || '',
            color: '#c5a065'
        },
        {
            id: 'financial',
            icon: ChartBarIcon,
            title: t('services.pillars.financial.title'),
            subtitle: t('services.pillars.financial.subtitle'),
            description: 'Comprehensive financial solutions through our trusted network of partners and advisors.',
            benefits: [
                'Equity Release',
                'SMSF Creation and Rollover',
                'Tax Depreciation On Overseas Properties',
                'Tax effective ownership',
                'Fractional Investing'
            ],
            image: assets['services-3'] || '',
            color: '#c5a065'
        },
        {
            id: 'hotel',
            icon: BuildingOffice2Icon,
            title: t('services.pillars.hotel.title'),
            subtitle: 'High-Yield International Investments',
            description: 'Access premium hotel and resort investment opportunities with guaranteed returns and globally respected brands.',
            benefits: [
                'Guaranteed Returns on property',
                'Strong ROI',
                'Access to globally respected brands',
                'Access to experienced and trusted developers'
            ],
            image: assets['services-secondary'] || '',
            color: '#c5a065'
        }
    ];

    const whyChoose = [
        {
            icon: ShieldCheckIcon,
            title: 'Trusted Expertise',
            description: 'Over a decade of experience in international and domestic property markets.'
        },
        {
            icon: UsersIcon,
            title: 'Personalized Service',
            description: 'Dedicated advisors who understand your unique investment goals and lifestyle needs.'
        },
        {
            icon: LightBulbIcon,
            title: 'Strategic Insights',
            description: 'Data-driven market analysis and curated opportunities for optimal returns.'
        }
    ];

    return (
        <div className="services-page" style={assets['services-hero-bg'] ? { '--hero-bg-image': `url(${assets['services-hero-bg']})` } : {}}>
            {/* Hero Section */}
            <section className="services-hero" data-theme={theme}>
                <div className="services-hero-overlay"></div>
                <div className="services-hero-content">
                    <h1 className="services-hero-title">{t('services.title', 'OUR EXPERTISE')}</h1>
                    <p className="services-hero-subtitle">
                        {t('services.subtitle', 'Comprehensive Property & Financial Solutions')}
                    </p>
                    <p className="services-hero-description">
                        From high-yield international investments to ultra-luxury Australian residences,
                        we provide end-to-end solutions tailored to your wealth creation journey.
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="services-grid-section section-padding">
                <div className="container">
                    {services.map((service, index) => (
                        <div
                            key={service.id}
                            className={`service-detail-card ${index % 2 === 1 ? 'reverse' : ''}`}
                        >
                            <div className="service-detail-image">
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    width="800"
                                    height="600"
                                    loading="lazy"
                                    decoding="async"
                                />
                                <div className="service-detail-overlay"></div>
                            </div>
                            <div className="service-detail-content">
                                <div className="service-icon-large" style={{ color: service.color }}>
                                    <service.icon className="hero-icon" />
                                </div>
                                <h2 className="service-detail-title">{service.title}</h2>
                                <p className="service-detail-subtitle">{service.subtitle}</p>
                                <p className="service-detail-description">{service.description}</p>

                                <div className="service-benefits">
                                    <h3 className="benefits-title">Key Benefits:</h3>
                                    <ul className="benefits-list">
                                        {service.benefits.map((benefit, idx) => (
                                            <li key={idx}>
                                                <CheckCircleIcon className="check-icon hero-icon-sm" />
                                                <span>{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <Link to="/properties" className="btn btn-secondary">
                                    Explore Opportunities
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="services-why section-padding" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="container">
                    <h2 className="section-title-caps text-center">WHY CHOOSE ARCADEA</h2>
                    <p className="section-subtitle text-center">
                        We combine global reach with local expertise to deliver exceptional results.
                    </p>

                    <div className="why-grid">
                        {whyChoose.map((item, idx) => (
                            <div key={idx} className="why-card">
                                <div className="why-icon">
                                    <item.icon className="hero-icon" />
                                </div>
                                <h3 className="why-title">{item.title}</h3>
                                <p className="why-description">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="services-cta section-padding">
                <div className="container text-center">
                    <h2 className="section-title-caps">READY TO BEGIN?</h2>
                    <p className="section-subtitle">
                        Let's discuss how our services can help you achieve your investment goals.
                    </p>
                    <Link to="/#contact" className="btn btn-primary btn-large">
                        Schedule a Consultation
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default ServicesPage;
