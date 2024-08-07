const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    // Cloudflare specific configuration
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
        };
      }
      return config;
    },
  };
  
  module.exports = nextConfig;