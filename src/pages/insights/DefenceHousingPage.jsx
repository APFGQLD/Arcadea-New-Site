import React, { useState } from 'react';
import {
    HomeModernIcon,
    BuildingLibraryIcon,
    UserGroupIcon,
    CalendarDaysIcon,
    BanknotesIcon,
    ArrowPathIcon,
    QuestionMarkCircleIcon,
    ArrowsRightLeftIcon,
} from '@heroicons/react/24/outline';
import {
    InsightPage,
    InsightHero,
    ShortVersion,
    Section,
    Panel,
    Prose,
    Callout,
    LiveNote,
    KeyFigures,
    FeatureCards,
    SplitBar,
    Checklist,
    InsightCTA,
    RelatedInsights,
    FinePrint,
} from '../../components/insights/InsightKit';
import { Segmented } from '../../components/InsightCharts';
import { INSIGHTS } from '../../data/insights/shared';
import {
    VIDEO,
    EXAMPLE_RENT,
    FEES,
    DISCLOSURE,
    UPDATED,
    DISCLAIMER,
    DETAILS,
    SOURCES,
} from '../../data/insights/defenceHousing';

const FeeExample = () => {
    const [rate, setRate] = useState(FEES[0].value);
    const fee = Math.round((EXAMPLE_RENT * rate) / 100);
    const left = EXAMPLE_RENT - fee;
    return (
        <Panel
            controls={
                <Segmented
                    label="DHA service fee"
                    options={FEES}
                    value={rate}
                    onChange={setRate}
                />
            }
            footnote={`Illustrative: $${EXAMPLE_RENT} a week is an example rent, not a specific property. DHA's fee is ${FEES[0].value}% (inc GST) of the rent for most free-standing houses and ${FEES[1].value}% where a body corporate covers most common areas. Your other costs come out of what's left.`}
        >
            <LiveNote>
                On <strong>${EXAMPLE_RENT} a week</strong> at {rate}%, <strong>${fee}</strong> goes to DHA, leaving{' '}
                <strong>${left}</strong> before your other costs.
            </LiveNote>
            <SplitBar
                total={EXAMPLE_RENT}
                ariaLabel={`$${EXAMPLE_RENT} weekly rent split into $${left} left before other costs and a $${fee} DHA service fee`}
                parts={[
                    { label: 'Left before your other costs', value: left, display: `$${left}`, tone: 'primary' },
                    { label: "DHA's service fee", value: fee, display: `$${fee}`, tone: 'neutral' },
                ]}
            />
        </Panel>
    );
};

