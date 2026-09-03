import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    CalendarDaysIcon,
    UserIcon,
    ClockIcon,
    ArrowRightIcon
} from '@heroicons/react/24/solid';
import { fetchBlogPosts, fetchCategories } from '../services/sanityService';
import { getReadingTime } from '../utils/readingTime';
import LoadingSpinner from '../components/LoadingSpinner';
import usePageTitle from '../hooks/usePageTitle';
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

    return (
        <div className="blog-page">
            {/* Hero Section */}
            <div className="blog-hero">
                <div className="container">
                    <h1 className="blog-hero-title">INSIGHTS & INSPIRATION</h1>
                    <p className="blog-hero-subtitle">
                        Expert insights on luxury property investment, market trends, and lifestyle destinations
                    </p>
                </div>
            </div>

            {/* Blog Grid */}
            <div className="container">
                {categories.length > 0 && (
                    <div className="blog-categories">
                        <button
                            className={`blog-category-pill ${activeCategory === null ? 'active' : ''}`}
                            onClick={() => handleCategoryClick(null)}
                        >
                            All
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                className={`blog-category-pill ${activeCategory === cat.slug ? 'active' : ''}`}
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
                        {featuredPost && (
                            <article className="blog-featured">
                                {featuredPost.featuredImage && (
                                    <Link to={`/news/${featuredPost.slug}`} className="blog-featured-image">
                                        <img
                                            src={featuredPost.featuredImage}
                                            alt={featuredPost.featuredImageAlt || featuredPost.title}
                                            loading="eager"
                                            decoding="async"
                                            width="1200"
                                            height="800"
                                        />
                                    </Link>
                                )}
                                <div className="blog-featured-content">
                                    <span className="blog-featured-badge">Latest Article</span>
                                    <div className="blog-card-meta">
                                        <span className="blog-card-date">
                                            <CalendarDaysIcon className="hero-icon-sm" style={{ marginRight: '0.5rem' }} />
                                            {formatDate(featuredPost.date)}
                                        </span>
                                        <span className="blog-card-author">
                                            <UserIcon className="hero-icon-sm" style={{ marginRight: '0.5rem' }} />
                                            {featuredPost.author}
                                        </span>
                                        {getReadingTime(featuredPost.content) && (
                                            <span className="blog-card-readtime">
                                                <ClockIcon className="hero-icon-sm" style={{ marginRight: '0.5rem' }} />
                                                {getReadingTime(featuredPost.content)} min read
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="blog-featured-title">
                                        <Link to={`/news/${featuredPost.slug}`}>{featuredPost.title}</Link>
                                    </h2>
                                    <p className="blog-featured-excerpt">
                                        {truncateExcerpt(featuredPost.excerpt, 220)}
                                    </p>
                                    <Link to={`/news/${featuredPost.slug}`} className="blog-card-link">
                                        Read Article <ArrowRightIcon className="hero-icon-sm" style={{ marginLeft: '0.25rem' }} />
                                    </Link>
                                </div>
                            </article>
                        )}

                        {gridPosts.length > 0 && (
                            <div className="blog-grid">
                                {gridPosts.map((post, index) => (
                                    <article key={post.id} className="blog-card" style={{ animationDelay: `${index * 0.1}s` }}>
                                        {post.featuredImageThumb && (
                                            <Link to={`/news/${post.slug}`} className="blog-card-image">
                                                <img
                                                    src={post.featuredImageThumb}
                                                    alt={post.featuredImageAlt || post.title}
                                                    loading="lazy"
                                                    decoding="async"
                                                    width="800"
                                                    height="600"
                                                />
                                                <div className="blog-card-overlay"></div>
                                            </Link>
                                        )}
                                        <div className="blog-card-content">
                                            <div className="blog-card-meta">
                                                <span className="blog-card-date">
                                                    <CalendarDaysIcon className="hero-icon-sm" style={{ marginRight: '0.5rem' }} />
                                                    {formatDate(post.date)}
                                                </span>
                                                <span className="blog-card-author">
                                                    <UserIcon className="hero-icon-sm" style={{ marginRight: '0.5rem' }} />
                                                    {post.author}
                                                </span>
                                                {getReadingTime(post.content) && (
                                                    <span className="blog-card-readtime">
                                                        <ClockIcon className="hero-icon-sm" style={{ marginRight: '0.5rem' }} />
                                                        {getReadingTime(post.content)} min read
                                                    </span>
                                                )}
                                            </div>
                                            <h2 className="blog-card-title">
                                                <Link to={`/news/${post.slug}`}>{post.title}</Link>
                                            </h2>
                                            <p className="blog-card-excerpt">
                                                {truncateExcerpt(post.excerpt)}
                                            </p>
                                            <Link to={`/news/${post.slug}`} className="blog-card-link">
                                                Read More <ArrowRightIcon className="hero-icon-sm" style={{ marginLeft: '0.25rem' }} />
                                            </Link>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="blog-pagination">
                                <button
                                    className="pagination-btn"
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                >
                                    ← Previous
                                </button>
                                <span className="pagination-info">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    className="pagination-btn"
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default BlogPage;
