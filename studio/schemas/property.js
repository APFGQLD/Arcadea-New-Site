export default {
  name: 'property',
  title: 'Property',
  type: 'document',
  groups: [
    { name: 'overview', title: 'Overview', default: true },
    { name: 'media', title: 'Media' },
    { name: 'availability', title: 'Availability' },
    { name: 'location', title: 'Location' },
    { name: 'resources', title: 'Resources' },
    { name: 'agents', title: 'Agents' },
  ],
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'overview',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'propertyId',
      title: 'Property ID',
      type: 'string',
      group: 'overview',
      description: 'Used in the page URL, e.g. one-park-lane',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      group: 'overview',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'price',
      title: 'Price',
      type: 'string',
      group: 'overview',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      group: 'overview',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'tag',
      title: 'Tag',
      type: 'string',
      group: 'overview',
    },
    {
      name: 'statusTag',
      title: 'Status Tag',
      type: 'string',
      group: 'overview',
    },
    {
      name: 'features',
      title: 'Features',
      type: 'array',
      group: 'overview',
      of: [{type: 'string'}],
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      group: 'overview',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'quickFacts',
      title: 'Quick Facts',
      type: 'array',
      group: 'overview',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'icon',
            type: 'string',
            title: 'Icon',
            description: 'Matches the icon set used on the project page',
            options: {
              list: [
                { title: 'Bed', value: 'bed' },
                { title: 'Bath', value: 'bath' },
                { title: 'Toilet', value: 'toilet' },
                { title: 'Car', value: 'car' },
                { title: 'Home', value: 'home' },
                { title: 'Calendar', value: 'calendar' },
                { title: 'Map Pin', value: 'mappin' },
                { title: 'Clock', value: 'clock' },
                { title: 'Currency / Dollar', value: 'currencydollar' },
                { title: 'Shield Check', value: 'shieldcheck' },
                { title: 'Building / Office', value: 'buildingoffice' },
                { title: 'Briefcase', value: 'briefcase' },
                { title: 'Users', value: 'users' },
                { title: 'Light Bulb', value: 'lightbulb' },
                { title: 'Globe', value: 'globealt' },
                { title: 'Size / Expand', value: 'arrowspointingout' },
                { title: 'Sparkles', value: 'sparkles' },
                { title: 'Moon', value: 'moon' },
                { title: 'Chart / Default', value: 'presentationchartline' },
              ],
            },
          },
          { name: 'label', type: 'string', title: 'Label' },
          { name: 'value', type: 'string', title: 'Value' },
          { name: 'order', type: 'number', title: 'Order' }
        ],
        preview: {
          select: { title: 'label', subtitle: 'value' },
        },
      }]
    },
    {
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'media',
      of: [{
        type: 'object',
        fields: [
          { name: 'image', type: 'image', title: 'Image' },
          { name: 'caption', type: 'string', title: 'Caption' }
        ],
        preview: {
          select: { title: 'caption', media: 'image' },
        },
      }]
    },
    {
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      group: 'media',
      description: 'Optional YouTube link shown as an embedded video on the project page',
    },
    {
      name: 'stats',
      title: 'Stats',
      type: 'object',
      group: 'availability',
      fields: [
        { name: 'beds', type: 'string', title: 'Beds' },
        { name: 'baths', type: 'string', title: 'Baths' },
        { name: 'size', type: 'string', title: 'Size' },
        { name: 'ipdc', type: 'string', title: 'IPDC' }
      ]
    },
    {
      name: 'units',
      title: 'Units',
      type: 'array',
      group: 'availability',
      of: [{
        type: 'object',
        fields: [
          { name: 'config', type: 'string', title: 'Config' },
          { name: 'totalUnits', type: 'number', title: 'Total Units' },
          { name: 'soldUnits', type: 'number', title: 'Sold Units' },
          { name: 'price', type: 'string', title: 'Price Display' },
          { name: 'minPrice', type: 'number', title: 'Minimum Price' },
          { name: 'description', type: 'text', title: 'Description' },
          { name: 'image', type: 'image', title: 'Image' },
          { name: 'floorPlan', type: 'image', title: 'Floor Plan' },
          { name: 'percentage', type: 'number', title: 'Percentage' },
          { name: 'salesLink', type: 'url', title: 'Sales Link' }
        ],
        preview: {
          select: { title: 'config', subtitle: 'price', media: 'image' },
        },
      }]
    },
    {
      name: 'address',
      title: 'Address',
      type: 'string',
      group: 'location',
      description: 'Full address shown alongside the map',
    },
    {
      name: 'map',
      title: 'Map',
      type: 'object',
      group: 'location',
      fields: [
        { name: 'lat', type: 'number', title: 'Latitude' },
        { name: 'lng', type: 'number', title: 'Longitude' }
      ]
    },
    {
      name: 'resources',
      title: 'Resources',
      type: 'array',
      group: 'resources',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', type: 'string', title: 'Label' },
          { name: 'type', type: 'string', title: 'Type' },
          { name: 'link', type: 'string', title: 'Link (URL)' },
          { name: 'image', type: 'image', title: 'Image' }
        ],
        preview: {
          select: { title: 'label', subtitle: 'type', media: 'image' },
        },
      }]
    },
    {
      name: 'agents',
      title: 'Agents',
      type: 'array',
      group: 'agents',
      of: [{ type: 'reference', to: {type: 'agent'} }],
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