const DefenceHousingPage = () => (
    <InsightPage seo={INSIGHTS.defenceHousing.seo}>
        <InsightHero
            eyebrow="Investor explainer · Townsville · October 2026"
            title="What if your tenant was the government?"
            accent="In Townsville, for some investors, it is."
            subtitle="Defence Housing Australia leases homes from private investors to house Defence members and their families. Here's how a DHA lease works, what it costs, and what it doesn't cover."
            image={{ src: '/images/insights/townsville-castle-hill-1080.jpg', position: '70% 40%' }}
            video={VIDEO}
            notice={<><strong>General information only.</strong> Not financial, tax or legal advice. Read the lease before the yield.</>}
            stats={[
                { value: 400, suffix: '+', label: 'New homes being built in Townsville to lease to DHA', foot: 'Announced Dec 2024' },
                { from: 3, value: 12, suffix: ' yrs', label: 'Lease terms of 3, 6, 9 or 12 years, with options to extend', foot: 'DHA' },
                { value: 16.5, decimals: 1, suffix: '%', label: "DHA's service fee on most houses; 13% with a body corporate", foot: 'Of the rent, inc GST' },
            ]}
        />

        <ShortVersion
            items={[
                "Townsville is Australia's largest garrison city, and more than 400 new homes are being built there to lease to Defence Housing Australia.",
                "With a DHA lease, DHA is your tenant, not the service member. Rent is paid monthly in advance, even when the home is empty, as long as it's habitable.",
                'An independent valuer resets the rent to market, usually every year. DHA keeps a service fee of 16.5% of the rent on most houses, or 13% with a body corporate.',
                "Rates, insurance, body corporate, land tax and structural repairs are still yours. A government tenant removes some risks, not all of them.",
            ]}
        />

        <Section
            id="what-is-a-dha-lease"
            number={1}
            title="What is a DHA lease?"
            lede={
                <p>
                    Defence Housing Australia (DHA) houses Defence members and their families. Much of that housing is
                    leased from private investors. <strong>You own the home, DHA leases it from you</strong>, and DHA
                    places a Defence household in it.
                </p>
            }
        >
            <FeatureCards
                items={[
                    { icon: HomeModernIcon, title: 'You', body: 'Own the property, and pay the owner’s costs: rates, insurance, body corporate, land tax and structural repairs.' },
                    { icon: BuildingLibraryIcon, title: 'DHA', body: 'Is the tenant on the lease. It pays the rent, manages the property and charges a service fee.', highlight: true, tag: 'Your tenant' },
                    { icon: UserGroupIcon, title: 'A Defence household', body: 'Lives in the home. The service member is not your tenant: DHA is.' },
                ]}
            />
        </Section>

        <Section
            id="why-townsville"
            number={2}
            title="Why Townsville"
            lede={
                <p>
                    The Minister for Defence Personnel calls Townsville <strong>Australia&apos;s largest garrison city</strong>.
                    It&apos;s home to Lavarack Barracks, the largest Australian Army base and home of the 3rd Brigade, and to
                    RAAF Base Townsville.
                </p>
            }
        >
            <KeyFigures
                items={[
                    { value: 400, suffix: '+', label: 'New homes being built in Townsville to lease to DHA', foot: 'Contracts Dec 2024 · first homes 2025–26', tone: 'accent' },
                    { display: '3rd Brigade', label: 'Based at Lavarack Barracks, with more personnel planned over the next five years', foot: 'Minister for Defence Personnel' },
                    { value: 14718, prefix: '+', label: 'People Queensland gained from other states, the most of any state', foot: 'Year to March 2026 · ABS' },
                ]}
            />
            <Callout icon={ArrowsRightLeftIcon} tone="neutral" title="Where Queensland's new arrivals come from">
                <p>
                    Most of Queensland&apos;s interstate gain came from New South Wales and Victoria, and most of it settled
                    outside Brisbane. <a href={INSIGHTS.migration.path}>See who&apos;s moving to Queensland</a>.
                </p>
            </Callout>
        </Section>

        <Section
            id="how-the-lease-works"
            number={3}
            title="How the lease works"
            lede={<p>The lease is between you and DHA, not the service member who lives in the home.</p>}
        >
            <FeatureCards
                items={[
                    { icon: CalendarDaysIcon, title: '3, 6, 9 or 12 years', body: 'Lease terms on offer, with options to extend.' },
                    { icon: BanknotesIcon, title: 'Rent paid when empty', body: "DHA pays the rent monthly in advance, even if the home is unoccupied, as long as it's habitable." },
                    { icon: ArrowPathIcon, title: 'Rent reset to market', body: 'An independent licensed valuer reviews the rent, usually every year, based on current market rates. So it moves with the market.' },
                ]}
            />
        </Section>

        <Section
            id="the-fee"
            number={4}
            kicker="Illustrative"
            title="The fee, with a worked example"
            lede={
                <p>
                    DHA charges a service fee out of the rent. It covers vacancy management, most non-structural repairs,
                    rent reviews and inspections. There are no re-letting or advertising fees.
                </p>
            }
        >
            <FeeExample />
        </Section>

        <Section
            id="what-stays-with-you"
            number={5}
            title="What stays with you"
            lede={<p>A government tenant doesn&apos;t take on the costs of owning the property. These are still yours:</p>}
        >
            <Checklist
                items={[
                    { title: 'Council rates' },
                    { title: 'Water rates', body: 'DHA reimburses water usage.' },
                    { title: 'Body corporate or strata levies' },
                    { title: 'Land tax' },
                    { title: 'Insurance' },
                    { title: 'Structural repairs', body: 'And any other repairs the lease says are the owner’s.' },
                ]}
            />
        </Section>

        <Section
            id="selling"
            number={6}
            title="Selling with a lease"
            lede={
                <p>
                    You can sell at any time, but <strong>the lease goes with the property</strong>. The home is sold with
                    the DHA lease and its Property Care Contract in place, so whoever buys it takes on the lease too.
                </p>
            }
        />

        <Section
            id="questions"
            number={7}
            title="Questions to ask before you buy"
            lede={<p>A government tenant removes some risks. Not all of them. Read the lease before the yield.</p>}
        >
            <Checklist
                icon={QuestionMarkCircleIcon}
                items={[
                    { title: 'How long is left on the lease?', body: 'And what are the options to extend it?' },
                    { title: 'When is the next rent review?', body: 'Reviews follow the market, so rent can change at each one.' },
                    { title: 'Which service fee applies?', body: '16.5% for most houses, 13% where a body corporate covers most common areas.' },
                    { title: 'What will the owner’s costs be?', body: 'Rates, insurance, body corporate and land tax, each year.' },
                    { title: 'Which repairs are yours?', body: 'Check the lease and the Property Care Contract, and the building’s condition.' },
                    { title: 'What happens when the lease ends?', body: 'Ask about extensions, and what the home is worth without a lease.' },
                ]}
            />
        </Section>

        <InsightCTA
            title="Thinking about a DHA-leased home? Talk to us before you buy."
            body="We can walk you through the lease, the fee and the owner's costs on a specific property."
            actions={[
                { href: '/#contact', label: 'Talk to our team' },
                { href: '/properties', label: 'Browse properties' },
            ]}
        />

        <RelatedInsights items={[INSIGHTS.migration, INSIGHTS.newVsEstablished]} />

        <FinePrint
            disclaimer={DISCLAIMER}
            details={DETAILS}
            disclosure={DISCLOSURE}
            updated={UPDATED}
            sources={SOURCES}
        />
    </InsightPage>
);

export default DefenceHousingPage;
