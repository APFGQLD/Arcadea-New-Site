import { createClient } from '@sanity/client';
const client = createClient({
  projectId: 'b6pkfjxp',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01'
});
const query = `
      *[_type == "propertyCollection" && !(_id in path("drafts.**"))] | order(title desc) {
        "id": collectionId,
        title,
        properties[]-> {
          "id": propertyId,
          title,
          location,
          price,
          "image": image.asset->url,
          tag,
          features
        }
      }
    `;
client.fetch(query).then(res => {
    console.log(JSON.stringify(res, null, 2));
});
