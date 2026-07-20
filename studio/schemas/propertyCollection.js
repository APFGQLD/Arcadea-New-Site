export default {
  name: 'propertyCollection',
  title: 'Property Collection',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'collectionId',
      title: 'Collection ID',
      type: 'string',
    },
    {
      name: 'logoLight',
      title: 'Logo Light',
      type: 'image',
    },
    {
      name: 'logoDark',
      title: 'Logo Dark',
      type: 'image',
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'properties',
      title: 'Properties',
      type: 'array',
      of: [{type: 'reference', to: {type: 'property'}}],
    },
  ],
}
