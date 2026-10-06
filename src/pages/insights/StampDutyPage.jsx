import React, { useState } from 'react';
import {
    BriefcaseIcon,
    HomeIcon,
    KeyIcon,
    ClockIcon,
    DocumentCheckIcon,
} from '@heroicons/react/24/outline';
import {
    InsightPage,
    InsightHero,
    ShortVersion,
    Section,
    Panel,
    Split,
    Callout,
    LiveNote,
    KeyFigures,
    FeatureCards,
    BarList,
    Checklist,
    InsightCTA,
    RelatedInsights,
    FinePrint,
} from '../../components/insights/InsightKit';
import { fmtAud } from '../../components/insights/format';
import { Segmented, ChartDataTable } from '../../components/InsightCharts';
import { INSIGHTS } from '../../data/insights/shared';
import {
    VIDEO,
    RATES_AS_AT,
    BUYERS,
    PRESETS,
    PRICE_RANGE,
    GRANT,
    investorDuty,
    homeDuty,
    firstHomeConcession,
    firstHomeEstablishedDuty,
    DISCLOSURE,
    UPDATED,
    DISCLAIMER,
    DETAILS,
    SOURCES,
} from '../../data/insights/stampDuty';

const skylineSet = (format) =>
    [800, 1400, 2000].map((w) => `/images/insights/gold-coast-skyline-${w}.${format} ${w}w`).join(', ');

const HERO_IMAGE = {
    src: '/images/insights/gold-coast-skyline-1400.jpg',
    sources: [
        { type: 'image/avif', srcSet: skylineSet('avif') },
        { type: 'image/webp', srcSet: skylineSet('webp') },
    ],
    position: '55% 45%',
};

const priceLabel = (p) => (p >= 1000000 ? `$${(p / 1000000).toFixed(p % 1000000 ? 1 : 0)}M` : `$${p / 1000}k`);

// Fixed scale, so bars grow and shrink as the price moves
const BAR_MAX = Math.ceil(investorDuty(PRICE_RANGE.max) / 10000) * 10000;

const DutyComparison = () => {
    const [price, setPrice] = useState(850000);
    const est = firstHomeEstablishedDuty(price);
    const grantNote = price < GRANT.under
        ? ` Under ${fmtAud(GRANT.under)}, a new first home may also qualify for the ${fmtAud(GRANT.amount)} First Home Owner Grant.`
        : '';

    return (
        <Panel
            controls={
                <div className="ins-price-controls">
                    <Segmented
                        label="Example prices"
                        options={PRESETS.map((p) => ({ value: p, label: priceLabel(p) }))}
                        value={price}
                        onChange={setPrice}
                    />
                    <div className="ins-slider">
                        <label htmlFor="duty-price">
                            Price <strong>{fmtAud(price)}</strong>
                        </label>
                        <input
                            id="duty-price"
                            type="range"
                            min={PRICE_RANGE.min}
                            max={PRICE_RANGE.max}
                            step={PRICE_RANGE.step}
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            aria-valuetext={fmtAud(price)}
                        />
                        <div className="ins-slider-ends" aria-hidden="true">
                            <span>{priceLabel(PRICE_RANGE.min)}</span>
                            <span>{priceLabel(PRICE_RANGE.max)}</span>
                        </div>
                    </div>
                </div>
            }
            footnote={
                <>
                    Arcadea&apos;s arithmetic from Queensland Revenue Office rates at {RATES_AS_AT}. An estimate only, for
                    a home and its land in Queensland; it doesn&apos;t cover foreign buyer duty or every eligibility rule.
                    Check yours with the{' '}
                    <a href="https://qro.qld.gov.au/duties/transfer-duty/calculate/rates/" target="_blank" rel="noopener noreferrer">
                        QRO&apos;s published rates
                    </a>{' '}
                    or your conveyancer.
                </>
            }
            table={
                <ChartDataTable
                    caption={`Transfer duty by buyer, QRO rates at ${RATES_AS_AT}`}
                    columns={['Price', ...BUYERS.map((b) => `${b.label}, ${b.sub.toLowerCase()}`)]}
                    rows={PRESETS.map((p) => [fmtAud(p), ...BUYERS.map((b) => fmtAud(b.duty(p)))])}
                />
            }
        >
            <LiveNote>
                {est > 0 ? (
                    <>
                        At <strong>{fmtAud(price)}</strong>, a first home buyer pays <strong>{fmtAud(est)}</strong> in duty
                        on an established home, and <strong>nothing</strong> on a new one.
                    </>
                ) : (
                    <>
                        At <strong>{fmtAud(price)}</strong>, a first home buyer pays no duty on either.
                    </>
                )}
                {grantNote}
            </LiveNote>
            <BarList
                max={BAR_MAX}
                format={fmtAud}
                items={BUYERS.map((b) => {
                    const duty = b.duty(price);
                    return {
                        label: b.label,
                        sub: b.sub,
                        value: duty,
                        tone: b.key === 'fhbNew' ? 'accent' : b.key === 'fhbEst' ? 'primary' : 'neutral',
                        highlight: b.key === 'fhbNew',
                    };
                })}
                ariaLabel={`Transfer duty at ${fmtAud(price)} for each type of buyer`}
            />
        </Panel>
    );
};

