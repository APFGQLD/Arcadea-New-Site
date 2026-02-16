import React, { useState } from 'react';
import { syncProperties } from '../services/airtableService';
import { useNavigate } from 'react-router-dom';
import { linkService } from '../services/linkService';
import './AdminPage.css';

const AdminPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('links'); // 'links', 'properties', 'settings'
    const [syncing, setSyncing] = useState(false);
    const [propertyTab, setPropertyTab] = useState('overview'); // Sub-tab for valid properties

    // Property Form State - Initial State matching Airtable Schema
    const initialFormState = {
        title: '',
        slug: '',
        collection: 'Coastal',
        location: '',
        price: '',
        statusTag: '',
        description: '',
        stats: { beds: '', baths: '', size: '', ipdc: '' },
        features: [''], // Array of strings
        heroImage: '',
        map: { lat: -27.9715, lng: 153.4180 },
        developer: { name: '', description: '', image: '' },
        units: [], // Array of unit objects
        gallery: [], // Array of {url, caption}
        hotspots: [], // Array of {name, category, distance, time}
        resources: [] // Array of {label, type, link}
    };

    const [formData, setFormData] = useState(initialFormState);

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
            const existing = customLinks.find(l => l.origin.toLowerCase() === newLink.origin.toLowerCase());
            if (existing) {
                alert('Origin already exists!');
                return;
            }
            const { error } = await linkService.add(newLink.origin, newLink.destination);
            if (error) throw error;
            const links = await linkService.getAll();
            setCustomLinks(links);
            setNewLink({ origin: '', destination: '' });
        } catch (error) {
            console.error(error);
            alert('Failed to create link.');
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

    const handleSync = async () => {
        if (!window.confirm('Start Airtable sync?')) return;
        setSyncing(true);
        try {
            await syncProperties();
            alert('Sync Complete!');
        } catch (error) {
            alert('Sync Failed: ' + error.message);
        } finally {
            setSyncing(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        console.log('Creating Property:', formData);
        alert('Property created locally (Mock). Check console for object.');
        // Reset form or redirect
    };

    // Helper to update nested state
    const updateStats = (field, value) => {
        setFormData(prev => ({ ...prev, stats: { ...prev.stats, [field]: value } }));
    };

    // Helper for arrays
    const addArrayItem = (field, emptyItem) => {
        setFormData(prev => ({ ...prev, [field]: [...prev[field], emptyItem] }));
    };

    const removeArrayItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const updateArrayItem = (field, index, subField, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => {
                if (i === index) {
                    if (typeof item === 'string') return value; // Handle simple string arrays like features
                    return { ...item, [subField]: value };
                }
                return item;
            })
        }));
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
                <div
                    className={`wp-menu-item ${activeTab === 'properties' ? 'active' : ''}`}
                    onClick={() => setActiveTab('properties')}
                >
                    Properties
                </div>
                <div
                    className={`wp-menu-item ${activeTab === 'settings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('settings')}
                >
                    Settings (Sync)
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
                            {/* <button className="wp-btn wp-btn-primary">Add New</button> */}
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
                                                <button className="wp-btn wp-btn-danger" onClick={() => handleDeleteLink(link.id)}>Delete Logic</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {activeTab === 'properties' && (
                    <>
                        <div className="wp-header">
                            <h1 className="wp-heading-1">Add New Property</h1>
                        </div>

                        <div className="wp-card">
                            <div className="wp-card-header" style={{ gap: '20px', justifyContent: 'flex-start' }}>
                                {['overview', 'details', 'media', 'location', 'units', 'developer'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setPropertyTab(tab)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            borderBottom: propertyTab === tab ? '2px solid var(--wp-admin-theme-color)' : '2px solid transparent',
                                            padding: '10px 5px',
                                            cursor: 'pointer',
                                            fontWeight: propertyTab === tab ? 'bold' : 'normal',
                                            color: propertyTab === tab ? 'var(--wp-admin-theme-color)' : 'inherit'
                                        }}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>

                            <div className="wp-card-body">
                                <form onSubmit={handleCreate}>

                                    {/* OVERVIEW TAB */}
                                    {propertyTab === 'overview' && (
                                        <div style={{ display: 'grid', gap: '15px' }}>
                                            <div className="wp-form-row">
                                                <label className="wp-label">Title</label>
                                                <input className="wp-input" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. One Park Lane" />
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                                <div className="wp-form-row">
                                                    <label className="wp-label">Slug</label>
                                                    <input className="wp-input" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} placeholder="e.g. one-park-lane" />
                                                </div>
                                                <div className="wp-form-row">
                                                    <label className="wp-label">Collection</label>
                                                    <select className="wp-input" value={formData.collection} onChange={e => setFormData({ ...formData, collection: e.target.value })}>
                                                        <option value="Coastal">Coastal</option>
                                                        <option value="Island">Island</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="wp-form-row">
                                                <label className="wp-label">Price Display</label>
                                                <input className="wp-input" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="e.g. POA or From $1.2M" />
                                            </div>
                                            <div className="wp-form-row">
                                                <label className="wp-label">Status Tag</label>
                                                <input className="wp-input" value={formData.statusTag} onChange={e => setFormData({ ...formData, statusTag: e.target.value })} placeholder="e.g. Pre-Launch" />
                                            </div>
                                        </div>
                                    )}

                                    {/* DETAILS TAB */}
                                    {propertyTab === 'details' && (
                                        <div style={{ display: 'grid', gap: '15px' }}>
                                            <div className="wp-form-row">
                                                <label className="wp-label">Description (Markdown Supported)</label>
                                                <textarea className="wp-input" rows="8" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                                                <div className="wp-form-row">
                                                    <label className="wp-label">Beds</label>
                                                    <input className="wp-input" value={formData.stats.beds} onChange={e => updateStats('beds', e.target.value)} />
                                                </div>
                                                <div className="wp-form-row">
                                                    <label className="wp-label">Baths</label>
                                                    <input className="wp-input" value={formData.stats.baths} onChange={e => updateStats('baths', e.target.value)} />
                                                </div>
                                                <div className="wp-form-row">
                                                    <label className="wp-label">Size</label>
                                                    <input className="wp-input" value={formData.stats.size} onChange={e => updateStats('size', e.target.value)} />
                                                </div>
                                                <div className="wp-form-row">
                                                    <label className="wp-label">IPDC % (Optional)</label>
                                                    <input className="wp-input" value={formData.stats.ipdc} onChange={e => updateStats('ipdc', e.target.value)} />
                                                </div>
                                            </div>

                                            <div className="wp-form-row">
                                                <label className="wp-label">Key Features</label>
                                                {formData.features.map((feature, index) => (
                                                    <div key={index} style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
                                                        <input
                                                            className="wp-input"
                                                            value={feature}
                                                            onChange={e => updateArrayItem('features', index, null, e.target.value)}
                                                            placeholder="Feature text"
                                                        />
                                                        <button type="button" className="wp-btn wp-btn-danger" onClick={() => removeArrayItem('features', index)}>X</button>
                                                    </div>
                                                ))}
                                                <button type="button" className="wp-btn wp-btn-secondary" onClick={() => addArrayItem('features', '')}>+ Add Feature</button>
                                            </div>
                                        </div>
                                    )}

                                    {/* MEDIA TAB */}
                                    {propertyTab === 'media' && (
                                        <div style={{ display: 'grid', gap: '15px' }}>
                                            <div className="wp-form-row">
                                                <label className="wp-label">Hero Image URL</label>
                                                <input className="wp-input" value={formData.heroImage} onChange={e => setFormData({ ...formData, heroImage: e.target.value })} style={{ width: '100%' }} />
                                                {formData.heroImage && <img src={formData.heroImage} alt="Preview" style={{ height: '100px', marginTop: '10px', objectFit: 'cover' }} />}
                                            </div>

                                            <div className="wp-form-row">
                                                <label className="wp-label">Gallery Images</label>
                                                {formData.gallery.map((img, index) => (
                                                    <div key={index} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px', borderRadius: '4px' }}>
                                                        <div style={{ display: 'grid', gap: '5px' }}>
                                                            <input className="wp-input" placeholder="Image URL" value={img.url} onChange={e => updateArrayItem('gallery', index, 'url', e.target.value)} style={{ width: '100%' }} />
                                                            <input className="wp-input" placeholder="Caption" value={img.caption} onChange={e => updateArrayItem('gallery', index, 'caption', e.target.value)} style={{ width: '100%' }} />
                                                            <button type="button" className="wp-btn wp-btn-danger" onClick={() => removeArrayItem('gallery', index)} style={{ width: '60px' }}>Remove</button>
                                                        </div>
                                                    </div>
                                                ))}
                                                <button type="button" className="wp-btn wp-btn-secondary" onClick={() => addArrayItem('gallery', { url: '', caption: '' })}>+ Add Image</button>
                                            </div>
                                        </div>
                                    )}

                                    {/* LOCATION TAB */}
                                    {propertyTab === 'location' && (
                                        <div style={{ display: 'grid', gap: '15px' }}>
                                            <div className="wp-form-row">
                                                <label className="wp-label">Description / Address</label>
                                                <input className="wp-input" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} style={{ width: '100%' }} />
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                                <div className="wp-form-row">
                                                    <label className="wp-label">Latitude</label>
                                                    <input className="wp-input" type="number" step="any" value={formData.map.lat} onChange={e => setFormData({ ...formData, map: { ...formData.map, lat: parseFloat(e.target.value) } })} />
                                                </div>
                                                <div className="wp-form-row">
                                                    <label className="wp-label">Longitude</label>
                                                    <input className="wp-input" type="number" step="any" value={formData.map.lng} onChange={e => setFormData({ ...formData, map: { ...formData.map, lng: parseFloat(e.target.value) } })} />
                                                </div>
                                            </div>

                                            <div className="wp-form-row">
                                                <label className="wp-label">Nearby Hotspots</label>
                                                {formData.hotspots.map((spot, index) => (
                                                    <div key={index} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px', borderRadius: '4px', background: '#f9f9f9' }}>
                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '5px' }}>
                                                            <input className="wp-input" placeholder="Name" value={spot.name} onChange={e => updateArrayItem('hotspots', index, 'name', e.target.value)} />
                                                            <input className="wp-input" placeholder="Category" value={spot.category} onChange={e => updateArrayItem('hotspots', index, 'category', e.target.value)} />
                                                            <input className="wp-input" placeholder="Distance (m)" value={spot.distance} onChange={e => updateArrayItem('hotspots', index, 'distance', e.target.value)} />
                                                            <input className="wp-input" placeholder="Time (min)" value={spot.time} onChange={e => updateArrayItem('hotspots', index, 'time', e.target.value)} />
                                                        </div>
                                                        <button type="button" className="wp-btn wp-btn-danger" onClick={() => removeArrayItem('hotspots', index)}>Remove Spot</button>
                                                    </div>
                                                ))}
                                                <button type="button" className="wp-btn wp-btn-secondary" onClick={() => addArrayItem('hotspots', { name: '', category: '', distance: '', time: '' })}>+ Add Hotspot</button>
                                            </div>
                                        </div>
                                    )}

                                    {/* UNITS TAB */}
                                    {propertyTab === 'units' && (
                                        <div>
                                            {formData.units.map((unit, index) => (
                                                <div key={index} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px', background: '#fff' }}>
                                                    <h4 style={{ margin: '0 0 10px 0' }}>Unit #{index + 1}</h4>
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                                        <input className="wp-input" placeholder="Config (e.g. 2 Bed)" value={unit.config} onChange={e => updateArrayItem('units', index, 'config', e.target.value)} />
                                                        <input className="wp-input" placeholder="Area" value={unit.area} onChange={e => updateArrayItem('units', index, 'area', e.target.value)} />
                                                        <input className="wp-input" placeholder="Price" value={unit.price} onChange={e => updateArrayItem('units', index, 'price', e.target.value)} />
                                                        <input className="wp-input" placeholder="Min Price" value={unit.minPrice} onChange={e => updateArrayItem('units', index, 'minPrice', e.target.value)} />
                                                        <input className="wp-input" placeholder="Total Units" value={unit.totalUnits} onChange={e => updateArrayItem('units', index, 'totalUnits', e.target.value)} />
                                                        <input className="wp-input" placeholder="Sold Units" value={unit.soldUnits} onChange={e => updateArrayItem('units', index, 'soldUnits', e.target.value)} />
                                                    </div>
                                                    <textarea className="wp-input" placeholder="Description" rows="2" style={{ marginTop: '10px', width: '100%' }} value={unit.description} onChange={e => updateArrayItem('units', index, 'description', e.target.value)}></textarea>
                                                    <button type="button" className="wp-btn wp-btn-danger" onClick={() => removeArrayItem('units', index)} style={{ marginTop: '10px' }}>Remove Unit</button>
                                                </div>
                                            ))}
                                            <button type="button" className="wp-btn wp-btn-secondary" onClick={() => addArrayItem('units', { config: '', price: '', area: '', totalUnits: '', soldUnits: '', description: '' })}>+ Add Unit</button>
                                        </div>
                                    )}

                                    {/* DEVELOPER TAB */}
                                    {propertyTab === 'developer' && (
                                        <div style={{ display: 'grid', gap: '15px' }}>
                                            <div className="wp-form-row">
                                                <label className="wp-label">Developer Name</label>
                                                <input className="wp-input" value={formData.developer.name} onChange={e => setFormData({ ...formData, developer: { ...formData.developer, name: e.target.value } })} />
                                            </div>
                                            <div className="wp-form-row">
                                                <label className="wp-label">Description</label>
                                                <textarea className="wp-input" rows="4" value={formData.developer.description} onChange={e => setFormData({ ...formData, developer: { ...formData.developer, description: e.target.value } })} />
                                            </div>
                                            <div className="wp-form-row">
                                                <label className="wp-label">Image URL</label>
                                                <input className="wp-input" value={formData.developer.image} onChange={e => setFormData({ ...formData, developer: { ...formData.developer, image: e.target.value } })} style={{ width: '100%' }} />
                                            </div>
                                        </div>
                                    )}

                                    <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                                        <button className="wp-btn wp-btn-primary">Create Property</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'settings' && (
                    <>
                        <div className="wp-header">
                            <h1 className="wp-heading-1">System Settings</h1>
                        </div>
                        <div className="wp-card" style={{ maxWidth: '600px' }}>
                            <div className="wp-card-header">
                                <h2 className="wp-card-title">Airtable Integration</h2>
                            </div>
                            <div className="wp-card-body">
                                <p>Sync your local database with Airtable to ensure all properties are up to date.</p>
                                <button className="wp-btn wp-btn-secondary" onClick={handleSync} disabled={syncing}>
                                    {syncing ? 'Syncing...' : 'Sync Now'}
                                </button>
                            </div>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
};

export default AdminPage;
