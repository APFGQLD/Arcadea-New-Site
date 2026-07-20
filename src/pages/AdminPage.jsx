import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { linkService } from '../services/linkService';
import usePageTitle from '../hooks/usePageTitle';
import './AdminPage.css';

const AdminPage = () => {
    usePageTitle('Admin', { noindex: true });
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('links');

    // Custom Link State
    const [customLinks, setCustomLinks] = useState([]);
    const [newLink, setNewLink] = useState({ origin: '', destination: '' });

    const navigate = useNavigate();

    // Load available links on mount
    React.useEffect(() => {
        const checkAuth = localStorage.getItem('admin_auth');
        if (checkAuth === 'true') setIsAuthenticated(true);

        const loadLinks = async () => {
            const links = await linkService.getAll();
            setCustomLinks(links || []);
        };
        loadLinks();
    }, []);

    const handleCreateLink = async (e) => {
        e.preventDefault();
        try {
            if (!newLink.origin || !newLink.destination) return;
            // Supabase handles duplicates via error usually, but we can check casually
            const existing = customLinks.find(l => l.origin.toLowerCase() === newLink.origin.toLowerCase());
            if (existing) {
                alert('Origin already exists locally (refresh to be sure)!');
                return;
            }

            await linkService.add(newLink.origin, newLink.destination);

            const links = await linkService.getAll();
            setCustomLinks(links);
            setNewLink({ origin: '', destination: '' });
        } catch (error) {
            console.error(error);
            alert('Failed to create link: ' + error.message);
        }
    };

    const handleDeleteLink = async (id) => {
        if (window.confirm('Delete this link?')) {
            try {
                await linkService.delete(id);
                const links = await linkService.getAll();
                setCustomLinks(links);
            } catch (error) {
                console.error(error);
                alert('Failed to delete link');
            }
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'APFG2026!@#$') {
            setIsAuthenticated(true);
            localStorage.setItem('admin_auth', 'true');
        } else {
            alert('Invalid Password');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('admin_auth');
    };

    if (!isAuthenticated) {
        return (
            <div className="wp-login-page">
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img src="/arcadea-logo.png" alt="Arcadea" style={{ height: '80px', width: 'auto' }} onError={(e) => e.target.style.display = 'none'} />
                    {/* Fallback text if image missing */}
                    <h1 style={{ color: '#555', fontSize: '24px' }}>Arcadea Admin</h1>
                </div>
                <div className="wp-login-card">
                    <form onSubmit={handleLogin}>
                        <label className="wp-label">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit" className="wp-btn wp-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Log In</button>
                    </form>
                </div>
                <p style={{ marginTop: '20px' }}>
                    <a href="/" style={{ color: '#555', textDecoration: 'none' }}>← Go to Arcadea Site</a>
                </p>
            </div>
        );
    }

    return (
        <div className="wp-admin-wrap">
            {/* Sidebar */}
            <div className="wp-sidebar">
                <div style={{ padding: '0 12px 20px 12px', color: '#fff', fontWeight: 'bold' }}>
                    Arcadea Property
                </div>
                <div
                    className={`wp-menu-item ${activeTab === 'links' ? 'active' : ''}`}
                    onClick={() => setActiveTab('links')}
                >
                    Short Links
                </div>

                <div style={{ marginTop: '40px' }}>
                    <div className="wp-menu-item" onClick={() => navigate('/')}>
                        Visit Site
                    </div>
                    <a
                        href="https://cms.arcadea.com.au/wp-admin"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="wp-menu-item"
                        style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
                    >
                        Visit CMS (WP)
                    </a>
                    <div className="wp-menu-item logout" onClick={handleLogout}>
                        Log Out
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="wp-content">

                {activeTab === 'links' && (
                    <>
                        <div className="wp-header">
                            <h1 className="wp-heading-1">Short Links</h1>
                        </div>

                        <div className="wp-card">
                            <div className="wp-card-header">
                                <h2 className="wp-card-title">Add New Short Link</h2>
                            </div>
                            <div className="wp-card-body">
                                <form onSubmit={handleCreateLink} style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span className="wp-tag">arcadea.com.au/</span>
                                        <input
                                            className="wp-input"
                                            placeholder="slug"
                                            style={{ width: '150px' }}
                                            value={newLink.origin}
                                            onChange={e => setNewLink({ ...newLink, origin: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <span>→</span>
                                    <input
                                        className="wp-input"
                                        placeholder="Destination URL (https://...)"
                                        style={{ flex: 1, minWidth: '300px' }}
                                        value={newLink.destination}
                                        onChange={e => setNewLink({ ...newLink, destination: e.target.value })}
                                        required
                                    />
                                    <button type="submit" className="wp-btn wp-btn-primary">Add Link</button>
                                </form>
                            </div>
                        </div>

                        <div className="wp-card">
                            <table className="wp-list-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '20%' }}>Slug</th>
                                        <th style={{ width: '50%' }}>Destination</th>
                                        <th style={{ width: '10%' }}>Clicks</th>
                                        <th style={{ width: '20%', textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customLinks.length === 0 ? (
                                        <tr><td colSpan="4">No links found.</td></tr>
                                    ) : customLinks.map(link => (
                                        <tr key={link.id}>
                                            <td><strong>{link.origin}</strong></td>
                                            <td>
                                                <a href={link.destination} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#2271b1' }}>
                                                    {link.destination}
                                                </a>
                                            </td>
                                            <td>{link.clicks}</td>
                                            <td style={{ textAlign: 'right' }}>
                                                <button className="wp-btn wp-btn-danger" onClick={() => handleDeleteLink(link.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
};

export default AdminPage;
