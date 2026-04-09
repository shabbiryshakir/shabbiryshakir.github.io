// sanity/projectType.ts
export const project = {
  name: 'project',
  title: 'Project / Item',
  type: 'document',
  fields: [
    { name: 'title', title: 'Project Title (e.g., Anglophone)', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } },
    { name: 'description', title: 'Description', type: 'text' },
    {
      name: 'projectType',
      title: 'Project Type',
      type: 'string',
      options: {
        list: [
          { title: 'Website / Web App', value: 'website' },
          { title: 'Video / YouTube', value: 'video' },
          { title: 'Photo / Design', value: 'photo' },
          { title: 'PDF / Document', value: 'pdf' }
        ]
      },
      initialValue: 'website'
    },
    { name: 'link', title: 'External Link / Video URL', type: 'url' },
    { name: 'coverImage', title: 'Cover Image (Used for 3D Cards)', type: 'image', options: { hotspot: true } },
    { name: 'color', title: 'Theme Color', type: 'string', initialValue: '#ffffff' },
    { 
      name: 'category', 
      title: 'Which Sector does this belong to?', 
      type: 'reference', 
      to: [{ type: 'category' }] 
    },
    {
      name: 'uploadFile',
      title: 'Upload PDF / Document',
      type: 'file',
      options: { accept: 'application/pdf' },
      description: 'Upload a PDF directly. This will override the external link.'
    },
    {
      name: 'uploadImage',
      title: 'Upload High-Res Image',
      type: 'image',
      description: 'Upload a specific image for the photo viewer. (Overrides cover image)'
    }
    
  ]
}