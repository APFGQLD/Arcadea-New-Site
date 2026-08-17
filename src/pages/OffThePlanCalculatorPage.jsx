import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    BuildingOffice2Icon,
    HomeModernIcon,
    ArrowTrendingUpIcon,
    ScaleIcon,
    BanknotesIcon,
    ReceiptPercentIcon,
    PlusCircleIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';
import usePageTitle from '../hooks/usePageTitle';
import './OffThePlanCalculatorPage.css';

/* ------------------------------------------------------------------ */
/*  Tax engine  (Queensland + Federal, 2026 Budget reforms)            */
/*                                                                     */
/*  Sources baked into these functions:                                */
/*   - QLD transfer duty rates (QRO 2025-26)                           */
/*   - Federal resident marginal rates 2026-27 (+2% Medicare)          */
/*   - 2026 Budget negative-gearing + CGT reform (law, from 1/7/2027)  */
/*     -> new builds (incl. off-the-plan) are EXEMPT and retain full   */
/*        negative gearing + the 50% CGT discount, and may CHOOSE      */
/*        between the 50% discount and the new indexation method.      */
/* ------------------------------------------------------------------ */

// QLD transfer duty — general (investor) rate
function qldDutyInvestor(v) {
    if (v <= 5000) return 0;
    if (v <= 75000) return (v - 5000) * 0.015;
    if (v <= 540000) return 1050 + (v - 75000) * 0.035;
    if (v <= 1000000) return 17325 + (v - 540000) * 0.045;
    return 38025 + (v - 1000000) * 0.0575;
}

// QLD transfer duty — home concession (owner-occupier)
function qldDutyHome(v) {
    if (v <= 350000) return v * 0.01;
    if (v <= 540000) return 3500 + (v - 350000) * 0.035;
    if (v <= 1000000) return 10150 + (v - 540000) * 0.045;
    return 30850 + (v - 1000000) * 0.0575;
}

// Resident marginal rate incl. 2% Medicare levy (2026-27 brackets)
function marginalRate(income) {
    let base;
    if (income <= 18200) base = 0;
    else if (income <= 45000) base = 0.15;   // 16% -> 15% from 1 Jul 2026
    else if (income <= 135000) base = 0.30;
    else if (income <= 190000) base = 0.37;
    else base = 0.45;
    const medicare = income > 29033 ? 0.02 : 0;
    return base + medicare;
}

const fmt = (n) =>
    new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
        maximumFractionDigits: 0
    }).format(Math.round(n || 0));

const fmtPct = (n) => `${(n * 100).toFixed(n < 0.1 ? 1 : 0)}%`;

const DEFAULTS = {
    purchaserType: 'investor', // 'investor' | 'owner'
    price: 650000,
    depositPct: 20,
    interestRate: 6.0,
    weeklyRent: 620,
    mgmtPct: 7,
    otherCosts: 6500,
    deprNew: 11000,   // new build: Div 43 + Div 40 (plant)
    deprEst: 6000,    // established: Div 43 only (no 2nd-hand plant)
    income: 150000,
    capGrowthNew: 5.0,   // capital growth p.a. — new build
    capGrowthEst: 5.0,   // capital growth p.a. — established
    rentGrowthNew: 3.0,  // rental growth p.a. — new build
    rentGrowthEst: 3.0,  // rental growth p.a. — established
    cpi: 2.5,
    holdYears: 10,
    sellingCostPct: 2.5,
    discountRate: 5.0 // for present-value comparison
};

