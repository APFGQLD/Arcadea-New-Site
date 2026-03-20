
export const oneParkLaneProject = {
    id: 'one-park-lane',
    slug: 'one-park-lane',
    collection: 'Coastal', // Matches the filter in airtableService
    name: 'One Park Lane',
    location: 'Southport, Gold Coast, QLD',
    price: 'POA',
    tag: 'Iconic', // Status tag
    statusTag: 'Pre-Launch',
    heroImage: 'https://cms.arcadea.com.au/wp-content/uploads/2026/02/V03_FINAL_lowres.jpeg',
    description: "**Australia's Newest Icon Rises.**\n\nOne Park Lane represents the pinnacle of luxury living on the Gold Coast, featuring world-class design and premium finishes throughout.\n\n**Architectural Excellence**\n101 storey residential tower with 60 storey commercial tower connected by a stunning skybridge at level 22.\n\n**Premium Location**\nLocated at 1 Park Lane, Southport – the heart of Gold Coast’s premier business and lifestyle precinct.\n\n**Luxury Finishes**\nEvery apartment features premium finishes, floor to ceiling windows, and spectacular views.\n\n**World Class Amenities**\nIndulge in resort-style living with our comprehensive range of luxury amenities designed for the discerning resident.",
    quickFacts: [
        { id: 'beds', icon: 'MoonIcon', label: 'Bedrooms', value: '2 - 4+' },
        { id: 'baths', icon: 'SparklesIcon', label: 'Bathrooms', value: '2 - 4.5' },
        { id: 'size', icon: 'ArrowsPointingOutIcon', label: 'Unit Sizes', value: '90m2 - 326m2+' }
    ],
    stats: {
        beds: '2 - 4+',
        baths: '2 - 4.5',
        size: '90m2 - 326m2+',
        ipdc: null
    },
    features: [
        '101 Storey Tower',
        'Skybridge Level 22',
        'Floor to Ceiling Windows',
        'Resort Amenities'
    ],
    developer: {
        name: 'APFG',
        description: 'APFG QLD PTY LTD. Developing Australia’s tallest residential tower, setting new standards for luxury living on the Gold Coast.',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800' // Placeholder
    },
    map: {
        lat: -27.9715,
        lng: 153.4180
    },
    units: [
        {
            id: 'u1',
            config: '2 Bedroom Luxury',
            price: 'POA',
            minPrice: null,
            area: '90m2',
            status: 'Available',
            totalUnits: 50,
            soldUnits: 12,
            floorPlan: 'https://1parklane.au/wp-content/uploads/2025/11/Floorplans-Indicative-Q1.2.pdf',
            description: 'Perfectly designed for couples or small families, featuring open-plan living and premium finishes.',
            image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800', // Interior placeholder
            percentage: 1.0
        },
        {
            id: 'u2',
            config: '3 Bedroom Residence',
            price: 'POA',
            minPrice: null,
            area: '166m2',
            status: 'Available',
            totalUnits: 40,
            soldUnits: 8,
            floorPlan: 'https://1parklane.au/wp-content/uploads/2025/10/Floorplans-Indicative-Q3.pdf',
            description: 'Spacious family living with separate dining areas and expansive balconies overlooking the coastline.',
            image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
            percentage: 1.0
        },
        {
            id: 'u3',
            config: 'Sky Home (4 Bed)',
            price: 'POA',
            minPrice: null,
            area: '326m2',
            status: 'Limited',
            totalUnits: 10,
            soldUnits: 2,
            floorPlan: 'https://1parklane.au/wp-content/uploads/2025/10/Floorplans-Indicative-Q4.pdf',
            description: 'The ultimate in luxury living with panoramic views, premium appliances and private terraces.',
            image: 'https://images.unsplash.com/photo-1512915922686-57c11f9ad6b3?auto=format&fit=crop&q=80&w=800',
            percentage: 1.0
        }
    ],
    hotspots: [
        { id: 'h1', name: 'Broadwater Parklands', category: 'Leisure', distance: '200', time: '2' },
        { id: 'h2', name: 'Australia Fair Shopping', category: 'Shopping', distance: '400', time: '5' },
        { id: 'h3', name: 'Southport Yacht Club', category: 'Lifestyle', distance: '1200', time: '15' },
        { id: 'h4', name: 'Main Beach', category: 'Nature', distance: '1500', time: '18' }
    ],
    gallery: [
        {
            id: 'g1',
            url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1600',
            thumbSmall: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=200',
            thumbMedium: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800',
            caption: 'Iconic Facade'
        },
        {
            id: 'g2',
            url: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80&w=1600',
            thumbSmall: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80&w=200',
            thumbMedium: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80&w=800',
            caption: 'Panoramic Views'
        },
        {
            id: 'g3',
            url: 'https://images.unsplash.com/photo-1560185127-6a6a6d96a79e?auto=format&fit=crop&q=80&w=1600',
            thumbSmall: 'https://images.unsplash.com/photo-1560185127-6a6a6d96a79e?auto=format&fit=crop&q=80&w=200',
            thumbMedium: 'https://images.unsplash.com/photo-1560185127-6a6a6d96a79e?auto=format&fit=crop&q=80&w=800',
            caption: 'Luxury Interiors'
        },
        {
            id: 'g4',
            url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1600',
            thumbSmall: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=200',
            thumbMedium: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
            caption: 'Resort Amenities'
        }
    ],
    resources: [
        {
            id: 'r1',
            label: 'Request Brochure',
            type: 'Brochure (PDF)',
            link: 'https://1parklane.au/invitation/#contact',
            image: null
        },
        {
            id: 'r2',
            label: 'Floor Plans (90m2)',
            type: 'Brochure (PDF)',
            link: 'https://1parklane.au/wp-content/uploads/2025/11/Floorplans-Indicative-Q1.2.pdf',
            image: null
        },
        {
            id: 'r3',
            label: 'Floor Plans (166m2)',
            type: 'Brochure (PDF)',
            link: 'https://1parklane.au/wp-content/uploads/2025/10/Floorplans-Indicative-Q3.pdf',
            image: null
        },
        {
            id: 'r4',
            label: 'Floor Plans (326m2)',
            type: 'Brochure (PDF)',
            link: 'https://1parklane.au/wp-content/uploads/2025/10/Floorplans-Indicative-Q4.pdf',
            image: null
        }
    ]
};
