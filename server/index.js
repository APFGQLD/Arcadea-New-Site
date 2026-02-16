import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDb } from './db.js';
import { syncAirtable } from './sync.js';

// Load env vars from root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Initialize DB
getDb().then(() => {
    console.log('Database initialized');
}).catch(err => {
    console.error('Failed to initialize database:', err);
});

// Routes

// Root Route
app.get('/', (req, res) => {
    res.send('Arcadea Property API Server Running');
});

// 1. Sync Endpoint
app.post('/api/sync', async (req, res) => {
    try {
        const result = await syncAirtable();
        if (result.success) {
            res.json({ message: 'Sync successful' });
        } else {
            res.status(500).json({ error: result.error });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Create Property (Manual)
app.post('/api/properties', async (req, res) => {
    try {
        const { title, location, price, description, collection, bedrooms, bathrooms, size } = req.body;
        const db = await getDb();

        const id = 'local_' + Date.now();
        const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        const features = JSON.stringify([
            bedrooms ? `${bedrooms} Bed` : '',
            bathrooms ? `${bathrooms} Bath` : '',
            size
        ].filter(Boolean));

        const details = JSON.stringify({
            description: description,
            stats: {
                beds: bedrooms,
                baths: bathrooms,
                size: size
            }
        });

        await db.run(`INSERT INTO projects (
            id, title, location, price, image, tag, collection, slug, features, details, last_synced, source
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'local')`, [
            id, title, location, price, '', 'Exclusive', collection, slug, features, details, Date.now()
        ]);

        res.json({ success: true, id, slug });
    } catch (error) {
        console.error('Create Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// 2. Get Properties (Filtered by Collection)
app.get('/api/properties', async (req, res) => {
    try {
        const db = await getDb();
        const { collection } = req.query;
        let query = 'SELECT * FROM projects';
        const params = [];

        if (collection) {
            query += ' WHERE collection = ?';
            params.push(collection);
        }

        const properties = await db.all(query, params);

        // Parse JSON fields
        const formattedProperties = properties.map(p => ({
            ...p,
            features: JSON.parse(p.features || '[]'),
            details: JSON.parse(p.details || '{}')
        }));

        res.json(formattedProperties);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Get Property Detail
app.get('/api/properties/:idOrSlug', async (req, res) => {
    try {
        const db = await getDb();
        const { idOrSlug } = req.params;

        // Try to find by ID first, then Slug
        let project = await db.get('SELECT * FROM projects WHERE id = ?', [idOrSlug]);
        if (!project) {
            project = await db.get('SELECT * FROM projects WHERE slug = ?', [idOrSlug]);
        }

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const projectId = project.id;

        // Fetch linked data
        const units = await db.all('SELECT * FROM units WHERE project_id = ?', [projectId]);
        const hotspots = await db.all('SELECT * FROM hotspots WHERE project_id = ?', [projectId]);
        const gallery = await db.all('SELECT * FROM gallery WHERE project_id = ?', [projectId]);
        const resources = await db.all('SELECT * FROM resources WHERE project_id = ?', [projectId]);

        const details = JSON.parse(project.details || '{}');

        const response = {
            id: project.id,
            name: project.title,
            description: details.description,
            statusTag: details.statusTag,
            collection: project.collection,
            heroImage: details.heroImage,
            stats: details.stats,
            developer: details.developer,
            map: details.map,
            units: units,
            hotspots: hotspots,
            gallery: gallery,
            resources: resources
        };

        res.json(response);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
