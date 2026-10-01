import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Contact.css';

const WEB3FORMS_ACCESS_KEY = 'b3b849b8-aba3-4477-9c72-290007faa250';
const EMPTY_FORM = { name: '', email: '', phone: '', message: '' };

/**
 * Shared enquiry form (home page contact panel, project pages, One Park Lane).
 * Everything goes to the same Web3Forms inbox.
 *
 * - subject: email subject line
 * - details: extra labelled fields sent with the enquiry so the inbox knows
 *   what it's about, e.g. { Property: 'Lot 121', Agent: 'Darren Abbot' }.
 *   The page URL is always included.
 * - requestOptions / requestType / onRequestTypeChange: optional "I'd like to"
 *   dropdown, controlled by the parent so buttons elsewhere on the page can
 *   preselect it (e.g. "Request Brochure").
 */
const EnquiryForm = ({
    subject,
    details = {},
    requestOptions,
    requestType = '',
    onRequestTypeChange,
    messagePlaceholder,
    idPrefix = 'enquiry'
}) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        const extraFields = {};
        Object.entries(details).forEach(([label, value]) => {
            if (value) extraFields[label] = value;
        });
        if (requestOptions && requestType) extraFields['Request'] = requestType;

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    access_key: WEB3FORMS_ACCESS_KEY,
                    subject,
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    message: formData.message,
                    ...extraFields,
                    Page: window.location.href
                })
            });

            const result = await response.json();

            if (result.success) {
                setStatus('success');
                setFormData(EMPTY_FORM);
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            setStatus('error');
        } finally {
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    const field = (name) => `${idPrefix}-${name}`;
    const busy = status === 'loading';

    return (
        <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor={field('name')}>{t('contact.name', 'Name')} *</label>
                    <input
                        type="text"
                        id={field('name')}
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={busy}
                        placeholder={t('contact.namePlaceholder', 'Your full name')}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor={field('email')}>{t('contact.email', 'Email')} *</label>
                    <input
                        type="email"
                        id={field('email')}
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={busy}
                        placeholder={t('contact.emailPlaceholder', 'your@email.com')}
                    />
                </div>
            </div>

            <div className={requestOptions ? 'form-row' : undefined}>
                <div className="form-group">
                    <label htmlFor={field('phone')}>{t('contact.phone', 'Phone')}</label>
                    <input
                        type="tel"
                        id={field('phone')}
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={busy}
                        placeholder={t('contact.phonePlaceholder', '+61 400 000 000')}
                    />
                </div>
                {requestOptions && (
                    <div className="form-group">
                        <label htmlFor={field('request')}>I'd Like To</label>
                        <select
                            id={field('request')}
                            className="enquiry-select"
                            value={requestType}
                            onChange={(e) => onRequestTypeChange?.(e.target.value)}
                            disabled={busy}
                        >
                            {requestOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="form-group">
                <label htmlFor={field('message')}>{t('contact.message', 'Message')} *</label>
                <textarea
                    id={field('message')}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={busy}
                    rows="6"
                    placeholder={messagePlaceholder || t('contact.messagePlaceholder', 'Tell us about your investment goals...')}
                ></textarea>
            </div>

            {status === 'success' && (
                <div className="form-message success" role="status">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="currentColor" />
                    </svg>
                    {t('contact.successMessage', 'Thank you! We\'ll be in touch soon.')}
                </div>
            )}

            {status === 'error' && (
                <div className="form-message error" role="alert">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="currentColor" />
                    </svg>
                    {t('contact.errorMessage', 'Something went wrong. Please try again.')}
                </div>
            )}

            <button type="submit" className="btn btn-primary btn-large" disabled={busy}>
                {busy ? (
                    <>
                        <span className="spinner"></span>
                        {t('contact.sending', 'Sending...')}
                    </>
                ) : (
                    t('contact.submit', 'Send Message')
                )}
            </button>
        </form>
    );
};

export default EnquiryForm;
