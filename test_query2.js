import { createClient } from '@sanity/client';
const client = createClient({projectId: 'b6pkfjxp', dataset: 'production', useCdn: false, apiVersion: '2024-01-01'});
client.fetch('*[_type == "property"]{title, propertyId, collection}').then(console.log);
