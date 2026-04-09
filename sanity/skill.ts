// sanity/skill.ts
export const skill = {
  name: 'skill',
  title: 'Skill Progress',
  type: 'object',
  fields: [
    { name: 'skillName', title: 'Tool / Skill Name (e.g., Premiere Pro)', type: 'string' },
    { 
      name: 'percentage', 
      title: 'Percentage (0-100)', 
      type: 'number',
      validation: (Rule: any) => Rule.min(0).max(100)
    }
  ]
}