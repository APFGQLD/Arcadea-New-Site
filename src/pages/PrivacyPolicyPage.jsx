import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import usePageTitle from '../hooks/usePageTitle';
import './PrivacyPolicyPage.css';

const PrivacyPolicyPage = () => {
    usePageTitle('Privacy Policy');
    const { t } = useTranslation();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, []);

    return (
        <div className="privacy-page">
            <div className="privacy-hero">
                <div className="container">
                    <h1 className="privacy-title">Privacy Policy</h1>
                </div>
            </div>

            <div className="container">
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
                        <h2>3. Use of Your Information</h2>
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
                        <h2>4. Disclosure of Your Information</h2>
                        <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
                        <ul>
                            <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</li>
                            <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>5. Security of Your Information</h2>
                        <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>
                    </section>

                    <section>
                        <h2>6. Contact Us</h2>
                        <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
                        <p>
                            <strong>Arcadea Property</strong><br />
                            Email: <a href="mailto:info@arcadea.com.au">info@arcadea.com.au</a>
                        </p>
                    </section>

                    <p className="privacy-last-updated">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
