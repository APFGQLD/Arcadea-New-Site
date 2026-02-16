const API_URL = '/api';

import { oneParkLaneProject } from '../data/oneParkLaneData';

/**
 * Fetch all projects for a specific collection
 */
export const fetchProjectsByCollection = async (collectionName) => {
    // 1. Prepare static projects if any
    let staticProjects = [];
    if (collectionName === 'Coastal' || collectionName === 'coastal') {
        staticProjects.push({
            id: oneParkLaneProject.id,
            title: oneParkLaneProject.name,
            location: oneParkLaneProject.location,
            price: oneParkLaneProject.price,
            image: oneParkLaneProject.heroImage,
            tag: oneParkLaneProject.tag,
            features: [
                oneParkLaneProject.stats.beds + ' Bed',
                oneParkLaneProject.stats.baths + ' Bath',
                oneParkLaneProject.stats.size
            ],
            collection: 'Coastal',
            slug: oneParkLaneProject.slug,
        });
    }

    try {
        const response = await fetch(`${API_URL}/properties?collection=${collectionName}`);
        if (!response.ok) {
            throw new Error(`Backend Error: ${response.statusText}`);
        }
        const backendProjects = await response.json();

        // Combine static and backend projects
        return [...staticProjects, ...backendProjects];
    } catch (error) {
        console.error('Backend Fetch Error:', error);
        // Fallback to static projects if available
        if (staticProjects.length > 0) return staticProjects;
        throw error;
    }
};

/**
 * Fetch a single project with all its linked data
 */
export const fetchProjectDetail = async (projectIdOrSlug) => {
    // 1. Check for Static Project first
    if (projectIdOrSlug === oneParkLaneProject.id || projectIdOrSlug === oneParkLaneProject.slug) {
        return oneParkLaneProject;
    }

    try {
        const response = await fetch(`${API_URL}/properties/${projectIdOrSlug}`);
        if (!response.ok) {
            throw new Error('Failed to fetch project detail from backend');
        }
        return await response.json();
    } catch (error) {
        console.error('Backend Detail Fetch Error:', error);
        throw error;
    }
};

/**
 * Trigger a sync with Airtable
 */
export const syncProperties = async () => {
    try {
        const response = await fetch(`${API_URL}/sync`, { method: 'POST' });
        if (!response.ok) {
            throw new Error('Sync failed');
        }
        return await response.json();
    } catch (error) {
        console.error('Sync Error:', error);
        throw error;
    }
};

