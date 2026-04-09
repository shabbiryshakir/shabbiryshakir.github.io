export default {
  name: 'profile',
  title: 'Global Profile Settings',
  type: 'document',
  fields: [
    { name: 'name', title: 'Short Name (Menu, Widgets, Footer)', type: 'string', initialValue: 'Shabbir Shakir' },
    { name: 'fullName', title: 'Full Formal Name (About Page Only)', type: 'string', initialValue: 'M Shabbir Shk Yusuf Shakir' },
    { name: 'role', title: 'Job Title / Role', type: 'string', initialValue: 'System Architect' },
    { name: 'location', title: 'Current Location', type: 'string', initialValue: 'Barwani, MP' },
    { name: 'company', title: 'Company / School', type: 'string', initialValue: 'PHS School' },
    { name: 'profileImage', title: 'Profile Picture', type: 'image', options: { hotspot: true } },
    { name: 'github', title: 'GitHub URL', type: 'url' },
    { name: 'linkedin', title: 'LinkedIn URL', type: 'url' },
    { name: 'email', title: 'Email Address', type: 'string' },
    { name: 'whatsapp', title: 'WhatsApp Number', type: 'string' },
    { name: 'instagram', title: 'Instagram URL', type: 'url' },
  ]
}