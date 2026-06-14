//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

const strapiUrl = new URL(
  process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337',
);

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  nx: {},
  images: {
    remotePatterns: [
      {
        protocol: /** @type {'http'|'https'} */ (strapiUrl.protocol.replace(':', '')),
        hostname: strapiUrl.hostname,
        port: strapiUrl.port,
      },
    ],
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
