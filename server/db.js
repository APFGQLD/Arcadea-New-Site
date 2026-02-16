import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let dbInstance = null;

export async function getDb() {
    if (dbInstance) return dbInstance;

    const dbPath = path.join(__dirname, 'database.sqlite');

    dbInstance = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    await initializeDb(dbInstance);

    return dbInstance;
}

async function initializeDb(db) {
    // Create Projects table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            title TEXT,
            location TEXT,
            price TEXT,
            image TEXT,
            tag TEXT,
            collection TEXT,
            slug TEXT,
            features TEXT, -- JSON string
            details TEXT,   -- JSON string for full details (description, statusTag, heroImage, stats, developer, map, etc.)
            last_synced INTEGER,
            source TEXT DEFAULT 'airtable'
        )
    `);

    // Migration for existing tables without 'source' column
    try {
        await db.exec(`ALTER TABLE projects ADD COLUMN source TEXT DEFAULT 'airtable'`);
    } catch (e) {
        // Column likely exists
    }

    // Create Units table (linked to projects)
    await db.exec(`
        CREATE TABLE IF NOT EXISTS units (
            id TEXT PRIMARY KEY,
            project_id TEXT,
            config TEXT,
            price TEXT,
            area TEXT,
            status TEXT,
            floorPlan TEXT,
            image TEXT,
            description TEXT,
            totalUnits INTEGER,
            soldUnits INTEGER,
            minPrice TEXT,
            percentage TEXT,
            FOREIGN KEY(project_id) REFERENCES projects(id)
        )
    `);

    // Create Hotspots table (linked to projects)
    await db.exec(`
        CREATE TABLE IF NOT EXISTS hotspots (
            id TEXT PRIMARY KEY,
            project_id TEXT,
            name TEXT,
            category TEXT,
            distance TEXT,
            time TEXT,
            FOREIGN KEY(project_id) REFERENCES projects(id)
        )
    `);

    // Create Gallery table (linked to projects)
    await db.exec(`
        CREATE TABLE IF NOT EXISTS gallery (
            id TEXT PRIMARY KEY,
            project_id TEXT,
            url TEXT,
            caption TEXT,
            FOREIGN KEY(project_id) REFERENCES projects(id)
        )
    `);

    // Create Resources table (linked to projects)
    await db.exec(`
        CREATE TABLE IF NOT EXISTS resources (
            id TEXT PRIMARY KEY,
            project_id TEXT,
            label TEXT,
            type TEXT,
            link TEXT,
            image TEXT,
            FOREIGN KEY(project_id) REFERENCES projects(id)
        )
    `);
}
