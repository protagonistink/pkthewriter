export default {
  name: 'writingClip',
  title: 'Writing Clip',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'year',
      title: 'Year',
      type: 'string',
    },
    {
      name: 'clipType',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Essay', value: 'essay' },
          { title: 'Story', value: 'story' },
          { title: 'Column', value: 'column' },
          { title: 'Interview', value: 'interview' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'radio',
      },
      initialValue: 'essay',
    },
    {
      name: 'outlet',
      title: 'Outlet / Publication',
      type: 'string',
      description: 'e.g., "Substack", "Protagonist Ink", "The Atlantic"',
    },
    {
      name: 'url',
      title: 'URL',
      type: 'url',
      description: 'Where the piece lives. Everything links out.',
      validation: (Rule: any) => Rule.required().uri({ scheme: ['http', 'https'] }),
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Two or three lines shown in the list and on suggestion cards.',
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show on the /writing page.',
      initialValue: true,
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'outlet', type: 'clipType' },
    prepare({ title, subtitle, type }: any) {
      return { title, subtitle: [type, subtitle].filter(Boolean).join(' • ') }
    },
  },
}
