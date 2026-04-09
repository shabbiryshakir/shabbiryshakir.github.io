// sanity/schema.ts
import { type SchemaTypeDefinition } from 'sanity'
import { category } from './category'
import { project } from './projectType'
import { skill } from './skill' 
import profile from './profile'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [category, project, skill, profile], 
}