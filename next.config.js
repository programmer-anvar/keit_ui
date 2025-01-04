/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        localPatterns: [
            {
                pathname: '/public/assets',
                search: ''
            }
        ], // For remote image URLs if needed
        // Allow local images under the assets folder
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    },
};

module.exports = nextConfig;