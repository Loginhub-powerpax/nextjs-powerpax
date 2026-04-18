/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Used by instrumentation.js to build the self-ping URL
    NEXT_PUBLIC_SITE_URL: 'https://powerpax.in',
  },
};

export default nextConfig;
