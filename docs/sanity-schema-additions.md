# Sanity Schema Additions — pkthewriter (`gz4qpupc`)

Add the following document types to your Sanity Studio repo (likely `/Users/pat/Sites/pkthewriter/v3/studio/schemaTypes/` or wherever the deployed studio lives).

## story.ts

```ts
export default {
  name: 'story',
  title: 'Story',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: (R:any)=>R.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (R:any)=>R.required() },
    { name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3 },
    { name: 'body', title: 'Body', type: 'array', of: [{ type: 'block' }] },
    { name: 'year', title: 'Year', type: 'string' },
    { name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true } },
    { name: 'featured', title: 'Featured', type: 'boolean', initialValue: false },
  ],
};
```

## blogPost.ts

```ts
export default {
  name: 'blogPost',
  title: 'Blog Post (external link)',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: (R:any)=>R.required() },
    { name: 'outlet', title: 'Outlet', type: 'string', description: 'e.g., Substack, Fast Company' },
    { name: 'year', title: 'Year', type: 'string' },
    { name: 'url', title: 'URL', type: 'url', validation: (R:any)=>R.required() },
    { name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3 },
    { name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true } },
    { name: 'featured', title: 'Featured', type: 'boolean', initialValue: false },
  ],
};
```

## screenplay.ts

```ts
export default {
  name: 'screenplay',
  title: 'Screenplay',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: (R:any)=>R.required() },
    { name: 'logline', title: 'Logline', type: 'text', rows: 3 },
    { name: 'genre', title: 'Genre', type: 'string' },
    { name: 'status', title: 'Status', type: 'string', options: { list: [
      { title: 'Spec', value: 'spec' },
      { title: 'Optioned', value: 'optioned' },
      { title: 'Produced', value: 'produced' },
    ], layout: 'radio' } },
    { name: 'year', title: 'Year', type: 'string' },
    { name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true } },
    { name: 'samplePdf', title: 'Sample PDF (first 10 pages)', type: 'file' },
    { name: 'externalUrl', title: 'External URL (Coverfly/BlackList/IMDb)', type: 'url' },
  ],
};
```

## aboutPage.ts (singleton)

```ts
export default {
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    { name: 'bio', title: 'Bio', type: 'array', of: [{ type: 'block' }] },
    { name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } },
    { name: 'resumePdf', title: 'Resume PDF', type: 'file' },
    { name: 'email', title: 'Email', type: 'string' },
    { name: 'socialLinks', title: 'Social Links', type: 'array', of: [{
      type: 'object',
      fields: [
        { name: 'label', title: 'Label', type: 'string' },
        { name: 'url', title: 'URL', type: 'url' },
      ],
    }] },
  ],
};
```

Register as singleton in `structure.ts`:

```ts
S.listItem().title('About Page').id('aboutPage').child(
  S.document().schemaType('aboutPage').documentId('aboutPage')
)
```

## suggestionSet.ts (singleton)

```ts
export default {
  name: 'suggestionSet',
  title: 'Featured Suggestions (landing)',
  type: 'document',
  fields: [
    { name: 'items', title: 'Featured (3 items)', type: 'array',
      of: [{ type: 'reference', to: [
        { type: 'project' },
        { type: 'story' },
        { type: 'blogPost' },
      ] }],
      validation: (R:any)=>R.required().length(3),
    },
  ],
};
```

Register as singleton. Fix documentId: `suggestionSet`.

## Register all in index.ts

```ts
import project from './project';
import author from './author';
import story from './story';
import blogPost from './blogPost';
import screenplay from './screenplay';
import aboutPage from './aboutPage';
import suggestionSet from './suggestionSet';

export const schemaTypes = [project, author, story, blogPost, screenplay, aboutPage, suggestionSet];
```

## After deploying

1. Deploy the studio: `cd studio && npm run deploy`
2. Create at least: 1 `aboutPage`, 1 `suggestionSet` with 3 references, 1 `story`, 1 `blogPost`, 1 `screenplay`.
3. Mark 2+ existing `project` docs as `featured: true`.
