import type { NextConfig } from "next";
// const withBundleAnalyzer = require("@next/bundle-analyzer")({
//   enabled: true,
// });
// const withPlugins = require("next-compose-plugins");

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "http",
  //       hostname: "localhost",
  //     },
  //     {
  //       protocol: "https",
  //       hostname: "localhost",
  //     },
  //   ],
  // },
  pageExtensions: ["mdx", "md", "jsx", "js", "tsx", "ts"],
  experimental: {
    turbo: {
      rules: {
        "*.scss": {
          loaders: ["sass-loader"],
          as: "*.css",
        },
      },
    },
  },
  webpack: (config: any) => {
    config.module.rules.push({
      test: /\.(sa|sc|c)ss$/,
      use: [
        // Creates `style` nodes from JS strings
        "style-loader",
        // Translates CSS into CommonJS
        "css-loader",
        // Compiles Sass to CSS
        "sass-loader",
      ],
    });
    return config;
  },
  // async redirects() {
  //   return [
  //     {
  //       source: "/",
  //       destination: "/4878338973761536",
  //       permanent: true,
  //     },
  //   ];
  // },
};

export default nextConfig;
