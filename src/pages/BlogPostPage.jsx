import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    CalendarDaysIcon,
    UserIcon,
    ClockIcon,
    ArrowLeftIcon,
    LinkIcon,
    CheckIcon
} from '@heroicons/react/24/solid';
import { FaXTwitter, FaFacebookF, FaLinkedinIn } from 'react-icons/fa6';
import { fetchBlogPost, fetchRelatedPosts } from '../services/sanityService';
import { getReadingTime } from '../utils/readingTime';
import { PortableText } from '@portabletext/react';
import LoadingSpinner from '../components/LoadingSpinner';
import usePageTitle from '../hooks/usePageTitle';
import './BlogPostPage.css';

const BlogPostPage = () => {
    const { slug } = useParams();
    const { t } = useTranslation();
    const [post, setPost] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    usePageTitle(post?.title, { description: post?.excerpt });

    useEffect(() => {
        loadPost();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [slug]);

    const loadPost = async () => {
        setLoading(true);
        setRelatedPosts([]);
        try {
            const data = await fetchBlogPost(slug);
            setPost(data);

            const categorySlugs = (data.categories || []).map((cat) => cat.slug);
            fetchRelatedPosts(data.slug, categorySlugs, 3).then(setRelatedPosts);
        } catch (error) {
            console.error('Failed to load blog post:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-AU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleCopyLink = async () => {
        const url = window.location.href;
        let success = false;

        try {
            await navigator.clipboard.writeText(url);
            success = true;
        } catch {
            // Clipboard API can be unavailable or permission-denied (older
            // browsers, non-secure contexts, restrictive permission policies).
            // Fall back to the legacy selection-based copy command.
            const textarea = document.createElement('textarea');
            textarea.value = url;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                success = document.execCommand('copy');
            } catch (fallbackError) {
                console.error('Failed to copy link:', fallbackError);
            }
            document.body.removeChild(textarea);
        }

        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
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

    const shareUrl = window.location.href;

    return (
        <div className="blog-post-page">
            {/* Featured Image Header */}
            {post.featuredImage && (
                <div
                    className="blog-post-hero"
                    style={{ backgroundImage: `url(${post.featuredImage})` }}
                    role="img"
                    aria-label={post.featuredImageAlt || post.title}
                >
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
                            {getReadingTime(post.content) && (
                                <span className="blog-post-readtime">
                                    <ClockIcon className="hero-icon-sm" style={{ marginRight: '0.5rem' }} />
                                    {getReadingTime(post.content)} min read
                                </span>
                            )}
                        </div>
                        {post.categories && post.categories.length > 0 && (
                            <div className="blog-post-categories">
                                {post.categories.map((cat, idx) => (
                                    <Link key={idx} to={`/news?category=${cat.slug}`} className="blog-category-tag">
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </header>

                    <div className="blog-post-body">
                        {Array.isArray(post.content) ? (
                            <PortableText value={post.content} />
                        ) : (
                            <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        )}
                    </div>

                    <div className="blog-post-share">
                        <span className="blog-post-share-label">Share this article</span>
                        <div className="blog-post-share-buttons">
                            <a
                                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="blog-share-btn"
                                aria-label="Share on X"
                            >
                                <FaXTwitter />
                            </a>
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="blog-share-btn"
                                aria-label="Share on Facebook"
                            >
                                <FaFacebookF />
                            </a>
                            <a
                                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="blog-share-btn"
                                aria-label="Share on LinkedIn"
                            >
                                <FaLinkedinIn />
                            </a>
                            <button
                                type="button"
                                onClick={handleCopyLink}
                                className="blog-share-btn"
                                aria-label="Copy article link"
                            >
                                {copied ? <CheckIcon /> : <LinkIcon />}
                            </button>
                        </div>
                        {copied && <span className="blog-post-share-copied">Link copied!</span>}
                    </div>

                    {/* Call to Action */}
                    <div className="blog-post-cta">
                        <h3>Ready to Explore Premium Properties?</h3>
                        <p>Discover our exclusive collection of investment properties across the globe.</p>
                        <Link to="/properties" className="btn btn-primary">
                            View Properties
                        </Link>
                    </div>
                </article>

                {relatedPosts.length > 0 && (
                    <section className="blog-related">
                        <h2 className="blog-related-heading">You Might Also Like</h2>
                        <div className="blog-related-grid">
                            {relatedPosts.map((related) => (
                                <Link key={related.id} to={`/news/${related.slug}`} className="blog-related-card">
                                    {related.featuredImage && (
                                        <div className="blog-related-card-image">
                                            <img
                                                src={related.featuredImage}
                                                alt={related.featuredImageAlt || related.title}
                                                loading="lazy"
                                                decoding="async"
                                                width="400"
                                                height="280"
                                            />
                                        </div>
                                    )}
                                    <div className="blog-related-card-content">
                                        <span className="blog-related-card-date">{formatDate(related.date)}</span>
                                        <h3 className="blog-related-card-title">{related.title}</h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default BlogPostPage;
