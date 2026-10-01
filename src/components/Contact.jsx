import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import useScrollReveal from '../hooks/useScrollReveal';
import EnquiryForm from './EnquiryForm';
import './Contact.css';

const Contact = () => {
    const { t } = useTranslation();
    const sectionRef = useRef(null);
    useScrollReveal(sectionRef);

    return (
        <section ref={sectionRef} id="contact" className="ed-section">
            <div className="ed-wide ed-panel enquiry-panel reveal reveal-up">
                <div className="enquiry-panel-intro">
                    <span className="ed-eyebrow">{t('nav.contact', 'Get in Touch')}</span>
                    <h2 className="ed-title">{t('contact.title')}</h2>
                    <p>{t('contact.description')}</p>
                    <a href="mailto:info@arcadea.com.au" className="ed-text-link">info@arcadea.com.au</a>
                </div>

                <div className="enquiry-panel-form">
                    <EnquiryForm subject="New Contact Form Submission - Arcadea Property" idPrefix="contact" />
                </div>
            </div>
        </section>
    );
};

export default Contact;
