export default {
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  // Singleton — only one document of this type should exist.
  fields: [
    {
      name: 'headline',
      title: 'Headline',
      type: 'string',
      description: 'e.g., "I write things. For a living."',
    },
    {
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'resumePdf',
      title: 'Résumé PDF',
      type: 'file',
      options: { accept: 'application/pdf' },
    },
    {
      name: 'email',
      title: 'Contact Email',
      type: 'string',
    },
    {
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string', description: 'e.g., "LinkedIn", "Substack"' },
            { name: 'url', title: 'URL', type: 'url' },
          ],
          preview: {
            select: { title: 'label', subtitle: 'url' },
          },
        },
      ],
    },
  ],
  preview: {
    prepare() {
      return { title: 'About Page' }
    },
  },
}
