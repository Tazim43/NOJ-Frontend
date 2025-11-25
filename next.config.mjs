/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com", "lh3.googleusercontent.com"], //  Cloudinary's domain
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
