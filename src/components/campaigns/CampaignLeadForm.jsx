import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAttribution, trackEvent } from './campaignTracking';

/*
 * Enquiry form for campaign pages. Leads go to Leadrouter, which assigns a
 * rep and creates the lead in Pipedrive.
 *
 * LEADROUTER_URL is the full webhook URL for the campaign's LeadSource,
 * token included. Hostinger builds the site from `main` without a .env, so
 * the URL is set here; VITE_LEADROUTER_WEBHOOK_URL overrides it (e.g. to
 * point a local build at a test source). The token is visible in the page's
 * JavaScript, as any browser-posted form key is: if it's abused, rotate it
 * in Leadrouter and update it here.
 * The payload is flat form fields; map name/email/phone/message in the
 * LeadSource's field mapping and add the rest (interest, locations, budget,
 * utm_*, landing_variant, page) to its message extras.
 *
 * Leadrouter doesn't send CORS headers yet, so the browser posts a "simple"
 * form request in no-cors mode: it arrives, but the page can't read the
 * response. A network failure still rejects, and then (or when the variable
 * isn't set) the lead goes to the site's Web3Forms inbox instead, so it's
 * never lost.
 */

const LEADROUTER_URL =
    import.meta.env.VITE_LEADROUTER_WEBHOOK_URL ||
    'https://leads.arcadea.com.au/api/webhooks/arcadea-site-commerical-landing-page?token=cmwwyg01n0i97op01u2k1l9pm';
const WEB3FORMS_ACCESS_KEY = 'b3b849b8-aba3-4477-9c72-290007faa250';

const EMPTY = { name: '', email: '', phone: '', interest: '', locations: [], budget: '', message: '', consent: false };

async function sendToLeadrouter(fields) {
    await fetch(LEADROUTER_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(fields).toString(),
    });
}

async function sendToWeb3Forms(fields, subject) {
    const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_key: WEB3FORMS_ACCESS_KEY, subject, ...fields }),
    });
    const json = await res.json();
    if (!json.success) throw new Error('Web3Forms rejected the submission');
}

