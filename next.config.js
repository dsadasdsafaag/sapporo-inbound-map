const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: isProd ? '/sapporo-inbound-map' : '',
  assetPrefix: isProd ? '/sapporo-inbound-map/' : '',
  images: {
    unoptimized: true,
  }
};
module.exports = nextConfig;
