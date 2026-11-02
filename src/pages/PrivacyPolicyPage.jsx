import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import usePageTitle from '../hooks/usePageTitle';
import './EditorialPage.css';
import './PrivacyPolicyPage.css';

const PrivacyPolicyPage = () => {
    usePageTitle('Privacy Policy', {
        description: 'How Arcadea Property collects, uses, stores and protects your personal information, and how to contact us about your data.'
    });
    const { t } = useTranslation();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, []);

    return (
        <div className="editorial-page privacy-page">
            <header className="ed-wide privacy-header">
                <span className="ed-eyebrow">Legal</span>
                <h1 className="privacy-title">Privacy Policy</h1>
                <p className="privacy-meta">Last updated: {new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </header>

            <div className="privacy-body">
                <div className="privacy-content">
                    <section>
                        <h2>1. Introduction</h2>
                        <p>
                            At Arcadea Property ("we," "our," or "us"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website arcadea.com.au or engage with our services.
                        </p>
                    </section>

                    <section>
                        <h2>2. Information We Collect</h2>
                        <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
                        <ul>
                            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site.</li>
                            <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. Cookies and Analytics</h2>
                        <p>We use two analytics services to understand how visitors use the Site so we can improve it. Both place cookies or similar technologies in your browser and collect information automatically as you browse. We do not use them to identify you by name, and we do not combine their data with the personal information you give us.</p>
                        <ul>
                            <li><strong>Google Analytics:</strong> Provided by Google LLC. It collects information such as the pages you visit, how long you spend on them, how you arrived at the Site, your device and browser type, and your approximate location (derived from your IP address). This helps us measure traffic and see which content is most useful. You can learn more in <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">how Google uses information from sites that use its services</a>, and you can opt out using the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a>.</li>
                            <li><strong>Microsoft Clarity:</strong> Provided by Microsoft Corporation, in partnership with Microsoft Advertising. It captures how you use and interact with the Site through behavioural metrics, heatmaps and session replay, including mouse movements, clicks, scrolling and the pages you view. Clarity is designed to mask sensitive information, such as text you type into form fields, before it is sent to Microsoft. We use this information to improve the Site's design and usability and for fraud and security purposes, and Microsoft may also use it for advertising. For more about how Microsoft collects and uses your data, see the <a href="https://privacy.microsoft.com/privacystatement" target="_blank" rel="noopener noreferrer">Microsoft Privacy Statement</a>.</li>
                        </ul>
                        <p>Google and Microsoft may store and process this information on servers outside Australia, including in the United States. You can block or delete cookies through your browser settings at any time; the Site will continue to work if you do.</p>
                    </section>

                    <section>
                        <h2>4. Use of Your Information</h2>
                        <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
                        <ul>
                            <li>Create and manage your account.</li>
                            <li>Email you regarding your account or order.</li>
                            <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
                            <li>Generate a personal profile about you to make future visits to the Site more personalized.</li>
                            <li>Increase the efficiency and operation of the Site.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>5. Disclosure of Your Information</h2>
                        <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
                        <ul>
                            <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</li>
                            <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>6. Security of Your Information</h2>
                        <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>
                    </section>

                    <section>
                        <h2>7. Contact Us</h2>
                        <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
                        <p>
                            <strong>Arcadea Property</strong><br />
                            Email: <a href="mailto:info@arcadea.com.au">info@arcadea.com.au</a>
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
