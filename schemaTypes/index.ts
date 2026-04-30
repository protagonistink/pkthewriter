import { type SchemaTypeDefinition } from 'sanity'
import project from './project'
import writingClip from './writingClip'
import screenplay from './screenplay'
import aboutPage from './aboutPage'
import suggestionSet from './suggestionSet'

export const schemaTypes: SchemaTypeDefinition[] = [
  project,
  writingClip,
  screenplay,
  aboutPage,
  suggestionSet,
]
