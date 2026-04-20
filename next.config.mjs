import createNextIntlPlugin from "next-intl/plugin";
import { createMDX } from "fumadocs-mdx/next";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const withMDX = createMDX({
  configPath: "./core/fumadocs/source.config.ts",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_INTL_CONFIG_PATH: "i18n/request.ts",
  },

  htmlLimitedBots: /.*/,

  devIndicators: {
    position: "bottom-right",
  },

  compress: true,

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "react-grid-layout",
      "mobx",
      "mobx-react-lite",
      "zod",
      "framer-motion",
      "fumadocs-ui",
      "lodash",
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors https://customermates.com https://test.customermates.com`,
          },
        ],
      },
    ];
  },
};

export default withMDX(withNextIntl(nextConfig));