function computeInvestor(i) {
    const price = +i.price || 0;
    const rate = marginalRate(+i.income || 0);
    const duty = qldDutyInvestor(price);
    const acquisitionCosts = 2500; // conveyancing / legal, indicative
    const costBase = price + duty + acquisitionCosts;

    const loan = price * (1 - (+i.depositPct || 0) / 100);
    const annualInterest = loan * ((+i.interestRate || 0) / 100);
    const baseRent = (+i.weeklyRent || 0) * 52;
    const mgmtPct = (+i.mgmtPct || 0) / 100;
    const otherCosts = +i.otherCosts || 0;

    const years = Math.max(1, Math.round(+i.holdYears || 1));
    const d = (+i.discountRate || 0) / 100;
    const cpi = (+i.cpi || 0) / 100;
    const pvFactorExit = Math.pow(1 + d, -years);

    // Year-by-year after-tax cash flow (present value) for one property.
    //  - rent grows each year at `rentGrowth`
    //  - interest-only loan, so interest is constant
    //  - depreciation is a non-cash deduction
    //  - `quarantine` = new rules: rental losses can't offset salary; they pool
    //    and are drawn down by later rental profits, then against the sale gain.
    function simulate(depr, rentGrowth, quarantine) {
        let pvCashFlow = 0;
        let carryPool = 0;
        let yr1TaxEffect = 0;
        for (let t = 1; t <= years; t++) {
            const rent = baseRent * Math.pow(1 + rentGrowth, t - 1);
            const cashCosts = annualInterest + rent * mgmtPct + otherCosts;
            const cashFlow = rent - cashCosts; // pre-tax cash position
            const taxable = cashFlow - depr; // incl. non-cash depreciation

            let taxEffect; // +ve = refund to investor, -ve = extra tax paid
            if (!quarantine) {
                taxEffect = -taxable * rate; // offsets all income
            } else if (taxable < 0) {
                carryPool += -taxable; // loss quarantined
                taxEffect = 0;
            } else {
                const offset = Math.min(carryPool, taxable);
                carryPool -= offset;
                taxEffect = -(taxable - offset) * rate; // net profit taxed
            }

            const afterTax = cashFlow + taxEffect;
            pvCashFlow += afterTax / Math.pow(1 + d, t);
            if (t === 1) yr1TaxEffect = taxEffect;
        }
        return { pvCashFlow, carryPool, yr1TaxEffect };
    }

    const simOtp = simulate(+i.deprNew || 0, (+i.rentGrowthNew || 0) / 100, false);
    const simEst = simulate(+i.deprEst || 0, (+i.rentGrowthEst || 0) / 100, true);

    // --- Capital gains at exit (each property grows at its own rate) ---
    const sellPct = (+i.sellingCostPct || 0) / 100;
    const indexedCostBase = costBase * Math.pow(1 + cpi, years);

    const saleOtp = price * Math.pow(1 + (+i.capGrowthNew || 0) / 100, years);
    const saleEst = price * Math.pow(1 + (+i.capGrowthEst || 0) / 100, years);
    const sellOtp = saleOtp * sellPct;
    const sellEst = saleEst * sellPct;

    const gainOtp = Math.max(0, saleOtp - sellOtp - costBase);
    const gainEst = Math.max(0, saleEst - sellEst - costBase);
    const realGainOtp = Math.max(0, saleOtp - sellOtp - indexedCostBase);
    const realGainEst = Math.max(0, saleEst - sellEst - indexedCostBase);

    // New build: choose the lower of 50% discount vs new indexation (+30% min)
    const cgtOtp50 = 0.5 * gainOtp * rate;
    const cgtOtpIndex = realGainOtp * Math.max(rate, 0.3);
    const otpChose50 = cgtOtp50 <= cgtOtpIndex;
    const cgtOtp = Math.min(cgtOtp50, cgtOtpIndex);

    // Established: indexation only, less any remaining carried-forward losses
    const estNetGain = Math.max(0, realGainEst - simEst.carryPool);
    const cgtEst = estNetGain * Math.max(rate, 0.3);

    // --- Present-value advantage of off-the-plan, decomposed ---
    const cashFlowAdvantagePV = simOtp.pvCashFlow - simEst.pvCashFlow;
    const capGrowthAdvantagePV =
        ((saleOtp - sellOtp) - (saleEst - sellEst)) * pvFactorExit;
    const cgtAdvantagePV = (cgtEst - cgtOtp) * pvFactorExit;
    const totalAdvantagePV =
        cashFlowAdvantagePV + capGrowthAdvantagePV + cgtAdvantagePV;

    return {
        rate, duty, costBase, years,
        pvCashFlowOtp: simOtp.pvCashFlow, pvCashFlowEst: simEst.pvCashFlow,
        yr1TaxEffectOtp: simOtp.yr1TaxEffect, yr1TaxEffectEst: simEst.yr1TaxEffect,
        estCarryRemaining: simEst.carryPool,
        saleOtp, saleEst, gainOtp, gainEst, realGainOtp, realGainEst,
        cgtOtp50, cgtOtpIndex, otpChose50, cgtOtp, cgtEst,
        cashFlowAdvantagePV, capGrowthAdvantagePV, cgtAdvantagePV, totalAdvantagePV
    };
}

