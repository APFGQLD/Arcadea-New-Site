export default {
  name: 'pageAsset',
  title: 'Page Asset',
  type: 'document',
  fields: [
    {
      name: 'identifier',
      title: 'Identifier',
      type: 'string',
      description: 'Unique identifier for the image (e.g., services-hero)'
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      }
    }
  ],
  preview: {
    select: {
      title: 'identifier',
      media: 'image'
    }
  }
}
