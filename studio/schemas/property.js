export default {
  name: 'property',
  title: 'Property',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'propertyId',
      title: 'Property ID',
      type: 'string',
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
    },
    {
      name: 'price',
      title: 'Price',
      type: 'string',
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
      name: 'tag',
      title: 'Tag',
      type: 'string',
    },
    {
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{type: 'string'}],
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'statusTag',
      title: 'Status Tag',
      type: 'string',
    },
    {
      name: 'developer',
      title: 'Developer',
      type: 'object',
      fields: [
        { name: 'name', type: 'string', title: 'Name' },
        { name: 'description', type: 'text', title: 'Description' },
        { name: 'image', type: 'image', title: 'Image' }
      ]
    },
    {
      name: 'map',
      title: 'Map',
      type: 'object',
      fields: [
        { name: 'lat', type: 'number', title: 'Latitude' },
        { name: 'lng', type: 'number', title: 'Longitude' }
      ]
    },
    {
      name: 'stats',
      title: 'Stats',
      type: 'object',
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
        ]
      }]
    },
    {
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'image', type: 'image', title: 'Image' },
          { name: 'caption', type: 'string', title: 'Caption' }
        ]
      }]
    },
    {
      name: 'hotspots',
      title: 'Hotspots',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'name', type: 'string', title: 'Name' },
          { name: 'distance', type: 'string', title: 'Distance' },
          { name: 'time', type: 'string', title: 'Time' },
          { name: 'category', type: 'string', title: 'Category' }
        ]
      }]
    },
    {
      name: 'resources',
      title: 'Resources',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', type: 'string', title: 'Label' },
          { name: 'type', type: 'string', title: 'Type' },
          { name: 'link', type: 'string', title: 'Link (URL)' },
          { name: 'image', type: 'image', title: 'Image' }
        ]
      }]
    },
    {
      name: 'quickFacts',
      title: 'Quick Facts',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'icon', type: 'string', title: 'Icon Name' },
          { name: 'label', type: 'string', title: 'Label' },
          { name: 'value', type: 'string', title: 'Value' },
          { name: 'order', type: 'number', title: 'Order' }
        ]
      }]
    }
  ],
}
