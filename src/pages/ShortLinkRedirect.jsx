import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { linkService } from '../services/linkService';
import NotFoundPage from './NotFoundPage';

const ShortLinkRedirect = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [found, setFound] = useState(false);
    const [destination, setDestination] = useState('');

    useEffect(() => {
        const fetchLink = async () => {
            const link = await linkService.getBySlug(slug);

            if (link) {
                setFound(true);
                setDestination(link.destination);

                // Increment clicks (fire and forget for better UX speed, or await if critical)
                linkService.incrementClicks(link.id, link.clicks);

                // Small delay to show the redirect screen
                setTimeout(() => {
                    // Check if destination handles http/https, if not add https
                    let url = link.destination;
                    if (!url.startsWith('http://') && !url.startsWith('https://')) {
                        url = 'https://' + url;
                    }
                    window.location.href = url;
                }, 1000);
            } else {
                setLoading(false);
            }
        };

        fetchLink();
    }, [slug]);

    if (!loading && !found) {
        return <NotFoundPage />;
    }

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            textAlign: 'center',
            padding: '20px'
        }}>
            <div style={{
                width: '50px',
                height: '50px',
                border: '3px solid var(--accent-gold)',
                borderTop: '3px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '20px'
            }}></div>
            <h2 style={{ fontFamily: 'var(--font-heading)', margin: '0 0 10px 0' }}>Redirecting...</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
                Taking you to <span style={{ color: 'var(--accent-gold)' }}>{destination}</span>
            </p>
            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default ShortLinkRedirect;
