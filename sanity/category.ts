// sanity/category.ts
export const category = {
  name: 'category',
  title: 'OS Folder / Category',
  type: 'document',
  fields: [
    { 
      name: 'title', 
      title: 'Title (e.g., Projects, About)', 
      type: 'string' 
    },
    { 
      name: 'slug', 
      title: 'ID / Slug', 
      type: 'slug', 
      options: { source: 'title' } 
    },
    { 
      name: 'description', 
      title: 'Short Description', 
      type: 'text' 
    },
    { 
      name: 'info', 
      title: 'Detailed Folder Info / Text', 
      type: 'text' 
    },
    {
      name: 'icon',
      title: 'FontAwesome Icon Class',
      type: 'string',
      description: 'Example: fa-code, fa-gears, fa-video, fa-folder. (Find more at fontawesome.com/search)',
      initialValue: 'fa-folder'
    },
    { 
      name: 'color', 
      title: 'Theme Color (Hex Code)', 
      type: 'string', 
      description: 'Hex color for the folder glow (e.g., #4da6ff)',
      initialValue: '#4da6ff' 
    },
    { 
      name: 'skillsList', 
      title: 'System Capabilities (Progress Bars)', 
      type: 'array', 
      of: [{ type: 'skill' }],
      description: 'Add your tools and percentages here.'
    },
    { 
      name: 'parent', 
      title: 'Parent Folder (Leave blank if Main Desktop)', 
      type: 'reference', 
      to: [{ type: 'category' }] 
    }
  ]
}