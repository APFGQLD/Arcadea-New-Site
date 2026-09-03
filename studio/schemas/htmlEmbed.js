export default {
  name: 'htmlEmbed',
  title: 'HTML Embed',
  type: 'object',
  fields: [
    {
      name: 'code',
      title: 'HTML',
      type: 'text',
      rows: 10,
      description: 'Raw HTML, rendered as-is on the site. Use for embeds (iframes, widgets, forms) that can\'t be built with the normal editor tools.',
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {code: 'code'},
    prepare({code}) {
      return {
        title: 'HTML Embed',
        subtitle: code ? code.replace(/\s+/g, ' ').trim().slice(0, 60) : '(empty)',
      }
    },
  },
}
