export default {
  name: 'screenplay',
  title: 'Screenplay',
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
      name: 'genre',
      title: 'Genre',
      type: 'string',
      description: 'e.g., "Drama", "Dark Comedy", "Thriller"',
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'In Development', value: 'development' },
          { title: 'Complete', value: 'complete' },
          { title: 'Optioned', value: 'optioned' },
          { title: 'Produced', value: 'produced' },
        ],
        layout: 'radio',
      },
      initialValue: 'complete',
    },
    {
      name: 'logline',
      title: 'Logline',
      type: 'text',
      rows: 3,
      description: 'One or two sentence pitch shown on the screenwriting page.',
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'samplePdf',
      title: 'Sample PDF',
      type: 'file',
      description: 'Upload a PDF sample (first 10 pages, etc.).',
      options: { accept: 'application/pdf' },
    },
    {
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      description: 'Link to The Black List, a festival page, or a read-online version.',
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'status', media: 'coverImage' },
    prepare({ title, subtitle, media }: any) {
      const statusLabels: Record<string, string> = {
        development: 'In Development',
        complete: 'Complete',
        optioned: 'Optioned',
        produced: 'Produced',
      }
      return { title, subtitle: statusLabels[subtitle] ?? subtitle, media }
    },
  },
}
