import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    CalendarDaysIcon,
    UserIcon,
    ArrowRightIcon
} from '@heroicons/react/24/solid';
import { fetchBlogPosts } from '../services/wordpressService';
import LoadingSpinner from '../components/LoadingSpinner';
import './BlogPage.css';

const BlogPage = () => {
    const { t } = useTranslation();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        loadPosts(currentPage);
    }, [currentPage]);

    const loadPosts = async (page) => {
        setLoading(true);
        try {
            const data = await fetchBlogPosts(page, 9);
            setPosts(data.posts);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Failed to load blog posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
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
                {loading ? (
                    <LoadingSpinner message="Loading articles..." />
                ) : (
                    <>
                        <div className="blog-grid">
                            {posts.map((post, index) => (
                                <article key={post.id} className="blog-card" style={{ animationDelay: `${index * 0.1}s` }}>
                                    {post.featuredImage && (
                                        <Link to={`/news/${post.slug}`} className="blog-card-image">
                                            <img
                                                src={post.featuredImage}
                                                alt={post.title}
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
                                        </div>
                                        <h2 className="blog-card-title">
                                            <Link to={`/news/${post.slug}`}>{post.title}</Link>
                                        </h2>
                                        <p className="blog-card-excerpt">
                                            {stripHtml(post.excerpt).substring(0, 150)}...
                                        </p>
                                        <Link to={`/news/${post.slug}`} className="blog-card-link">
                                            Read More <ArrowRightIcon className="hero-icon-sm" style={{ marginLeft: '0.25rem' }} />
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>

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
