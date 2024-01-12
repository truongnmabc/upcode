const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const withImages = require("next-images");
module.exports = () => {
    const plugins = [withImages];
    return plugins.reduce((acc, next) => next(acc), {
        /* normal nextjs config options here */
        sassOptions: {
            includePaths: [path.join(__dirname, "styles")],
        },
        images: {
            domains: ["storage.googleapis.com"],
        },
        webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
            if (!dev) {
                config.plugins.push(
                    new MiniCssExtractPlugin({
                        filename: "static/chunks/[name].[fullhash].css",
                        ignoreOrder: true,
                    })
                );
            }
            config.module.rules.push({
                test: /\.(sa|sc|c)ss$/,
                use: [
                    isServer
                        ? { loader: "file-loader" }
                        : dev
                        ? { loader: "style-loader" }
                        : { loader: MiniCssExtractPlugin.loader },
                    { loader: "css-loader" },
                    { loader: "sass-loader" },
                ],
            });
            return config;
        },
        typescript: {
            ignoreBuildErrors: true,
        },
        distDir: process.env.BUILD_DIR || ".next",
    });
};

// module.exports = () => {
//     const plugins = [
//       pluginOne(),
//       pluginTwo,
//       pluginThree()
//     ]
//     return plugins.reduce((acc, next) => next(acc), {
//       /* normal nextjs config options here */
//     })
//   }
