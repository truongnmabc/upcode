import type { NextConfig } from "next";
// import withBundleAnalyzer from "@next/bundle-analyzer";
// import withPlugins from "next-compose-plugins";

const nextConfig: NextConfig = {
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
    webpack: (config: unknown) => {
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

    async rewrites() {
        const pageStatic = ["about-us", "contact", "getPro", "billing"];
        const pageDynamic1 = [
            "review",
            "result_test",
            "finish",
            "final_test",
            "diagnostic_test",
            "custom_test",
        ];
        const pageDynamic = ["study"];

        const result = [
            {
                source: "/",
                destination: process.env.IS_SINGLE_APP
                    ? "/parent"
                    : `/${process.env.NEXT_PUBLIC_APP_SHORT_NAME}`,
            },
        ];
        pageStatic.forEach((e) => {
            result.push({
                source: "/" + e,
                destination: `/${process.env.NEXT_PUBLIC_APP_SHORT_NAME}/` + e,
            });
        });
        pageDynamic1.forEach((e) => {
            result.push({
                source: "/" + e,
                destination:
                    `/${process.env.NEXT_PUBLIC_APP_SHORT_NAME}/all/` + e,
            });
        });
        pageDynamic.forEach((e) => {
            result.push({
                source: "/" + e + "/:path",
                destination:
                    `/${process.env.NEXT_PUBLIC_APP_SHORT_NAME}/all/` +
                    e +
                    "/:path",
            });
        });

        return result;
    },
};

export default nextConfig;
