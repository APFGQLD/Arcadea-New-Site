import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    CalendarDaysIcon,
    UserIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/solid';
import { fetchBlogPost } from '../services/wordpressService';
import LoadingSpinner from '../components/LoadingSpinner';
import './BlogPostPage.css';

const BlogPostPage = () => {
    const { slug } = useParams();
    const { t } = useTranslation();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPost();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [slug]);

    const loadPost = async () => {
        setLoading(true);
        try {
            const data = await fetchBlogPost(slug);
            setPost(data);
        } catch (error) {
            console.error('Failed to load blog post:', error);
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

    if (loading) {
        return (
            <div className="blog-post-page">
                <div className="container">
                    <LoadingSpinner message="Loading article..." />
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="blog-post-page">
                <div className="container">
                    <div className="blog-error">
                        <h2>Article Not Found</h2>
                        <p>The article you're looking for doesn't exist.</p>
                        <Link to="/news" className="btn btn-primary">
                            ← Back to News
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="blog-post-page">
            {/* Featured Image Header */}
            {post.featuredImage && (
                <div className="blog-post-hero" style={{ backgroundImage: `url(${post.featuredImage})` }}>
                    <div className="blog-post-hero-overlay"></div>
                </div>
            )}

            {/* Content */}
            <div className="container">
                <Link to="/news" className="blog-back-link">
                    <ArrowLeftIcon className="hero-icon-sm" style={{ marginRight: '0.5rem' }} /> Back to News
                </Link>

                <article className="blog-post-content">
                    <header className="blog-post-header">
                        <h1 className="blog-post-title">{post.title}</h1>
                        <div className="blog-post-meta">
                            <span className="blog-post-date">
                                <CalendarDaysIcon className="hero-icon-sm" style={{ marginRight: '0.5rem' }} />
                                {formatDate(post.date)}
                            </span>
                            <span className="blog-post-author">
                                <UserIcon className="hero-icon-sm" style={{ marginRight: '0.5rem' }} />
                                {post.author}
                            </span>
                        </div>
                        {post.categories && post.categories.length > 0 && (
                            <div className="blog-post-categories">
                                {post.categories.map((cat, idx) => (
                                    <span key={idx} className="blog-category-tag">
                                        {cat.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </header>

                    <div
                        className="blog-post-body"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Call to Action */}
                    <div className="blog-post-cta">
                        <h3>Ready to Explore Premium Properties?</h3>
                        <p>Discover our exclusive collection of investment properties across the globe.</p>
                        <Link to="/properties" className="btn btn-primary">
                            View Properties
                        </Link>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default BlogPostPage;