/** A worked example laid out like a receipt. */
const Receipt = ({ title, rows, total, tone }) => (
    <Panel className={`ins-receipt ${tone ? `tone-${tone}` : ''}`}>
        <h3 className="ins-panel-title">{title}</h3>
        <dl>
            {rows.map(([k, v]) => (
                <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                </div>
            ))}
            <div className="ins-receipt-total">
                <dt>Duty</dt>
                <dd>{total}</dd>
            </div>
        </dl>
    </Panel>
);

const EXAMPLE = 850000;

const StampDutyPage = () => (
    <InsightPage
        title="Stamp Duty: New vs Established for First Home Buyers"
        description="In Queensland, a first home buyer pays no transfer duty on a new home, with no price cap. Compare duty on new and established homes at any price, plus the $30,000 First Home Owner Grant."
    >
        <InsightHero
            eyebrow="First home buyers · Queensland · October 2026"
            title="Same price, different duty."
            accent="New or established can change what you pay."
            subtitle="In Queensland, a first home buyer pays no transfer duty on a new home, with no price cap. On an established home, the concession runs out at $800,000, and the $30,000 grant is for new homes only."
            image={HERO_IMAGE}
            video={VIDEO}
            notice={<><strong>Illustrative only.</strong> Not financial, tax or legal advice. QRO rates at {RATES_AS_AT}.</>}
            stats={[
                { display: '$0', label: 'Duty for a first home buyer on a new home, at any price', foot: 'Contracts from 1 May 2025' },
                { value: firstHomeEstablishedDuty(1200000), prefix: '$', label: 'Duty for a first home buyer on a $1.2M established home', foot: 'QRO rates' },
                { value: GRANT.amount, prefix: '$', label: 'First Home Owner Grant, new homes under $750,000 only', foot: 'Contracts from 20 Nov 2023' },
            ]}
        />

        <ShortVersion
            items={[
                'Transfer duty depends on who is buying and what they buy. Investors pay general rates, home buyers pay less, and first home buyers get more help again.',
                'A first home buyer pays no duty on a new home, at any price. On an established home, the first home concession shrinks above $710,000 and is gone at $800,000.',
                'The $30,000 First Home Owner Grant is for new homes under $750,000 only.',
                'For investors, new or established makes no difference: the duty is the same.',
            ]}
        />

        <Section
            id="how-duty-works"
            number={1}
            title="How transfer duty works in Queensland"
            lede={<p>Transfer duty, often called stamp duty, depends on who&apos;s buying and what they buy.</p>}
        >
            <FeatureCards
                items={[
                    { icon: BriefcaseIcon, title: 'Investors', body: 'Pay general rates, whether the property is new or established.' },
                    { icon: HomeIcon, title: 'Home buyers', body: 'Pay lower home concession rates on a home they’ll live in.' },
                    { icon: KeyIcon, title: 'First home buyers', body: 'Get more help again: a concession on established homes under $800,000, and no duty at all on a new home.', highlight: true },
                ]}
            />
        </Section>

        <Section
            id="compare"
            number={2}
            kicker="Try a price"
            title="New vs established, at any price"
            lede={<p>Pick one of the prices from the video, or slide to your own.</p>}
        >
            <DutyComparison />
        </Section>

        <Section
            id="new-home-concession"
            number={3}
            title="The new-home concession"
            lede={
                <p>
                    The first home (new home) concession means <strong>no transfer duty</strong> on a new first home, and
                    there&apos;s <strong>no price cap</strong>. At $1.2 million, the established home costs over $42,000 in
                    duty. The new one, still nothing.
                </p>
            }
        >
            <Checklist
                icon={DocumentCheckIcon}
                items={[
                    { title: 'Duty: nil', body: 'A full concession on the home and its residential land.' },
                    { title: 'No value cap', body: 'It applies at any price.' },
                    { title: 'Contracts dated 1 May 2025 or later' },
                    { title: 'New homes', body: 'Never occupied or sold as a residence, or substantially renovated. Not vacant land.' },
                ]}
            />
        </Section>

        <Section
            id="grant"
            number={4}
            title="The $30,000 grant"
            lede={
                <p>
                    Under $750,000, there&apos;s also the First Home Owner Grant, for contracts signed on or after 20
                    November 2023. It&apos;s <strong>only for new homes</strong>. At $700,000 an established first home
                    also pays no duty, so the grant is the difference.
                </p>
            }
        >
            <KeyFigures
                items={[
                    { value: GRANT.amount, prefix: '$', label: 'First Home Owner Grant', foot: 'Queensland', tone: 'accent' },
                    { display: 'Under $750k', label: 'Value of the home and land', foot: 'Price limit' },
                    { display: 'New only', label: 'Established homes don’t qualify', foot: 'Eligibility' },
                ]}
            />
        </Section>

        <Section
            id="conditions"
            number={5}
            title="The conditions"
            lede={<p>The new-home concession comes with conditions. In short:</p>}
        >
            <Checklist
                items={[
                    { title: 'It’s your first home', body: 'You’ve never held an interest in a residence, anywhere.' },
                    { title: 'You’re 18 or older' },
                    { title: 'The contract is dated 1 May 2025 or later' },
                    { title: 'You move in within a year', body: 'And live there.' },
                    { title: 'You keep it for that first year', body: 'You don’t sell, transfer or lease the whole property within it.' },
                    { title: 'From 1 August 2026: citizenship or residency', body: 'You need to be an Australian citizen, permanent resident or specified foreign retiree.' },
                ]}
            />
        </Section>

        <Section
            id="investors"
            number={6}
            title="Investors: no difference"
            lede={<p>For investors, the duty is the same whether the property is new or established.</p>}
        >
            <Panel footnote="General rates, QRO, at a $650,000 example price.">
                <BarList
                    max={30000}
                    format={fmtAud}
                    items={[
                        { label: 'Investor, new', value: investorDuty(650000), tone: 'neutral' },
                        { label: 'Investor, established', value: investorDuty(650000), tone: 'neutral' },
                    ]}
                    ariaLabel="An investor pays $22,275 duty at $650,000, new or established"
                />
            </Panel>
        </Section>

        <Section
            id="worked-example"
            number={7}
            kicker="Illustrative"
            title="A worked example"
            lede={<p>A first home buyer at {fmtAud(EXAMPLE)}, buying established or new.</p>}
        >
            <Split>
                <Receipt
                    title="Established home"
                    rows={[
                        ['Price', fmtAud(EXAMPLE)],
                        ['Duty at home concession rates', fmtAud(homeDuty(EXAMPLE))],
                        ['First home concession', firstHomeConcession(EXAMPLE) ? `−${fmtAud(firstHomeConcession(EXAMPLE))}` : 'None from $800k'],
                    ]}
                    total={fmtAud(firstHomeEstablishedDuty(EXAMPLE))}
                />
                <Receipt
                    tone="accent"
                    title="New home"
                    rows={[
                        ['Price', fmtAud(EXAMPLE)],
                        ['First home (new home) concession', 'Full concession'],
                        ['Price cap', 'None'],
                    ]}
                    total="$0"
                />
            </Split>
            <Callout title={`${fmtAud(firstHomeEstablishedDuty(EXAMPLE))} less duty to pay`}>
                <p>On the same price, the new home needs that much less cash for duty. The rest of your costs still apply.</p>
            </Callout>
        </Section>

        <Section
            id="keep-in-mind"
            number={8}
            title="Keep in mind"
        >
            <Checklist
                icon={ClockIcon}
                items={[
                    { title: 'Rates and concessions change', body: `These figures use QRO rates at ${RATES_AS_AT}. Check them again before you sign.` },
                    { title: 'When duty is paid', body: 'It depends on how the transaction is lodged. Ask your conveyancer.' },
                    { title: 'Eligibility is yours to confirm', body: 'The QRO sets the rules for each concession and the grant, and checks them.' },
                    { title: 'Cost, not value', body: 'This page compares duty only. It says nothing about which home is the better buy.' },
                ]}
            />
        </Section>

        <InsightCTA
            title="Buying your first home? Talk to Arcadea."
            body="We can show you new homes under and over $750,000, and walk you through the concessions that apply."
            actions={[
                { href: '/properties', label: 'Browse new homes' },
                { href: '/#contact', label: 'Talk to our team' },
            ]}
        />

        <RelatedInsights items={[INSIGHTS.rates, INSIGHTS.newVsEstablished]} />

        <FinePrint
            disclaimer={DISCLAIMER}
            details={DETAILS}
            disclosure={DISCLOSURE}
            updated={UPDATED}
            sources={SOURCES}
        />
    </InsightPage>
);

export default StampDutyPage;
