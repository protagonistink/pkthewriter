// Shared Portable Text config for all narrative story fields.
// Normal prose + bold + links only — no headings, no bullets, no code.
// Keeps rendering predictable and prevents case studies from becoming formatted docs.
const storyBlock = [
  {
    type: 'block',
    styles: [{ title: 'Normal', value: 'normal' }],
    lists: [],
    marks: {
      decorators: [{ title: 'Bold', value: 'strong' }],
      annotations: [
        {
          name: 'link',
          type: 'object',
          fields: [{ name: 'href', title: 'URL', type: 'url' }],
        },
      ],
    },
  },
]

export default {
  name: 'project',
  title: 'Project',
  type: 'document',

  groups: [
    { name: 'story',    title: 'Story',    default: true },
    { name: 'credits',  title: 'Credits' },
    { name: 'media',    title: 'Media' },
    { name: 'settings', title: 'SEO' },
  ],

  fields: [
    // ─── STORY ───────────────────────────────────────────────────────────────
    // Fields are physically ordered Hook → Setup → Conflict → Resolution.
    // Do not insert other fields between them.

    {
      name: 'context',
      title: 'The Hook',
      type: 'text',
      rows: 2,
      description: 'The logline. One punchy sentence that opens the case study — make it earn the reader\'s attention.',
      validation: (Rule: any) => Rule.required().max(240),
      group: 'story',
    },
    {
      name: 'setup',
      title: 'The Setup',
      type: 'array',
      of: storyBlock,
      description: 'Set the scene. Who\'s the client, and what world are they operating in?',
      validation: (Rule: any) => Rule.required(),
      group: 'story',
    },
    {
      name: 'conflict',
      title: 'The Conflict',
      type: 'array',
      of: storyBlock,
      description: 'What made this hard? What were the stakes or constraints?',
      validation: (Rule: any) => Rule.required(),
      group: 'story',
    },
    {
      name: 'resolution',
      title: 'The Resolution',
      type: 'array',
      of: storyBlock,
      description: 'What did you actually make, and how did it turn out?',
      validation: (Rule: any) => Rule.required(),
      group: 'story',
    },

    // ─── CREDITS ─────────────────────────────────────────────────────────────

    {
      name: 'title',
      title: 'Campaign Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
      group: 'credits',
    },
    {
      name: 'brand',
      title: 'Client',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
      group: 'credits',
    },
    {
      name: 'role',
      title: 'Your Role',
      type: 'string',
      group: 'credits',
    },
    {
      name: 'year',
      title: 'Year',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
      group: 'credits',
    },
    {
      name: 'type',
      title: 'Project Type',
      type: 'string',
      group: 'credits',
    },
    {
      name: 'disciplines',
      title: 'Disciplines',
      type: 'array',
      of: [{ type: 'string' }],
      options: { sortable: true },
      validation: (Rule: any) => Rule.unique(),
      group: 'credits',
    },
    {
      name: 'deliverables',
      title: 'Key Deliverables',
      type: 'array',
      of: [{ type: 'string' }],
      options: { sortable: true },
      validation: (Rule: any) => Rule.unique(),
      group: 'credits',
    },
    {
      name: 'impact',
      title: 'Impact & Results',
      type: 'array',
      of: [{ type: 'string' }],
      options: { sortable: true },
      validation: (Rule: any) => Rule.unique(),
      group: 'credits',
    },

    // ─── MEDIA ───────────────────────────────────────────────────────────────

    {
      name: 'layout',
      title: 'Page Layout',
      type: 'string',
      description: 'Controls how the case study body renders. Drag editorial sections to reorder them.',
      options: {
        list: [
          { title: 'Editorial — numbered story moments with images', value: 'editorial' },
          { title: 'Gallery — full-bleed stills, no numbered sections', value: 'gallery' },
          { title: 'Film — video leads, then images / story', value: 'film' },
        ],
        layout: 'radio',
      },
      initialValue: 'editorial',
      group: 'media',
    },
    {
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      description: 'Clean image without text overlays — used full-bleed at the top of the case study page.',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt text', type: 'string' }],
      validation: (Rule: any) => Rule.required(),
      group: 'media',
    },
    {
      name: 'mainImage',
      title: 'Grid Thumbnail',
      type: 'image',
      description: 'Image shown in the work grid. Can include text or copy to showcase the work.',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt text', type: 'string' }],
      group: 'media',
    },
    {
      name: 'videoLinks',
      title: 'Video Portfolio',
      type: 'array',
      description: 'TV spots, brand films, trailers — add Vimeo or YouTube links.',
      of: [
        {
          type: 'object',
          name: 'videoItem',
          title: 'Video',
          fields: [
            {
              name: 'title',
              title: 'Spot / Video Title',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'url',
              title: 'Video URL',
              type: 'url',
              validation: (Rule: any) =>
                Rule.required().uri({ scheme: ['http', 'https'] }),
            },
            {
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'Vimeo', value: 'vimeo' },
                  { title: 'YouTube', value: 'youtube' },
                ],
                layout: 'radio',
              },
              initialValue: 'vimeo',
            },
            {
              name: 'thumbnail',
              title: 'Custom Thumbnail (Optional)',
              type: 'image',
              options: { hotspot: true },
            },
            {
              name: 'description',
              title: 'Description (Optional)',
              type: 'text',
              rows: 3,
            },
            {
              name: 'duration',
              title: 'Duration (Optional)',
              type: 'string',
              description: 'e.g. :30, 1:15',
            },
          ],
          preview: {
            select: { title: 'title', subtitle: 'url', platform: 'platform', media: 'thumbnail' },
            prepare({ title, subtitle, platform, media }: any) {
              return {
                title: title || 'Untitled Video',
                subtitle: `${platform || 'video'} · ${subtitle || 'No URL'}`,
                media,
              }
            },
          },
        },
      ],
      group: 'media',
    },
    {
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      description: 'Full-bleed stills. Shown on the case study page when no editorial sections are present.',
      of: [{ type: 'image', options: { hotspot: true } }],
      group: 'media',
    },
    {
      name: 'editorialSections',
      title: 'Editorial Story Moments',
      type: 'array',
      description: 'Add numbered story moments — each has copy, an optional pull quote, and images. When populated, these replace the gallery on the case study page.',
      of: [
        {
          type: 'object',
          name: 'editorialSection',
          fields: [
            {
              name: 'sectionTitle',
              title: 'Section Title (Internal)',
              type: 'string',
              description: 'Internal label only — not displayed on the page.',
            },
            {
              name: 'copyBlock',
              title: 'Copy',
              type: 'array',
              of: storyBlock,
            },
            {
              name: 'images',
              title: 'Images',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
                    { name: 'caption', title: 'Caption (Optional)', type: 'string' },
                  ],
                  preview: {
                    select: { media: 'image', caption: 'caption' },
                    prepare({ media, caption }: any) {
                      return { title: caption || 'Image', media }
                    },
                  },
                },
              ],
            },
            {
              name: 'imageLayout',
              title: 'Image Layout',
              type: 'string',
              description: 'How images in this section are arranged.',
              options: {
                list: [
                  { title: 'Full-bleed → Grid', value: 'full' },
                  { title: 'Asymmetric (wide + offset)', value: 'asymmetric' },
                  { title: 'Equal Grid (2-up)', value: 'grid' },
                ],
                layout: 'radio',
              },
              initialValue: 'full',
            },
            {
              name: 'video',
              title: 'Video (Optional)',
              type: 'object',
              fields: [
                { name: 'url', title: 'Video URL', type: 'url' },
                {
                  name: 'platform',
                  title: 'Platform',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Vimeo', value: 'vimeo' },
                      { title: 'YouTube', value: 'youtube' },
                    ],
                  },
                  initialValue: 'vimeo',
                },
                { name: 'thumbnail', title: 'Custom Thumbnail', type: 'image', options: { hotspot: true } },
              ],
            },
          ],
          preview: {
            select: { title: 'sectionTitle', media: 'images.0.image' },
            prepare({ title, media }: any) {
              return { title: title || 'Story Moment', subtitle: 'Copy + Media', media }
            },
          },
        },
      ],
      group: 'media',
    },

    // ─── SETTINGS ────────────────────────────────────────────────────────────

    {
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      readOnly: ({ document }: any) => !!document?.slug?.current,
      validation: (Rule: any) => Rule.required(),
      group: 'settings',
    },
  ],

  preview: {
    select: {
      title: 'title',
      brand: 'brand',
      year: 'year',
      media: 'heroImage',
      mainImage: 'mainImage',
    },
    prepare({ title, brand, year, media, mainImage }: any) {
      return {
        title: brand ? `${brand} — ${title}` : title,
        subtitle: year || '',
        media: media || mainImage,
      }
    },
  },
}
