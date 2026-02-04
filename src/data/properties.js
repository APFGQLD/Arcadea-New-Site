const brandLogoWhite = 'https://cms.arcadea.com.au/wp-content/uploads/2026/02/brand-logo-white.png';
const brandLogoBlack = 'https://cms.arcadea.com.au/wp-content/uploads/2026/02/brand-logo-black.png';
const islandLogoWhite = 'https://cms.arcadea.com.au/wp-content/uploads/2026/02/island-logo-white.png';
const islandLogoBlack = 'https://cms.arcadea.com.au/wp-content/uploads/2026/02/island-logo-black.png';
const coastalLogoWhite = 'https://cms.arcadea.com.au/wp-content/uploads/2026/02/coastal-logo-white.png';
const coastalLogoBlack = 'https://cms.arcadea.com.au/wp-content/uploads/2026/02/coastal-logo-black.png';

export const brandBranding = {
    name: 'ARCADEA PROPERTY',
    logoLight: brandLogoWhite,
    logoDark: brandLogoBlack
};

export const propertyCollections = {
    island: {
        id: 'island',
        title: 'The Island Collection',
        logoLight: islandLogoWhite,
        logoDark: islandLogoBlack,
        location: 'Bali, Indonesia',
        description: 'Exclusive investment properties and luxury hotels in the heart of paradise.',
        image: 'https://images.unsplash.com/photo-1573790387438-4da905039392?auto=format&fit=crop&q=80&w=1000',
        properties: [
            {
                id: 'bali-villas-1',
                title: 'Uluwatu Cliffside Oasis',
                location: 'Uluwatu',
                price: 'From $1,200,000',
                image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000',
                tag: 'Investment',
                features: ['Guaranteed Returns', 'Ocean View', 'Private Pool']
            },
            {
                id: 'bali-resort-2',
                title: 'Seminyak Boutique Residences',
                location: 'Seminyak',
                price: 'From $850,000',
                image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=1000',
                tag: 'Pre-Launch',
                features: ['Rental Management', 'Walk to Beach', 'Modern Design']
            },
            {
                id: 'bali-villas-3',
                title: 'Canggu Eco-Luxury Estate',
                location: 'Canggu',
                price: 'From $1,500,000',
                image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=1000',
                tag: 'Off-Plan',
                features: ['Sustainable Materials', 'Jungle View', 'High Yield']
            }
        ]
    },
    coastal: {
        id: 'coastal',
        title: 'The Coastal Collection',
        logoLight: coastalLogoWhite,
        logoDark: coastalLogoBlack,
        location: 'Australia',
        description: 'Premium curated residences in Australia\'s most sought-after coastal markets.',
        image: 'https://plus.unsplash.com/premium_photo-1670275658703-33fb95fe50d8?auto=format&fit=crop&q=80&w=1000',
        properties: [
            {
                id: 'aus-sydney-1',
                title: 'Harbour Front Luxury',
                location: 'Sydney, NSW',
                price: 'From $3,500,000',
                image: 'https://images.unsplash.com/photo-1512915922686-57c11f9ad6b3?auto=format&fit=crop&q=80&w=1000',
                tag: 'Exclusive',
                features: ['Sydney Harbour Views', 'Private Lift Access', 'Smart Home']
            },
            {
                id: 'aus-gold-coast-2',
                title: 'Broadbeach Sky Residence',
                location: 'Gold Coast, QLD',
                price: 'From $1,800,000',
                image: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&q=80&w=1000',
                tag: 'Curated',
                features: ['Ocean Front', 'Concierge Service', 'Luxury Finishes']
            },
            {
                id: 'aus-byron-3',
                title: 'Byron Bay Retreat',
                location: 'Byron Bay, NSW',
                price: 'From $4,200,000',
                image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1000',
                tag: 'Limited Offering',
                features: ['Acres of Land', 'Near Tallow Beach', 'Eco-Conscious']
            }
        ]
    }
};
