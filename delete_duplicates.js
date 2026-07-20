import { createClient } from '@sanity/client';
const client = createClient({
  projectId: 'b6pkfjxp', 
  dataset: 'production', 
  useCdn: false, 
  token: process.env.VITE_SANITY_WRITE_TOKEN,
  apiVersion: '2024-01-01'
});
async function run() {
  await client.delete('aq7AUICLogGimJulQL34CR');
  await client.delete('v4Gmojd07EdzSZUAQDahHS');
  console.log('Deleted duplicates');
}
run();
