export default {
  name: 'suggestionSet',
  title: 'Suggestion Set',
  type: 'document',
  // Singleton — one document that holds the landing-page suggestion tray.
  fields: [
    {
      name: 'label',
      title: 'Internal Label',
      type: 'string',
      description: 'Internal name (e.g., "Landing Page Suggestions"). Not displayed publicly.',
      initialValue: 'Landing Page Suggestions',
    },
    {
      name: 'items',
      title: 'Suggestions',
      type: 'array',
      description: 'Pick 3 documents (any mix of projects, stories, blog posts, or screenplays) to surface on the landing page.',
      of: [
        {
          type: 'reference',
          to: [
            { type: 'project' },
            { type: 'writingClip' },
            { type: 'screenplay' },
          ],
        },
      ],
      validation: (Rule: any) => Rule.max(6),
    },
  ],
  preview: {
    select: { title: 'label' },
    prepare({ title }: any) {
      return { title: title || 'Suggestion Set' }
    },
  },
}
