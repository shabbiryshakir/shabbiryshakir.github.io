/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Optional: Disable image optimization if you are using Next.js <Image> components 
  // (though in the code we wrote, we used standard <img> tags, so this shouldn't strictly be necessary, but it's safe to add)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;