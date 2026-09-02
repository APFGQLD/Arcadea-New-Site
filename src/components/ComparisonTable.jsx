import React from 'react';
import './ComparisonTable.css';
import { useTranslation } from 'react-i18next';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const ComparisonTable = ({ project }) => {
    const { t } = useTranslation();

    // Data extraction with fallbacks
    const projectName = project.name;
    const roi = '12 - 18%';

    const entryPrice = project.price && !project.price.enquiryOnly && project.price.amount != null
        ? project.price.amount
        : 55000; // Fallback default

    const formattedEntryPrice = `From $${(entryPrice / 1000).toFixed(0)}k`;

    return (
        <div className="apfg-comp-container">
            <div className="apfg-comp-header">
                <span className="apfg-comp-eyebrow">{t('comparison.eyebrow', 'Why Choose Us')}</span>
                <h2>{t('comparison.title', 'Compare Your Options')}</h2>
            </div>

            {/* DESKTOP TABLE STRUCTURE */}
            <div className="apfg-comp-table">
                {/* Headers */}
                <div className="apfg-col-header label-col">{t('comparison.feature', 'Investment Feature')}</div>
                <div className="apfg-col-header winner">{projectName}</div>
                <div className="apfg-col-header">{t('comparison.opt2', 'Std. Residential Villa')}</div>
                <div className="apfg-col-header">{t('comparison.opt3', 'Australian Real Estate')}</div>

                {/* Row 1: ROI */}
                <div className="apfg-cell label-cell">{t('comparison.roi', 'Projected Annual ROI')}</div>
                <div className="apfg-cell winner" style={{ fontWeight: 700, fontSize: '18px' }}>{roi}</div>
                <div className="apfg-cell">6 - 10%</div>
                <div className="apfg-cell">3 - 5%</div>

                {/* Row 2: Management */}
                <div className="apfg-cell label-cell">{t('comparison.mgmt', 'Management Type')}</div>
                <div className="apfg-cell winner">
                    <strong>{t('comparison.mgmt_passive', 'Fully Passive')}</strong>
                    <small>{t('comparison.mgmt_passive_sub', 'Turnkey Hotel Mgmt')}</small>
                </div>
                <div className="apfg-cell">
                    {t('comparison.mgmt_active', 'Active')}
                    <small>{t('comparison.mgmt_active_sub', 'Self-Managed')}</small>
                </div>
                <div className="apfg-cell">
                    {t('comparison.mgmt_agent', 'Agent Managed')}
                    <small>{t('comparison.mgmt_agent_sub', 'Fees & Upkeep')}</small>
                </div>

                {/* Row 3: Entry Price */}
                <div className="apfg-cell label-cell">{t('comparison.entry', 'Entry Price')}</div>
                <div className="apfg-cell winner">
                    <strong>{t('comparison.price_low', 'Low')}</strong>
                    <small>{formattedEntryPrice}</small>
                </div>
                <div className="apfg-cell">
                    {t('comparison.price_high', 'High')}
                    <small>$400k+</small>
                </div>
                <div className="apfg-cell">
                    {t('comparison.price_high', 'High')}
                    <small>$600k+</small>
                </div>

                {/* Row 4: Construction Yield */}
                <div className="apfg-cell label-cell">{t('comparison.yield', 'Income During Build')}</div>
                <div className="apfg-cell winner">
                    <div className="apfg-icon-wrap">
                        <CheckCircleIcon className="apfg-icon-check" />
                        <span style={{ fontWeight: 600 }}>10% Gtd.</span>
                    </div>
                </div>
                <div className="apfg-cell">
                    <div className="apfg-icon-wrap">
                        <XCircleIcon className="apfg-icon-cross" />
                        <span>0% (Dead Money)</span>
                    </div>
                </div>
                <div className="apfg-cell">
                    <div className="apfg-icon-wrap">
                        <XCircleIcon className="apfg-icon-cross" />
                        <span>0% (Capital Only)</span>
                    </div>
                </div>

                {/* Row 5: Personal Use */}
                <div className="apfg-cell label-cell">{t('comparison.use', 'Personal Holiday Use')}</div>
                <div className="apfg-cell winner">
                    <div className="apfg-icon-wrap">
                        <CheckCircleIcon className="apfg-icon-check" />
                        <span>{t('comparison.included', 'Included*')}</span>
                    </div>
                </div>
                <div className="apfg-cell">
                    <div className="apfg-icon-wrap">
                        <CheckCircleIcon className="apfg-icon-check" />
                        <span>{t('comparison.yes', 'Yes*')}</span>
                    </div>
                </div>
                <div className="apfg-cell">
                    <div className="apfg-icon-wrap">
                        <XCircleIcon className="apfg-icon-cross" />
                        <span>{t('comparison.no_tenanted', 'No (Tenanted)')}</span>
                    </div>
                </div>
            </div>

            {/* DESKTOP FOOTER NOTE */}
            <div className="apfg-comp-footer">
                {t('comparison.disclaimer', '* Note: If investing via a Self-Managed Super Fund (SMSF), ATO regulations strictly prohibit personal use of the property by fund members or their relatives.')}
            </div>

            {/* MOBILE CARDS STRUCTURE */}
            <div className="apfg-mobile-cards-container">

                {/* Card 1: Main Project */}
                <div className="apfg-mobile-card winner">
                    <div className="apfg-mobile-header">{projectName}</div>
                    <div className="apfg-mobile-row">
                        <span className="apfg-mobile-label">ROI</span>
                        <span className="apfg-mobile-val val-winner">{roi}</span>
                    </div>
                    <div className="apfg-mobile-row">
                        <span className="apfg-mobile-label">Mgmt</span>
                        <span className="apfg-mobile-val">Passive (Hotel)</span>
                    </div>
                    <div className="apfg-mobile-row">
                        <span className="apfg-mobile-label">Entry</span>
                        <span className="apfg-mobile-val">{formattedEntryPrice}</span>
                    </div>
                    <div className="apfg-mobile-row">
                        <span className="apfg-mobile-label">Build Income</span>
                        <span className="apfg-mobile-val">10% Gtd.</span>
                    </div>
                    <div className="apfg-mobile-row">
                        <span className="apfg-mobile-label">Personal Use</span>
                        <span className="apfg-mobile-val">Included*</span>
                    </div>
                </div>

                {/* Card 2: Villa */}
                <div className="apfg-mobile-card" style={{ marginTop: '20px' }}>
                    <div className="apfg-mobile-header">Std. Residential Villa</div>
                    <div className="apfg-mobile-row">
                        <span className="apfg-mobile-label">ROI</span>
                        <span className="apfg-mobile-val">8 - 12%</span>
                    </div>
                    <div className="apfg-mobile-row">
                        <span className="apfg-mobile-label">Mgmt</span>
                        <span className="apfg-mobile-val">Active (DIY)</span>
                    </div>
                    <div className="apfg-mobile-row">
                        <span className="apfg-mobile-label">Entry</span>
                        <span className="apfg-mobile-val">$400k+</span>
                    </div>
                    <div className="apfg-mobile-row">
                        <span className="apfg-mobile-label">Build Income</span>
                        <span className="apfg-mobile-val">0% (Dead Money)</span>
                    </div>
                    <div className="apfg-mobile-row">
                        <span className="apfg-mobile-label">Personal Use</span>
                        <span className="apfg-mobile-val">Yes*</span>
                    </div>
                </div>

                {/* Card 3: Aussie Real Estate */}
                <div className="apfg-mobile-card" style={{ marginTop: '20px' }}>
                    <div className="apfg-mobile-header">Australian Real Estate</div>
                    <div className="apfg-mobile-row">
                        <span className="apfg-mobile-label">ROI</span>
                        <span className="apfg-mobile-val">3 - 5%</span>
                    </div>
                    <div className="apfg-mobile-row">
                        <span className="apfg-mobile-label">Mgmt</span>
                        <span className="apfg-mobile-val">Agent Managed</span>
                    </div>
                    <div className="apfg-mobile-row">
                        <span className="apfg-mobile-label">Entry</span>
                        <span className="apfg-mobile-val">$600k+</span>
                    </div>
                    <div className="apfg-mobile-row">
                        <span className="apfg-mobile-label">Build Income</span>
                        <span className="apfg-mobile-val">0%</span>
                    </div>
                    <div className="apfg-mobile-row">
                        <span className="apfg-mobile-label">Personal Use</span>
                        <span className="apfg-mobile-val">No</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ComparisonTable;