const CampaignLeadForm = ({ campaign, variant, subject, interestOptions, budgetOptions, locationOptions, preselect }) => {
    const [data, setData] = useState(EMPTY);

    // A location picked elsewhere on the page ({ town }) is ticked here.
    // Adjusting state while rendering when the prop changes, per the React docs.
    const [seenPreselect, setSeenPreselect] = useState(null);
    if (preselect !== seenPreselect) {
        setSeenPreselect(preselect);
        if (preselect?.town && !data.locations.includes(preselect.town)) {
            setData({ ...data, locations: [...data.locations, preselect.town] });
        }
    }
    const [trap, setTrap] = useState('');
    const [status, setStatus] = useState('idle'); // idle | sending | success | error
    const [sentName, setSentName] = useState('');

    const set = (name, value) => setData((d) => ({ ...d, [name]: value }));
    const toggleLocation = (loc) =>
        setData((d) => ({
            ...d,
            locations: d.locations.includes(loc) ? d.locations.filter((l) => l !== loc) : [...d.locations, loc],
        }));

    const onSubmit = async (e) => {
        e.preventDefault();
        // Honeypot: people never see this field, so anything in it is a bot.
        // Show the normal success state and send nothing.
        if (trap) {
            setStatus('success');
            return;
        }
        setStatus('sending');

        const attribution = getAttribution(variant);
        const fields = {
            name: data.name.trim(),
            email: data.email.trim(),
            phone: data.phone.trim(),
            message: data.message.trim() || 'Requested a 20-minute initial discussion.',
            interest: data.interest,
            locations: data.locations.join(', ') || 'Not specified',
            budget: data.budget || 'Not specified',
            consent: 'Yes',
            campaign,
            page: window.location.origin + window.location.pathname,
            ...attribution,
        };

        try {
            if (LEADROUTER_URL) {
                try {
                    await sendToLeadrouter(fields);
                } catch {
                    await sendToWeb3Forms(fields, subject);
                }
            } else {
                await sendToWeb3Forms(fields, subject);
            }
            trackEvent('generate_lead', {
                campaign,
                landing_variant: attribution.landing_variant,
                interest: data.interest,
                budget: data.budget,
            });
            setSentName(data.name.trim().split(/\s+/)[0]);
            setData(EMPTY);
            setStatus('success');
        } catch {
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="cmp-form-done" role="status">
                <span className="cmp-eyebrow">Enquiry received</span>
                <h3 className="cmp-h3">Thank you{sentName ? `, ${sentName}` : ''}.</h3>
                <p>
                    One of our team will contact you to find a time for your 20-minute discussion, on Zoom or
                    Teams, whichever suits you.
                </p>
                <p>
                    While you wait, <a href="#seven-reasons">revisit the seven reasons →</a>
                </p>
            </div>
        );
    }

    const busy = status === 'sending';

    return (
        <form className="cmp-form" onSubmit={onSubmit} noValidate={false}>
            <div className="cmp-form-row">
                <div className="cmp-field">
                    <label htmlFor="cmp-name">Name</label>
                    <input id="cmp-name" name="name" autoComplete="name" required disabled={busy}
                        value={data.name} onChange={(e) => set('name', e.target.value)} />
                </div>
                <div className="cmp-field">
                    <label htmlFor="cmp-email">Email</label>
                    <input id="cmp-email" name="email" type="email" autoComplete="email" required disabled={busy}
                        value={data.email} onChange={(e) => set('email', e.target.value)} />
                </div>
            </div>

            <div className="cmp-form-row">
                <div className="cmp-field">
                    <label htmlFor="cmp-phone">Mobile</label>
                    <input id="cmp-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" required disabled={busy}
                        value={data.phone} onChange={(e) => set('phone', e.target.value)} />
                </div>
                <div className="cmp-field">
                    <label htmlFor="cmp-budget">Budget</label>
                    <select id="cmp-budget" name="budget" disabled={busy}
                        value={data.budget} onChange={(e) => set('budget', e.target.value)}>
                        <option value="">Select a range</option>
                        {budgetOptions.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                </div>
            </div>

            <fieldset className="cmp-field cmp-choices">
                <legend>I’m interested as</legend>
                <div className="cmp-chips">
                    {interestOptions.map((opt) => (
                        <label key={opt} className="cmp-chip">
                            <input type="radio" name="interest" value={opt} required disabled={busy}
                                checked={data.interest === opt} onChange={() => set('interest', opt)} />
                            <span>{opt}</span>
                        </label>
                    ))}
                </div>
            </fieldset>

            <fieldset className="cmp-field cmp-choices">
                <legend>Preferred locations <small>(optional, choose any)</small></legend>
                <div className="cmp-chips">
                    {locationOptions.map((loc) => (
                        <label key={loc} className="cmp-chip">
                            <input type="checkbox" name="locations" value={loc} disabled={busy}
                                checked={data.locations.includes(loc)} onChange={() => toggleLocation(loc)} />
                            <span>{loc}</span>
                        </label>
                    ))}
                </div>
            </fieldset>

            <div className="cmp-field">
                <label htmlFor="cmp-message">Anything we should know? <small>(optional)</small></label>
                <textarea id="cmp-message" name="message" rows="3" disabled={busy}
                    value={data.message} onChange={(e) => set('message', e.target.value)} />
            </div>

            {/* Honeypot, hidden from people and screen readers */}
            <div className="cmp-hp" aria-hidden="true">
                <label htmlFor="cmp-website">Website</label>
                <input id="cmp-website" name="website" tabIndex={-1} autoComplete="off"
                    value={trap} onChange={(e) => setTrap(e.target.value)} />
            </div>

            <label className="cmp-consent">
                <input type="checkbox" name="consent" required disabled={busy}
                    checked={data.consent} onChange={(e) => set('consent', e.target.checked)} />
                <span>
                    I agree to Arcadea Property contacting me about commercial and industrial property, and I’ve
                    read the <Link to="/privacy-policy">Privacy Policy</Link>. I understand this page is general
                    information, not financial advice.
                </span>
            </label>

            {status === 'error' && (
                <p className="cmp-form-error" role="alert">
                    Something went wrong sending your enquiry. Please try again, or email us at{' '}
                    <a href="mailto:info@arcadea.com.au">info@arcadea.com.au</a>.
                </p>
            )}

            <button type="submit" className="cmp-btn cmp-btn-primary" disabled={busy}>
                {busy ? 'Sending…' : 'Request my discussion'}
            </button>
        </form>
    );
};

export default CampaignLeadForm;
