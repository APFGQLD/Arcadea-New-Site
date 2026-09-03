import 'dotenv/config';
import { createClient } from '@sanity/client';

const token = process.env.VITE_SANITY_WRITE_TOKEN;
if (!token) {
    console.error('Missing VITE_SANITY_WRITE_TOKEN in .env — see .env.example. Generate an "Editor" token at https://www.sanity.io/manage/project/b6pkfjxp/api#tokens');
    process.exit(1);
}

export const writeClient = createClient({
    projectId: process.env.VITE_SANITY_PROJECT_ID || 'b6pkfjxp',
    dataset: process.env.VITE_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token,
});
