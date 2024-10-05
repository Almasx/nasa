/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.externals.push({
      "react-leaflet": "react-leaflet",
      leaflet: "leaflet",
    });
    return config;
  },
};

module.exports = nextConfig;
