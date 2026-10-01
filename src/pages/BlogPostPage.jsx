import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LinkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { FaXTwitter, FaFacebookF, FaLinkedinIn } from 'react-icons/fa6';
import { fetchBlogPost, fetchRelatedPosts, urlFor } from '../services/sanityService';
import { getReadingTime } from '../utils/readingTime';
import { PortableText } from '@portabletext/react';
import LoadingSpinner from '../components/LoadingSpinner';
import usePageTitle from '../hooks/usePageTitle';
import './EditorialPage.css';
import './BlogPage.css';
import './BlogPostPage.css';

// Internal links (relative, or pointing back at this domain) use React
// Router's Link for client-side navigation; everything else opens in a new
// tab, since it's leaving the site.
const portableTextComponents = {
    types: {
        image: ({ value }) => {
            if (!value?.asset) return null;
            return (
                <img
                    className="blog-post-body-image"
                    src={urlFor(value).width(1200).fit('max').auto('format').url()}
                    alt={value.alt || ''}
                    loading="lazy"
                />
            );
        },
        htmlEmbed: ({ value }) => {
            if (!value?.code) return null;
            return <div className="blog-post-body-embed" dangerouslySetInnerHTML={{ __html: value.code }} />;
        },
    },
    marks: {
        link: ({ value, children }) => {
            const href = value?.href || '';
            const isInternal = href.startsWith('/') || href.includes('arcadea.com.au');
            if (isInternal) {
                const path = href.startsWith('http') ? href.replace(/^https?:\/\/[^/]+/, '') : href;
                return <Link to={path || '/'}>{children}</Link>;
            }
            return (
                <a href={href} target="_blank" rel="noopener noreferrer">
                    {children}
                </a>
            );
        },
    },
};

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
                <div className="blog-post-loading">
                    <LoadingSpinner message="Loading article..." />
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="blog-post-page">
                <div className="ed-wide blog-error">
                    <h2>Article Not Found</h2>
                    <p>The article you're looking for doesn't exist.</p>
                    <Link to="/news" className="ed-text-link">&larr; Back to News</Link>
                </div>
            </div>
        );
    }

    const shareUrl = window.location.href;
    const readingTime = getReadingTime(post.content);
    const metaParts = [formatDate(post.date), post.author, readingTime ? `${readingTime} min read` : null].filter(Boolean);

    return (
        <div className="editorial-page blog-post-page">
            {/* Heading: always shown, whether or not the article has a photo */}
            <header className="ed-wide blog-post-header">
                <Link to="/news" className="ed-text-link blog-back-link">&larr; Back to News</Link>
                {post.categories && post.categories.length > 0 && (
                    <div className="blog-post-categories">
                        {post.categories.map((cat, idx) => (
                            <Link key={idx} to={`/news?category=${cat.slug}`} className="blog-category-tag">
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                )}
                <h1 className="blog-post-title">{post.title}</h1>
                <p className="blog-post-meta">{metaParts.join(' · ')}</p>
            </header>

            {post.featuredImage && (
                <div className="ed-wide blog-post-hero">
                    <img
                        src={post.featuredImage}
                        alt={post.featuredImageAlt || post.title}
                        loading="eager"
                        decoding="async"
                    />
                </div>
            )}

            {/* Article */}
            <article className="blog-post-content">
                <div className="blog-post-body">
                    {Array.isArray(post.content) ? (
                        <PortableText value={post.content} components={portableTextComponents} />
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
                    {copied && <span className="blog-post-share-copied">Link copied</span>}
                </div>
            </article>

            {/* Call to action */}
            <section className="ed-wide ed-panel blog-post-cta">
                <span className="ed-eyebrow">The Collections</span>
                <h2 className="blog-post-cta-title">Ready to explore premium properties?</h2>
                <p>Discover our exclusive collection of investment properties across Australia and Bali.</p>
                <Link to="/properties/" className="ed-text-link">View Properties &rarr;</Link>
            </section>

            {/* Related articles, as the same cards as the News page */}
            {relatedPosts.length > 0 && (
                <section className="ed-wide blog-related">
                    <div className="blog-related-header">
                        <h2 className="blog-related-heading">You Might Also Like</h2>
                        <Link to="/news" className="ed-text-link">All Articles &rarr;</Link>
                    </div>
                    <div className="blog-grid">
                        {relatedPosts.map((related) => (
                            <Link key={related.id} to={`/news/${related.slug}`} className="blog-card">
                                <div className="blog-card-image">
                                    {related.featuredImage && (
                                        <img
                                            src={related.featuredImage}
                                            alt={related.featuredImageAlt || related.title}
                                            loading="lazy"
                                            decoding="async"
                                            width="800"
                                            height="600"
                                        />
                                    )}
                                </div>
                                <span className="blog-card-meta">{formatDate(related.date)}</span>
                                <h3 className="blog-card-title">{related.title}</h3>
                                <span className="ed-text-link blog-card-link">Read Article &rarr;</span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default BlogPostPage;