function computeOwner(i) {
    const price = +i.price || 0;
    const dutyInvestor = qldDutyInvestor(price);
    const dutyHome = qldDutyHome(price);
    return { dutyInvestor, dutyHome, concession: dutyInvestor - dutyHome };
}

/* ------------------------------------------------------------------ */
/*  UI                                                                 */
/* ------------------------------------------------------------------ */

const Field = ({ label, prefix, suffix, hint, ...props }) => (
    <label className="otp-field">
        <span className="otp-field-label">{label}</span>
        <div className="otp-input-wrap">
            {prefix && <span className="otp-affix otp-prefix">{prefix}</span>}
            <input className="otp-input" {...props} />
            {suffix && <span className="otp-affix otp-suffix">{suffix}</span>}
        </div>
        {hint && <span className="otp-field-hint">{hint}</span>}
    </label>
);

const OffThePlanCalculatorPage = () => {
    usePageTitle('Off-the-Plan Tax Calculator');
    const [inp, setInp] = useState(DEFAULTS);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const set = (key) => (e) =>
        setInp((prev) => ({ ...prev, [key]: e.target.value }));

    const isInvestor = inp.purchaserType === 'investor';
    const r = useMemo(() => computeInvestor(inp), [inp]);
    const o = useMemo(() => computeOwner(inp), [inp]);

    return (
        <div className="otp-page">
            <div className="otp-hero">
                <div className="container">
                    <span className="otp-category">Investor Tools · Queensland</span>
                    <h1 className="otp-title">
                        Off-the-Plan vs Established: The 2026 Budget Impact
                    </h1>
                    <p className="otp-subtitle">
                        See how the federal negative-gearing and capital-gains reforms
                        reshape the numbers — and why new-build (off-the-plan) property
                        keeps the tax advantages established stock now loses.
                    </p>
                </div>
            </div>

            <div className="container otp-shell">
                {/* Purchaser toggle */}
                <div className="otp-toggle" role="tablist" aria-label="Purchaser type">
                    <button
                        role="tab"
                        aria-selected={isInvestor}
                        className={`otp-toggle-btn ${isInvestor ? 'active' : ''}`}
                        onClick={() => setInp((p) => ({ ...p, purchaserType: 'investor' }))}
                    >
                        <BuildingOffice2Icon className="otp-toggle-icon" />
                        Investor
                    </button>
                    <button
                        role="tab"
                        aria-selected={!isInvestor}
                        className={`otp-toggle-btn ${!isInvestor ? 'active' : ''}`}
                        onClick={() => setInp((p) => ({ ...p, purchaserType: 'owner' }))}
                    >
                        <HomeModernIcon className="otp-toggle-icon" />
                        Owner-Occupier
                    </button>
                </div>

                <div className="otp-grid">
                    {/* ---------------- Inputs ---------------- */}
                    <aside className="otp-inputs glass">
                        <h2 className="otp-panel-title">Your scenario</h2>

                        <Field
                            label="Purchase price"
                            prefix="$"
                            type="number"
                            value={inp.price}
                            onChange={set('price')}
                        />

                        {isInvestor && (
                            <>
                                <Field
                                    label="Deposit"
                                    suffix="%"
                                    type="number"
                                    value={inp.depositPct}
                                    onChange={set('depositPct')}
                                    hint="Balance is assumed borrowed (interest-only)."
                                />
                                <Field
                                    label="Interest rate"
                                    suffix="% p.a."
                                    type="number"
                                    step="0.1"
                                    value={inp.interestRate}
                                    onChange={set('interestRate')}
                                />
                                <Field
                                    label="Expected rent"
                                    prefix="$"
                                    suffix="/week"
                                    type="number"
                                    value={inp.weeklyRent}
                                    onChange={set('weeklyRent')}
                                />
                                <Field
                                    label="Property management"
                                    suffix="% of rent"
                                    type="number"
                                    step="0.5"
                                    value={inp.mgmtPct}
                                    onChange={set('mgmtPct')}
                                />
                                <Field
                                    label="Other holding costs"
                                    prefix="$"
                                    suffix="/year"
                                    type="number"
                                    value={inp.otherCosts}
                                    onChange={set('otherCosts')}
                                    hint="Council rates, body corporate, insurance, maintenance."
                                />
                                <div className="otp-field-pair">
                                    <Field
                                        label="Depreciation — new build"
                                        prefix="$"
                                        suffix="/yr"
                                        type="number"
                                        value={inp.deprNew}
                                        onChange={set('deprNew')}
                                    />
                                    <Field
                                        label="Depreciation — established"
                                        prefix="$"
                                        suffix="/yr"
                                        type="number"
                                        value={inp.deprEst}
                                        onChange={set('deprEst')}
                                    />
                                </div>
                                <p className="otp-field-hint otp-pair-hint">
                                    New builds claim Div 40 (plant) + Div 43 (building);
                                    established stock bought second-hand gets Div 43 only, so it
                                    is lower.
                                </p>
                                <Field
                                    label="Your taxable income"
                                    prefix="$"
                                    type="number"
                                    value={inp.income}
                                    onChange={set('income')}
                                    hint={`Marginal rate applied: ${fmtPct(r.rate)} (incl. Medicare).`}
                                />
                                <div className="otp-field-pair">
                                    <Field
                                        label="Capital growth — new"
                                        suffix="%"
                                        type="number"
                                        step="0.1"
                                        value={inp.capGrowthNew}
                                        onChange={set('capGrowthNew')}
                                    />
                                    <Field
                                        label="Capital growth — est."
                                        suffix="%"
                                        type="number"
                                        step="0.1"
                                        value={inp.capGrowthEst}
                                        onChange={set('capGrowthEst')}
                                    />
                                </div>
                                <p className="otp-field-hint otp-pair-hint">
                                    Annual capital growth for each property over the hold period.
                                </p>
                                <div className="otp-field-pair">
                                    <Field
                                        label="Rental growth — new"
                                        suffix="%"
                                        type="number"
                                        step="0.1"
                                        value={inp.rentGrowthNew}
                                        onChange={set('rentGrowthNew')}
                                    />
                                    <Field
                                        label="Rental growth — est."
                                        suffix="%"
                                        type="number"
                                        step="0.1"
                                        value={inp.rentGrowthEst}
                                        onChange={set('rentGrowthEst')}
                                    />
                                </div>
                                <p className="otp-field-hint otp-pair-hint">
                                    Annual rent increases, compounded each year from the starting
                                    rent above.
                                </p>
                                <Field
                                    label="Inflation (CPI)"
                                    suffix="% p.a."
                                    type="number"
                                    step="0.1"
                                    value={inp.cpi}
                                    onChange={set('cpi')}
                                    hint="Used for the new CGT indexation method."
                                />
                                <Field
                                    label="Hold period"
                                    suffix="years"
                                    type="number"
                                    value={inp.holdYears}
                                    onChange={set('holdYears')}
                                />
                                <Field
                                    label="Selling costs"
                                    suffix="% of sale"
                                    type="number"
                                    step="0.1"
                                    value={inp.sellingCostPct}
                                    onChange={set('sellingCostPct')}
                                />
                                <Field
                                    label="Discount rate"
                                    suffix="% p.a."
                                    type="number"
                                    step="0.1"
                                    value={inp.discountRate}
                                    onChange={set('discountRate')}
                                    hint="Converts future cash flows to today's dollars."
                                />
                            </>
                        )}
                    </aside>

                    {/* ---------------- Results ---------------- */}
                    <section className="otp-results">
                        {isInvestor ? (
                            <>
                                {/* Headline */}
                                <div className="otp-headline glass">
                                    <span className="otp-headline-label">
                                        Off-the-plan advantage · {r.years} yrs, today&apos;s dollars
                                    </span>
                                    <span
                                        className={`otp-headline-value ${
                                            r.totalAdvantagePV >= 0 ? 'pos' : 'neg'
                                        }`}
                                    >
                                        {r.totalAdvantagePV >= 0 ? '+' : '−'}
                                        {fmt(Math.abs(r.totalAdvantagePV))}
                                    </span>
                                    <span className="otp-headline-sub">
                                        Present value of the combined cash-flow, capital-growth and
                                        CGT difference between a new build (budget-exempt) and an
                                        established property (new rules), discounted at{' '}
                                        {fmtPct((+inp.discountRate || 0) / 100)}.
                                    </span>
                                </div>

                                {/* Side by side */}
                                <div className="otp-compare">
                                    <div className="otp-col otp-col-otp">
                                        <div className="otp-col-head">
                                            <BuildingOffice2Icon className="otp-col-icon" />
                                            <div>
                                                <h3>Off-the-plan</h3>
                                                <span>New build · budget-exempt</span>
                                            </div>
                                        </div>
                                        <Row label="Stamp duty (QLD)" value={fmt(r.duty)} />
                                        <Row
                                            label={`Sale price (${r.years}y)`}
                                            value={fmt(r.saleOtp)}
                                        />
                                        <Row
                                            label="Capital gain"
                                            value={fmt(r.gainOtp)}
                                        />
                                        <Row
                                            label="After-tax cash flow (PV)"
                                            value={fmt(r.pvCashFlowOtp)}
                                            good
                                        />
                                        <Row
                                            label="CGT on exit"
                                            value={fmt(r.cgtOtp)}
                                            good
                                        />
                                    </div>

                                    <div className="otp-col otp-col-est">
                                        <div className="otp-col-head">
                                            <HomeModernIcon className="otp-col-icon" />
                                            <div>
                                                <h3>Established</h3>
                                                <span>New rules apply</span>
                                            </div>
                                        </div>
                                        <Row label="Stamp duty (QLD)" value={fmt(r.duty)} />
                                        <Row
                                            label={`Sale price (${r.years}y)`}
                                            value={fmt(r.saleEst)}
                                        />
                                        <Row
                                            label="Capital gain"
                                            value={fmt(r.gainEst)}
                                        />
                                        <Row
                                            label="After-tax cash flow (PV)"
                                            value={fmt(r.pvCashFlowEst)}
                                            note="gearing quarantined"
                                            bad
                                        />
                                        <Row
                                            label="CGT on exit"
                                            value={fmt(r.cgtEst)}
                                            bad
                                        />
                                    </div>
                                </div>

                                {/* Two taxation options for the new build */}
                                <div className="otp-cgt glass">
                                    <div className="otp-cgt-head">
                                        <ScaleIcon className="otp-cgt-icon" />
                                        <h3>Your CGT choice on the new build</h3>
                                    </div>
                                    <p className="otp-cgt-intro">
                                        Because it is a new build, on sale you may pick whichever
                                        of the two regimes produces the lower tax — a choice
                                        established property no longer gets.
                                    </p>
                                    <div className="otp-cgt-options">
                                        <div
                                            className={`otp-cgt-opt ${
                                                r.otpChose50 ? 'chosen' : ''
                                            }`}
                                        >
                                            <span className="otp-cgt-opt-name">
                                                50% discount
                                                <em>(old regime)</em>
                                            </span>
                                            <span className="otp-cgt-opt-val">
                                                {fmt(r.cgtOtp50)}
                                            </span>
                                            {r.otpChose50 && (
                                                <span className="otp-cgt-badge">Best for you</span>
                                            )}
                                        </div>
                                        <div
                                            className={`otp-cgt-opt ${
                                                !r.otpChose50 ? 'chosen' : ''
                                            }`}
                                        >
                                            <span className="otp-cgt-opt-name">
                                                CPI indexation
                                                <em>+ 30% min (new regime)</em>
                                            </span>
                                            <span className="otp-cgt-opt-val">
                                                {fmt(r.cgtOtpIndex)}
                                            </span>
                                            {!r.otpChose50 && (
                                                <span className="otp-cgt-badge">Best for you</span>
                                            )}
                                        </div>
                                    </div>
                                    <p className="otp-cgt-foot">
                                        New build sale price {fmt(r.saleOtp)} · nominal gain{' '}
                                        {fmt(r.gainOtp)} · real (indexed) gain{' '}
                                        {fmt(r.realGainOtp)}.
                                    </p>
                                </div>

                                {/* Breakdown of the advantage */}
                                <div className="otp-breakdown glass">
                                    <div className="otp-break-item">
                                        <BanknotesIcon className="otp-break-icon" />
                                        <div>
                                            <span className="otp-break-label">
                                                Cash-flow advantage (PV)
                                            </span>
                                            <span className="otp-break-val">
                                                {fmt(r.cashFlowAdvantagePV)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="otp-break-item">
                                        <ArrowTrendingUpIcon className="otp-break-icon" />
                                        <div>
                                            <span className="otp-break-label">
                                                Capital growth advantage (PV)
                                            </span>
                                            <span className="otp-break-val">
                                                {fmt(r.capGrowthAdvantagePV)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="otp-break-item">
                                        <ReceiptPercentIcon className="otp-break-icon" />
                                        <div>
                                            <span className="otp-break-label">
                                                CGT advantage on exit (PV)
                                            </span>
                                            <span className="otp-break-val">
                                                {fmt(r.cgtAdvantagePV)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="otp-break-item total">
                                        <PlusCircleIcon className="otp-break-icon" />
                                        <div>
                                            <span className="otp-break-label">
                                                Total advantage (PV)
                                            </span>
                                            <span className="otp-break-val">
                                                {fmt(r.totalAdvantagePV)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* ---------------- Owner-occupier ---------------- */
                            <div className="otp-owner glass">
                                <div className="otp-owner-duty">
                                    <span className="otp-headline-label">
                                        Estimated QLD transfer duty (home concession)
                                    </span>
                                    <span className="otp-headline-value pos">
                                        {fmt(o.dutyHome)}
                                    </span>
                                    <span className="otp-headline-sub">
                                        {fmt(o.concession)} less than the investor rate of{' '}
                                        {fmt(o.dutyInvestor)}, thanks to the owner-occupier home
                                        concession.
                                    </span>
                                </div>
                                <div className="otp-owner-note">
                                    <InformationCircleIcon className="otp-owner-note-icon" />
                                    <div>
                                        <h3>The 2026 Budget changes don&apos;t hit you</h3>
                                        <p>
                                            The negative-gearing and capital-gains reforms target{' '}
                                            <strong>investors</strong>. As an owner-occupier you
                                            don&apos;t negatively gear, and your home is generally
                                            exempt from capital gains tax under the main-residence
                                            exemption — so neither reform changes your position.
                                        </p>
                                        <p>
                                            First-home buyers of a <strong>new build</strong> in
                                            Queensland may also qualify for a full first-home
                                            transfer-duty concession — worth checking before you
                                            buy. Switch to the <strong>Investor</strong> tab to see
                                            where the budget really bites.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CTA */}
                        <div className="otp-cta glass">
                            <h3>Want this modelled on a real Arcadea project?</h3>
                            <p>
                                Our Brisbane team can run these numbers against a specific
                                off-the-plan opportunity, including projected depreciation and
                                rental yields.
                            </p>
                            <div className="otp-actions">
                                <Link to="/properties" className="btn btn-primary">
                                    View properties
                                </Link>
                                <a href="/#contact" className="btn btn-secondary">
                                    Talk to us
                                </a>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Disclaimer */}
                <div className="otp-disclaimer">
                    <p>
                        <strong>Important:</strong> This calculator is an educational
                        illustration only and is not financial, tax or legal advice. It applies
                        the 2026 Federal Budget negative-gearing and CGT reforms (law, effective
                        1 July 2027; new builds exempt) and 2025–26 Queensland transfer-duty
                        rates using simplified assumptions — including an interest-only loan, a
                        constant marginal tax rate, and straight-line growth. Individual
                        circumstances, eligibility and future law changes will alter the
                        outcome. Always obtain advice from a licensed accountant or financial
                        adviser before making a decision.
                    </p>
                </div>
            </div>
        </div>
    );
};

const Row = ({ label, value, good, bad, note }) => (
    <div className="otp-row">
        <span className="otp-row-label">
            {label}
            {note && <em className="otp-row-note"> · {note}</em>}
        </span>
        <span
            className={`otp-row-value ${good ? 'good' : ''} ${bad ? 'bad' : ''}`}
        >
            {value}
        </span>
    </div>
);

export default OffThePlanCalculatorPage;
