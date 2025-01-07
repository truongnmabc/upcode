import type { NextConfig } from "next";
import { hostname } from "os";
const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: false,
});
const withPlugins = require("next-compose-plugins");

const nextConfig: NextConfig = withPlugins([[withBundleAnalyzer()]], {
    /* config options here */

    // Bỏ qua lỗi khi build

    reactStrictMode: false,
    eslint: {
        ignoreDuringBuilds: false,
    },
    typescript: {
        ignoreBuildErrors: false,
    },

    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
            },
            {
                protocol: "https",
                hostname: "storage.googleapis.com",
            },
            {
                protocol: "https",
                hostname: "cdl-prep.com",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
        ],
    },
    // sassOptions: {
    //     implementation: "sass-embedded",
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
        optimizePackageImports: ["@mui/icons-material", "@mui/material"],
    },
    webpack: (config: any) => {
        // config.module.rules.push({
        //     test: /\.(sa|sc|c)ss$/,
        //     use: [
        //         // Creates `style` nodes from JS strings
        //         "style-loader",
        //         // Translates CSS into CommonJS
        //         {
        //             loader: "css-loader",
        //             options: {
        //                 importLoaders: 1,
        //             },
        //         },
        //         // Compiles tailwinds to CSS
        //         "postcss-loader",
        //         // Compiles Sass to CSS
        //         "sass-loader",
        //     ],
        // });
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

    // async rewrites() {
    //     return [
    //         {
    //             source: "/:appShortName",
    //             destination: "/",
    //         },
    //     ];
    // },
});

export default nextConfig;
