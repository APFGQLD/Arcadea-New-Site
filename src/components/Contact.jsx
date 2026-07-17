import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useScrollReveal from '../hooks/useScrollReveal';
import './Contact.css';

const Contact = () => {
    const { t } = useTranslation();
    useScrollReveal();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access_key: 'b3b849b8-aba3-4477-9c72-290007faa250',
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    message: formData.message,
                    subject: 'New Contact Form Submission - Arcadea Property'
                })
            });

            const result = await response.json();

            if (result.success) {
                setStatus('success');
                setFormData({ name: '', email: '', phone: '', message: '' });
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                setStatus('error');
                setTimeout(() => setStatus('idle'), 5000);
            }
        } catch (error) {
            console.error('Form submission error:', error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    return (
        <section id="contact" className="section-padding">
            <div className="container">
                <div className="section-header reveal reveal-fade">
                    <h2 className="section-title">
                        {t('contact.title').split(' ')[0]} <span className="text-gold">{t('contact.title').split(' ')[1]}</span>
                    </h2>
                    <p className="section-description">
                        {t('contact.description')}
                    </p>
                </div>

                <div className="contact-form-wrapper reveal reveal-up delay-200">
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="name">{t('contact.name', 'Name')} *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    disabled={status === 'loading'}
                                    placeholder={t('contact.namePlaceholder', 'Your full name')}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">{t('contact.email', 'Email')} *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    disabled={status === 'loading'}
                                    placeholder={t('contact.emailPlaceholder', 'your@email.com')}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">{t('contact.phone', 'Phone')}</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={status === 'loading'}
                                placeholder={t('contact.phonePlaceholder', '+61 400 000 000')}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">{t('contact.message', 'Message')} *</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                disabled={status === 'loading'}
                                rows="6"
                                placeholder={t('contact.messagePlaceholder', 'Tell us about your investment goals...')}
                            ></textarea>
                        </div>

                        {status === 'success' && (
                            <div className="form-message success">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="currentColor" />
                                </svg>
                                {t('contact.successMessage', 'Thank you! We\'ll be in touch soon.')}
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="form-message error">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="currentColor" />
                                </svg>
                                {t('contact.errorMessage', 'Something went wrong. Please try again.')}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary btn-large"
                            disabled={status === 'loading'}
                        >
                            {status === 'loading' ? (
                                <>
                                    <span className="spinner"></span>
                                    {t('contact.sending', 'Sending...')}
                                </>
                            ) : (
                                t('contact.submit', 'Send Message')
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
