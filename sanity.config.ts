import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Patrick Kirkland | Writer',

  projectId: 'gz4qpupc',
  dataset: 'portfolio',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('About Page')
              .id('aboutPage')
              .child(
                S.document()
                  .schemaType('aboutPage')
                  .documentId('aboutPage')
              ),
            S.listItem()
              .title('Landing Suggestions')
              .id('suggestionSet')
              .child(
                S.document()
                  .schemaType('suggestionSet')
                  .documentId('suggestionSet')
              ),
            S.divider(),
            S.documentTypeListItem('project').title('Projects'),
            S.documentTypeListItem('writingClip').title('Writing Clips'),
            S.documentTypeListItem('screenplay').title('Screenplays'),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
