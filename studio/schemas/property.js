export default {
  name: 'property',
  title: 'Property',
  type: 'document',
  groups: [
    { name: 'overview', title: 'Overview', default: true },
    { name: 'media', title: 'Media' },
    { name: 'listing', title: 'Listing' },
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
      title: 'Area',
      type: 'string',
      group: 'overview',
      description: 'Short label shown on listing cards, e.g. "Canggu, Bali". For the full street address used by the map, see Address on the Location tab.',
      validation: (Rule) => Rule.required(),
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
      description: 'Short highlight bullets (e.g. "Ocean Views", "Rooftop Pool"). Only shown on the property cards on the /properties listing page — not on this property\'s own page. For stats shown there, use Quick Facts below.',
      of: [{type: 'string'}],
    },
    {
      name: 'description',
      title: 'Description',
      type: 'array',
      group: 'overview',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Numbered', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: 'quickFacts',
      title: 'Quick Facts',
      type: 'array',
      group: 'overview',
      description: 'Shown in the "Quick Facts" sidebar on this property\'s own page. For bullet highlights shown on the /properties listing card, use Features above.',
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
      name: 'price',
      title: 'Price',
      type: 'object',
      group: 'listing',
      fields: [
        {
          name: 'enquiryOnly',
          title: 'By Enquiry Only',
          type: 'boolean',
          description: 'Hides the amount on the site and shows "By Enquiry Only" instead',
          initialValue: false,
        },
        {
          name: 'prefix',
          title: 'Prefix',
          type: 'string',
          description: 'Optional, e.g. "From", "Offers Over", "Guide"',
          hidden: ({ parent }) => !!parent?.enquiryOnly,
        },
        {
          name: 'amount',
          title: 'Amount',
          type: 'number',
          hidden: ({ parent }) => !!parent?.enquiryOnly,
        },
      ],
      preview: {
        select: { enquiryOnly: 'enquiryOnly', prefix: 'prefix', amount: 'amount' },
        prepare({ enquiryOnly, prefix, amount }) {
          if (enquiryOnly) return { title: 'By Enquiry Only' };
          if (amount == null) return { title: 'No price set' };
          const formatted = `$${Number(amount).toLocaleString('en-US')}`;
          return { title: prefix ? `${prefix} ${formatted}` : formatted };
        },
      },
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'listing',
      options: {
        list: ['For Sale', 'Under Offer', 'Sold', 'Coming Soon', 'Off Market'],
      },
    },
    {
      name: 'ctaLabel',
      title: 'Call-to-Action Label',
      type: 'string',
      group: 'listing',
      description: 'Button text, e.g. "Enquire Now", "Book a Viewing". Defaults to "Enquire Now" if left blank.',
    },
    {
      name: 'ctaLink',
      title: 'Call-to-Action Link',
      type: 'url',
      group: 'listing',
      description: 'Optional external link (e.g. a booking page). If left blank, the button opens the on-site enquiry form instead.',
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
          {
            name: 'file',
            type: 'file',
            title: 'File Upload',
            description: 'Upload a PDF or other file directly (e.g. a brochure). Takes priority over Link below if both are set.',
          },
          {
            name: 'link',
            type: 'string',
            title: 'Link (URL)',
            description: 'Use this instead of File Upload for an external link (e.g. a virtual tour or booking page).',
          },
          { name: 'image', type: 'image', title: 'Image' }
        ],
        preview: {
          select: { title: 'label', subtitle: 'type', media: 'image' },
        },
        validation: (Rule) => Rule.custom((resource) => {
          if (!resource?.file && !resource?.link) {
            return 'Add either a File Upload or a Link.';
          }
          return true;
        }),
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
