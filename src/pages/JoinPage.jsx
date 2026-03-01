import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './JoinPage.css';

const JoinPage = () => {
    const { t } = useTranslation();
    const [selectedRepId, setSelectedRepId] = useState('');
    const [isRedirecting, setIsRedirecting] = useState(false);

    const representatives = [
        {
            id: 'fred',
            name: t('join.representatives.fred.name'),
            zoomUrl: 'https://app.zoom.us/wc/join/4375183638?fromPWA=1&pwd=Z1h4dkp3eFRXd0l4YU4wcGlSbEhiZz09&_x_zm_rtaid=3tdMgSElSS6f87S2kGGrRg.1749685468186.fa60b43020a4a8bbdb273382bdfb7afb&_x_zm_rhtaid=127'
        },
        {
            id: 'darren',
            name: t('join.representatives.darren.name'),
            zoomUrl: 'https://zoom.us/wc/2956656551/join'
        },
        {
            id: 'pamela',
            name: t('join.representatives.pamela.name'),
            zoomUrl: 'https://zoom.us/wc/7589704554/join'
        },
        {
            id: 'lauren',
            name: t('join.representatives.lauren.name'),
            zoomUrl: 'https://zoom.us/wc/5401735519/join'
        },
        {
            id: 'matt',
            name: t('join.representatives.matt.name'),
            zoomUrl: 'https://zoom.us/wc/8324117951/join'
        }
    ];

    const selectedRep = representatives.find(rep => rep.id === selectedRepId);

    const handleJoin = () => {
        if (selectedRep) {
            setIsRedirecting(true);
            setTimeout(() => {
                window.location.href = selectedRep.zoomUrl;
            }, 2000);
        }
    };

    return (
        <div className="join-page-container">
            <div className="join-content-wrapper">
                <div className="join-glass-card">
                    <h1 className="join-title">{t('join.title')}</h1>
                    <p className="join-subtitle">{t('join.subtitle')}</p>

                    <div className="password-notice-banner">
                        <span className="password-icon">🔒</span>
                        <p className="password-text">{t('join.password_notice')}</p>
                    </div>

                    <div className={`dropdown-container ${isRedirecting ? 'fade-out' : ''}`}>
                        <select
                            className="representative-select"
                            value={selectedRepId}
                            onChange={(e) => setSelectedRepId(e.target.value)}
                            disabled={isRedirecting}
                        >
                            <option value="" disabled>{t('join.select_representative')}</option>
                            {representatives.map((rep) => (
                                <option key={rep.id} value={rep.id}>
                                    {rep.name}
                                </option>
                            ))}
                        </select>

                        <button
                            className={`join-action-button ${(!selectedRep || isRedirecting) ? 'disabled' : ''}`}
                            onClick={handleJoin}
                            disabled={!selectedRep || isRedirecting}
                        >
                            {isRedirecting ? t('common.loading') : t('join.join_button')}
                        </button>
                    </div>

                    {isRedirecting && (
                        <div className="redirecting-transition">
                            <div className="redirecting-spinner"></div>
                            <p className="redirecting-text">
                                {t('join.redirecting', { name: selectedRep?.name })}
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default JoinPage;
