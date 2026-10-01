import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchBlogPosts, fetchCategories } from '../services/sanityService';
import { getReadingTime } from '../utils/readingTime';
import LoadingSpinner from '../components/LoadingSpinner';
import usePageTitle from '../hooks/usePageTitle';
import './EditorialPage.css';
import './BlogPage.css';

const BlogPage = () => {
    usePageTitle('News & Insights', {
        description: 'Expert insights on luxury property investment, market trends, and lifestyle destinations across Australia and Bali from the Arcadea Property team.'
    });
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const activeCategory = searchParams.get('category');
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchCategories().then(setCategories).catch(() => setCategories([]));
    }, []);

    useEffect(() => {
        loadPosts(currentPage, activeCategory);
    }, [currentPage, activeCategory]);

    const loadPosts = async (page, categorySlug) => {
        setLoading(true);
        setLoadError(false);
        try {
            const data = await fetchBlogPosts(page, 9, categorySlug);
            setPosts(data.posts);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Failed to load blog posts:', error);
            setLoadError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = (slug) => {
        if (slug === activeCategory) return;
        setCurrentPage(1);
        setSearchParams(slug ? { category: slug } : {});
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-AU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const stripHtml = (html) => {
        const tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    const truncateExcerpt = (text, limit = 150) => {
        const clean = stripHtml(text || '');
        return clean.length > limit
            ? `${clean.substring(0, limit).trimEnd()}…`
            : clean;
    };

    // The newest post is pulled out into a large featured banner, but only on
    // the first page — later pages and category filters just show the grid.
    const featuredPost = currentPage === 1 ? posts[0] : null;
    const gridPosts = featuredPost ? posts.slice(1) : posts;

    // "12 September 2026 · 4 min read"
    const metaLine = (post) => {
        const minutes = getReadingTime(post.content);
        return [formatDate(post.date), minutes ? `${minutes} min read` : null].filter(Boolean).join(' · ');
    };

    return (
        <div className="editorial-page blog-page">
            {/* Page heading */}
            <header className="ed-wide blog-header">
                <span className="ed-eyebrow">News &amp; Insights</span>
                <h1 className="blog-header-title">Insights &amp; Inspiration</h1>
                <p className="blog-header-subtitle">
                    Expert insights on luxury property investment, market trends, and lifestyle destinations.
                </p>
            </header>

            <div className="ed-wide">
                {categories.length > 0 && (
                    <div className="blog-categories" role="group" aria-label="Filter by category">
                        <button
                            className={`blog-category-pill ${activeCategory === null ? 'active' : ''}`}
                            aria-pressed={activeCategory === null}
                            onClick={() => handleCategoryClick(null)}
                        >
                            All
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                className={`blog-category-pill ${activeCategory === cat.slug ? 'active' : ''}`}
                                aria-pressed={activeCategory === cat.slug}
                                onClick={() => handleCategoryClick(cat.slug)}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                )}

                {loading ? (
                    <LoadingSpinner message="Loading articles..." />
                ) : loadError ? (
                    <div className="blog-status">
                        <h2 className="blog-status-title">We couldn't load our articles</h2>
                        <p className="blog-status-message">
                            Something went wrong on our end. Please try again in a moment.
                        </p>
                        <button className="blog-status-btn" onClick={() => loadPosts(currentPage, activeCategory)}>
                            Try Again
                        </button>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="blog-status">
                        <h2 className="blog-status-title">Articles coming soon</h2>
                        <p className="blog-status-message">
                            We're preparing expert insights on luxury property investment and market trends. Check back soon.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Latest article: a large photo card, like the collection banners */}
                        {featuredPost && (
                            <Link to={`/news/${featuredPost.slug}`} className="ed-card blog-featured">
                                {featuredPost.featuredImage && (
                                    <img
                                        src={featuredPost.featuredImage}
                                        alt={featuredPost.featuredImageAlt || featuredPost.title}
                                        className="ed-card-bg"
                                        loading="eager"
                                        decoding="async"
                                    />
                                )}
                                <div className="ed-card-overlay blog-featured-overlay"></div>
                                <div className="ed-card-content blog-featured-content">
                                    <span className="blog-featured-badge">Latest Article</span>
                                    <span className="blog-featured-meta ed-on-photo-gold">
                                        {metaLine(featuredPost)}{featuredPost.author ? ` · ${featuredPost.author}` : ''}
                                    </span>
                                    <h2 className="blog-featured-title">{featuredPost.title}</h2>
                                    <p className="blog-featured-excerpt">
                                        {truncateExcerpt(featuredPost.excerpt, 220)}
                                    </p>
                                    <span className="ed-text-link">Read Article &rarr;</span>
                                </div>
                            </Link>
                        )}

                        {gridPosts.length > 0 && (
                            <div className="blog-grid">
                                {gridPosts.map((post) => (
                                    <Link key={post.id} to={`/news/${post.slug}`} className="blog-card">
                                        <div className="blog-card-image">
                                            {post.featuredImageThumb && (
                                                <img
                                                    src={post.featuredImageThumb}
                                                    alt={post.featuredImageAlt || post.title}
                                                    loading="lazy"
                                                    decoding="async"
                                                    width="800"
                                                    height="600"
                                                />
                                            )}
                                        </div>
                                        <span className="blog-card-meta">{metaLine(post)}</span>
                                        <h2 className="blog-card-title">{post.title}</h2>
                                        <p className="blog-card-excerpt">{truncateExcerpt(post.excerpt)}</p>
                                        <span className="ed-text-link blog-card-link">Read Article &rarr;</span>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {totalPages > 1 && (
                            <nav className="blog-pagination" aria-label="Pagination">
                                <button
                                    className="pagination-btn"
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                >
                                    &larr; Previous
                                </button>
                                <span className="pagination-info">
                                    {String(currentPage).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
                                </span>
                                <button
                                    className="pagination-btn"
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    Next &rarr;
                                </button>
                            </nav>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default BlogPage;
