import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    BanknotesIcon,
    ScaleIcon,
    ShieldCheckIcon,
    ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import usePageTitle from '../hooks/usePageTitle';
import useScrollReveal from '../hooks/useScrollReveal';
import EnquiryForm from '../components/EnquiryForm';
import './EditorialPage.css';
import './IPDCPage.css';

const steps = [
    {
        title: 'Selection',
        text: 'Choose a property within our Island Collection that offers the IPDC benefit. We carefully vet each project for financial stability.'
    },
    {
        title: 'Activation',
        text: 'From Day One of your initial payment or deposit, interest begins to accrue on the funds you have deployed. No waiting period.'
    },
    {
        title: 'Cash Flow',
        text: 'Rather than accruing in the background, these payments are deposited directly into your account quarterly, providing liquid cash flow.'
    },
    {
        title: 'Transition',
        text: 'Once construction is complete and the property is operational, the IPDC payments cease, and your income stream seamlessly transitions to rental yields.'
    }
];

const benefits = [
    {
        icon: BanknotesIcon,
        title: 'Immediate Liquidity',
        text: 'Unlike standard deals where cash only flows out, IPDC puts cash back in your pocket immediately, improving your liquidity.'
    },
    {
        icon: ScaleIcon,
        title: 'Offsetting Costs',
        text: 'Use your IPDC earnings to service loan payments or effectively discount your purchase price before the project is even finished.'
    },
    {
        icon: ShieldCheckIcon,
        title: 'Risk Mitigation',
        text: 'Developers offering IPDC demonstrate financial strength. Earning returns during the build lowers your total risk exposure.'
    },
    {
        icon: ArrowTrendingUpIcon,
        title: 'Beating Inflation',
        text: 'Your capital doesn’t just sit there. It actively works at a high yield, protecting your purchasing power against inflation.'
    }
];

const IPDCPage = () => {
    usePageTitle('IPDC Program', {
        description: 'Interest Paid During Construction explained: how IPDC arrangements can pay a return on your capital while an off-plan property is still being built.'
    });
    const pageRef = useRef(null);
    useScrollReveal(pageRef);

    return (
        <div className="editorial-page ipdc-page" ref={pageRef}>
            {/* Heading */}
            <header className="ed-wide ipdc-header">
                <Link to="/services" className="ed-text-link ipdc-back">&larr; Our Services</Link>
                <span className="ed-eyebrow">Investment Insights</span>
                <h1 className="ipdc-title">
                    The smart investor’s secret: <em className="ipdc-accent">Interest Paid During Construction</em>
                </h1>
                <p className="ipdc-subtitle">Turn “dead money” into active returns from day one.</p>
            </header>

            {/* Opening statement */}
            <div className="ed-intro ipdc-intro reveal reveal-up">
                <p>
                    Investing in off-plan luxury property lets you secure a premium asset at today’s prices and capitalise on
                    appreciation during the build. But traditional off-plan investing has one major flaw: opportunity cost.
                </p>
            </div>

            {/* Traditional vs Arcadea */}
            <section className="ed-section">
                <div className="ed-wide ipdc-compare">
                    <div className="ipdc-compare-card reveal reveal-up">
                        <span className="ipdc-compare-label">The Traditional Way</span>
                        <p className="ipdc-compare-concept">Dead Money</p>
                        <p className="ipdc-compare-text">
                            When you place a deposit, your capital sits dormant in a trust account. You earn <strong>zero income</strong> for
                            12–24 months while waiting for construction to finish.
                        </p>
                        <ul className="ipdc-compare-list">
                            <li>Capital is locked away</li>
                            <li>No cash flow during build</li>
                            <li>Inflation erodes value</li>
                        </ul>
                    </div>

                    <div className="ipdc-compare-card is-arcadea ed-panel reveal reveal-up delay-200">
                        <span className="ipdc-compare-label">The Arcadea Way</span>
                        <p className="ipdc-compare-concept">Active Returns</p>
                        <p className="ipdc-compare-text">
                            We prioritise developers who offer <strong>Interest Paid During Construction</strong>. This contractual incentive pays
                            you a fixed return on your paid capital while the property is being built.
                        </p>
                        <ul className="ipdc-compare-list">
                            <li>Capital works from day one</li>
                            <li>Quarterly cash payments</li>
                            <li>Offset loan costs immediately</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="ed-section">
                <div className="ed-header reveal reveal-up">
                    <span className="ed-eyebrow">The Process</span>
                    <h2 className="ed-title">How IPDC works in practice</h2>
                </div>
                <div className="ed-wide ed-numbered">
                    {steps.map((step, idx) => (
                        <div key={step.title} className={`ed-numbered-item reveal reveal-up delay-${(idx + 1) * 100}`}>
                            <span className="ed-numbered-index">0{idx + 1}</span>
                            <h3 className="ed-numbered-title">{step.title}</h3>
                            <p className="ed-numbered-text">{step.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Benefits */}
            <section className="ed-section">
                <div className="ed-header reveal reveal-up">
                    <span className="ed-eyebrow">The Benefits</span>
                    <h2 className="ed-title">Why smart investors prioritise IPDC</h2>
                </div>
                <div className="ed-wide ipdc-benefits">
                    {benefits.map((benefit, idx) => (
                        <div key={benefit.title} className={`ipdc-benefit reveal reveal-up delay-${(idx % 2 + 1) * 100}`}>
                            <benefit.icon className="ipdc-benefit-icon" aria-hidden="true" />
                            <div>
                                <h3 className="ipdc-benefit-title">{benefit.title}</h3>
                                <p className="ipdc-benefit-text">{benefit.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Enquiry */}
            <section className="ed-section" id="enquire">
                <div className="ed-wide ed-panel enquiry-panel reveal reveal-up">
                    <div className="enquiry-panel-intro">
                        <span className="ed-eyebrow">Next Steps</span>
                        <h2 className="ed-title">Ready to make your money work from day one?</h2>
                        <p>
                            Explore our current properties offering Interest Paid During Construction, or ask our Brisbane team
                            for a private consultation.
                        </p>
                        <Link to="/properties/#island" className="ed-text-link">View the Island Collection &rarr;</Link>
                    </div>
                    <div className="enquiry-panel-form">
                        <EnquiryForm
                            subject="Enquiry: IPDC (Interest Paid During Construction)"
                            details={{ Topic: 'IPDC' }}
                            messagePlaceholder="Tell us about your budget and what you're looking for..."
                            idPrefix="ipdc-enquiry"
                        />
                    </div>
                </div>
            </section>

            {/* Disclaimer */}
            <div className="ed-wide ipdc-disclaimer">
                <p>
                    <strong>Disclaimer:</strong> The information provided in this article is for educational purposes only and does not
                    constitute financial advice. Interest rates and IPDC terms vary by project and developer. We recommend consulting
                    with your accountant or financial advisor regarding the tax implications of IPDC payments in your specific jurisdiction.
                </p>
            </div>
        </div>
    );
};

export default IPDCPage;
