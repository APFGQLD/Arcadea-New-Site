import axios from 'axios';

// WordPress API Configuration
const WP_API_URL = import.meta.env.DEV
    ? '/wp-api'
    : (import.meta.env.VITE_WP_API_URL || 'https://cms.arcadea.com.au/wp-json/wp/v2');
const WP_USER = import.meta.env.VITE_WP_USER;
const WP_APP_PASS = import.meta.env.VITE_WP_APP_PASS;

// Helper to get authentication header
const getAuthHeader = () => {
    if (WP_USER && WP_APP_PASS) {
        const token = btoa(`${WP_USER}:${WP_APP_PASS}`);
        return { 'Authorization': `Basic ${token}` };
    }
    return {};
};

// Default image if none is set or API fails
const DEFAULT_FEATURED_IMAGE = 'https://cms.arcadea.com.au/wp-content/uploads/2026/02/V04_FINAL_lowres.jpeg';

/**
 * Fetch all blog posts with pagination
 * @param {number} page - Page number
 * @param {number} perPage - Posts per page
 * @returns {Promise<{posts: Array, totalPages: number, total: number}>}
 */
export const fetchBlogPosts = async (page = 1, perPage = 9) => {
    try {
        const response = await axios.get(`${WP_API_URL}/posts`, {
            params: {
                page,
                per_page: perPage,
                _embed: true, // Include featured images and author
                orderby: 'date',
                order: 'desc'
            },
            headers: getAuthHeader()
        });

        return {
            posts: response.data.map(post => ({
                id: post.id,
                slug: post.slug,
                title: post.title.rendered,
                excerpt: post.excerpt.rendered,
                content: post.content.rendered,
                date: post.date,
                author: post._embedded?.author?.[0]?.name || 'Arcadea',
                featuredImage: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || DEFAULT_FEATURED_IMAGE,
                categories: post._embedded?.['wp:term']?.[0] || []
            })),
            totalPages: parseInt(response.headers['x-wp-totalpages']) || 1,
            total: parseInt(response.headers['x-wp-total']) || 0
        };
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        throw error; // Rethrow to show error in UI instead of mock data
    }
};

/**
 * Fetch single blog post by slug
 * @param {string} slug - Post slug
 * @returns {Promise<Object>}
 */
export const fetchBlogPost = async (slug) => {
    try {
        const response = await axios.get(`${WP_API_URL}/posts`, {
            params: {
                slug,
                _embed: true
            },
            headers: getAuthHeader()
        });

        const post = response.data[0];
        if (!post) throw new Error('Post not found');

        return {
            id: post.id,
            slug: post.slug,
            title: post.title.rendered,
            content: post.content.rendered,
            date: post.date,
            author: post._embedded?.author?.[0]?.name || 'Arcadea',
            authorAvatar: post._embedded?.author?.[0]?.avatar_urls?.['96'] || null,
            featuredImage: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || DEFAULT_FEATURED_IMAGE,
            categories: post._embedded?.['wp:term']?.[0] || []
        };
    } catch (error) {
        console.error('Error fetching blog post:', error);
        throw error;
    }
};

/**
 * Fetch blog categories
 * @returns {Promise<Array>}
 */
export const fetchCategories = async () => {
    try {
        const response = await axios.get(`${WP_API_URL}/categories`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
};

// Mock data for development (before WordPress is set up)
const getMockBlogPosts = (page, perPage) => {
    const mockPosts = [
        {
            id: 1,
            slug: 'investing-in-bali-property-2024',
            title: 'The Ultimate Guide to Investing in Bali Property in 2024',
            excerpt: '<p>Discover why Bali continues to be one of the most attractive markets for property investment in Southeast Asia...</p>',
            content: '<p>Full content here...</p>',
            date: '2024-01-15T10:00:00',
            author: 'Arcadea Team',
            featuredImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&auto=format&fit=crop&q=80',
            categories: [{ name: 'Investment Tips' }]
        },
        {
            id: 2,
            slug: 'coastal-living-australia',
            title: 'Coastal Living: The Rise of Premium Beachfront Properties in Australia',
            excerpt: '<p>Explore the growing demand for luxury coastal properties along Australia\'s stunning coastline...</p>',
            content: '<p>Full content here...</p>',
            date: '2024-01-10T14:30:00',
            author: 'Arcadea Team',
            featuredImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&auto=format&fit=crop&q=80',
            categories: [{ name: 'Market Insights' }]
        },
        {
            id: 3,
            slug: 'property-management-tips',
            title: '10 Essential Property Management Tips for International Investors',
            excerpt: '<p>Managing property from abroad? Here are the key strategies to ensure your investment thrives...</p>',
            content: '<p>Full content here...</p>',
            date: '2024-01-05T09:15:00',
            author: 'Arcadea Team',
            featuredImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&auto=format&fit=crop&q=80',
            categories: [{ name: 'Property Management' }]
        }
    ];

    const start = (page - 1) * perPage;
    const end = start + perPage;

    return {
        posts: mockPosts.slice(start, end),
        totalPages: Math.ceil(mockPosts.length / perPage),
        total: mockPosts.length
    };
};

const getMockBlogPost = (slug) => {
    const mockPost = {
        id: 1,
        slug,
        title: 'The Ultimate Guide to Investing in Bali Property in 2024',
        content: `
            <p>Bali has long been a paradise for travelers, but in recent years, it has also become one of the most sought-after destinations for property investors. With its stunning landscapes, rich culture, and growing tourism industry, Bali offers unique opportunities for those looking to invest in real estate.</p>
            
            <h2>Why Invest in Bali?</h2>
            <p>The Indonesian government has made significant strides in making property investment more accessible to foreigners. Combined with Bali's year-round appeal and strong rental yields, it's no wonder investors are flocking to the island.</p>
            
            <h2>Key Considerations</h2>
            <ul>
                <li>Understanding leasehold vs. freehold properties</li>
                <li>Working with reputable developers</li>
                <li>Property management solutions</li>
                <li>ROI expectations and market trends</li>
            </ul>
            
            <p>At Arcadea, we specialize in connecting investors with premium properties that offer both lifestyle and financial returns. Our Island Collection features carefully curated properties in Bali and beyond.</p>
        `,
        date: '2024-01-15T10:00:00',
        author: 'Arcadea Team',
        authorAvatar: null,
        featuredImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&h=800&auto=format&fit=crop&q=80',
        categories: [{ name: 'Investment Tips' }, { name: 'Bali' }]
    };

    return mockPost;
};
