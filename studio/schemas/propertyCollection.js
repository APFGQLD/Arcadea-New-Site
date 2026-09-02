export default {
  name: 'propertyCollection',
  title: 'Property Collection',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'collectionId',
      title: 'Collection ID',
      type: 'string',
      description: 'Used in the page URL hash, e.g. #coastal',
      validation: (Rule) => Rule.required(),
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
      validation: (Rule) => Rule.required(),
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
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'properties',
      title: 'Properties',
      type: 'array',
      of: [{type: 'reference', to: {type: 'property'}}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'location',
      media: 'image',
    },
  },
}
