export default {
  name: 'profile',
  title: 'Global Profile Settings',
  type: 'document',
  fields: [
    { name: 'name', title: 'Short Name (Menu, Widgets, Footer)', type: 'string', initialValue: 'Shabbir Shakir' },
    { name: 'fullName', title: 'Full Formal Name (About Page Only)', type: 'string', initialValue: 'M Shabbir Shk Yusuf Shakir' },
    { name: 'role', title: 'Job Title / Role', type: 'string', initialValue: 'System Architect' },
    { name: 'location', title: 'Current Location', type: 'string', initialValue: 'Dubai, UAE' },
    { name: 'company', title: 'Company / Business', type: 'string' },
    { name: 'education', title: 'Education (small line under company)', type: 'string' },
    { name: 'tagline', title: 'One-line Tagline (About Page)', type: 'string' },
    {
      name: 'ventures', title: 'Businesses / Work (About Page)', type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'name', title: 'Name', type: 'string' },
        { name: 'role', title: 'Your Role', type: 'string' },
        { name: 'description', title: 'Description', type: 'text' },
        { name: 'link', title: 'Link', type: 'url' },
      ] }]
    },
    {
      name: 'qualifications', title: 'Qualifications (About Page)', type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'title', title: 'Qualification', type: 'string' },
        { name: 'institution', title: 'Institution', type: 'string' },
        { name: 'year', title: 'Year', type: 'string' },
      ] }]
    },
    { name: 'profileImage', title: 'Profile Picture', type: 'image', options: { hotspot: true } },
    { name: 'github', title: 'GitHub URL', type: 'url' },
    { name: 'linkedin', title: 'LinkedIn URL', type: 'url' },
    { name: 'email', title: 'Email Address', type: 'string' },
    { name: 'whatsapp', title: 'WhatsApp Number', type: 'string' },
    { name: 'instagram', title: 'Instagram URL', type: 'url' },
  ]
}