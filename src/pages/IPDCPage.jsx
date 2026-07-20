import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    BanknotesIcon,
    ScaleIcon,
    ShieldCheckIcon,
    ArrowTrendingUpIcon,
    ClockIcon,
    UserMinusIcon,
    CurrencyDollarIcon,
    BuildingOffice2Icon,
    ChartBarIcon,
    CheckBadgeIcon
} from '@heroicons/react/24/outline';
import usePageTitle from '../hooks/usePageTitle';
import './IPDCPage.css';

// Helper component for animated timeline steps
const TimelineStep = ({ icon, title, description, isLast, isSuccess }) => {
    const stepRef = React.useRef(null);

    useEffect(() => {
        const element = stepRef.current;
        if (!element) return;

        // Immediately hide for animation, but only if JS is running
        element.classList.add('hidden');

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.remove('hidden');
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target); // Trigger only once
                    }
                });
            },
            { threshold: 0.1 } // Lower threshold for easier triggering
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div className="timeline-item" ref={stepRef}>
            <div className="timeline-marker">
                <div className={`timeline-icon ${isSuccess ? 'icon-success' : ''}`}>
                    {icon}
                </div>
                {!isLast && <div className="timeline-line"></div>}
            </div>
            <div className="timeline-content">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </div>
    );
};

const IPDCPage = () => {
    usePageTitle('IPDC Program');
    const { t } = useTranslation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="ipdc-page">
            <div className="ipdc-hero">
                <div className="container">
                    <div className="ipdc-hero-content animate-in">
                        <span className="ipdc-category">Investment Insights</span>
                        <h1 className="ipdc-title">The Smart Investor’s Secret: Interest Paid During Construction (IPDC)</h1>
                        <p className="ipdc-subtitle">Turn "Dead Money" into Active Returns from Day One.</p>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="ipdc-content">

                    {/* Introduction */}
                    <p className="ipdc-intro">
                        Investing in off-plan luxury property allows you to secure a premium asset at today's prices and capitalize on appreciation during the build. But traditional off-plan investing has one major flaw: <strong>Opportunity Cost</strong>.
                    </p>

                    {/* Problem vs Solution Comparison */}
                    <div className="ipdc-comparison-section">
                        <div className="comparison-card problem">
                            <div className="card-header">
                                <UserMinusIcon className="card-icon" />
                                <h3>The Traditional Way</h3>
                            </div>
                            <p className="concept-problem">"Dead Money"</p>
                            <p>
                                When you place a deposit, your capital sits dormant in a trust account. You earn <strong>zero income</strong> for 12-24 months while waiting for construction to finish.
                            </p>
                            <ul className="comparison-list">
                                <li>Capital is locked away</li>
                                <li>No cash flow during build</li>
                                <li>Inflation erodes value</li>
                            </ul>
                        </div>

                        <div className="comparison-card solution">
                            <div className="card-header">
                                <CheckBadgeIcon className="card-icon" />
                                <h3>The Arcadea Way (IPDC)</h3>
                            </div>
                            <p className="concept-solution">"Active Returns"</p>
                            <p>
                                We prioritize developers who offer <strong>Interest Paid During Construction</strong>. This contractual incentive pays you a fixed return on your paid capital while the property is being built.
                            </p>
                            <ul className="comparison-list">
                                <li>Capital works from Day 1</li>
                                <li>Quarterly cash payments</li>
                                <li>Offset loan costs immediately</li>
                            </ul>
                        </div>
                    </div>

                    {/* How It Works - Vertical Timeline */}
                    <section className="ipdc-timeline-section">
                        <h2>How IPDC Works in Practice</h2>
                        <div className="timeline-container">
                            <TimelineStep
                                icon={<BuildingOffice2Icon />}
                                title="1. Selection"
                                description="Choose a property within our Island Collection that offers the IPDC benefit. We carefully vet each project for financial stability."
                            />
                            <TimelineStep
                                icon={<ClockIcon />}
                                title="2. Activation"
                                description="From Day One of your initial payment or deposit, interest begins to accrue on the funds you have deployed. No waiting period."
                            />
                            <TimelineStep
                                icon={<CurrencyDollarIcon />}
                                title="3. Cash Flow"
                                description="Rather than accruing in the background, these payments are deposited directly into your account quarterly, providing liquid cash flow."
                            />
                            <TimelineStep
                                icon={<ChartBarIcon />}
                                title="4. Transition"
                                description="Once construction is complete and the property is operational, the IPDC payments cease, and your income stream seamlessly transitions to rental yields."
                                isLast={true}
                                isSuccess={true}
                            />
                        </div>
                    </section>



                    <div className="section-divider"></div>

                    {/* Benefits Grid */}
                    <section className="ipdc-benefits-section">
                        <h2>Why Smart Investors Prioritize IPDC</h2>
                        <div className="benefits-grid">
                            <div className="benefit-card">
                                <BanknotesIcon className="benefit-icon" />
                                <h3>Immediate Liquidity</h3>
                                <p>Unlike standard deals where cash only flows out, IPDC puts cash back in your pocket immediately, improving your liquidity.</p>
                            </div>
                            <div className="benefit-card">
                                <ScaleIcon className="benefit-icon" />
                                <h3>Offsetting Costs</h3>
                                <p>Use your IPDC earnings to service loan payments or effectively discount your purchase price before the project is even finished.</p>
                            </div>
                            <div className="benefit-card">
                                <ShieldCheckIcon className="benefit-icon" />
                                <h3>Risk Mitigation</h3>
                                <p>Developers offering IPDC demonstrate financial strength. Earning returns during the build lowers your total risk exposure.</p>
                            </div>
                            <div className="benefit-card">
                                <ArrowTrendingUpIcon className="benefit-icon" />
                                <h3>Beating Inflation</h3>
                                <p>Your capital doesn't just sit there. It actively works at a high yield, protecting your purchasing power against inflation.</p>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <div className="ipdc-cta-section">
                        <h3>Ready to make your money work from Day One?</h3>
                        <p>Explore our current properties offering Interest Paid During Construction or contact our Brisbane team for a private consultation.</p>

                        <div className="ipdc-actions">
                            <Link to="/properties#island" className="btn btn-primary">View The Island Collection</Link>
                            <a href="/#contact" className="btn btn-secondary">Contact Us</a>
                        </div>
                    </div>

                    <div className="ipdc-disclaimer">
                        <p><strong>Disclaimer:</strong> The information provided in this article is for educational purposes only and does not constitute financial advice. Interest rates and IPDC terms vary by project and developer. We recommend consulting with your accountant or financial advisor regarding the tax implications of IPDC payments in your specific jurisdiction.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IPDCPage;
