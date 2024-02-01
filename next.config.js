const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const withImages = require("next-images");
const appInfos = require("./src/data/appInfos.json");
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
        async redirects() {
            let config_2 = getLinkToStore();
            return config_2;
        },
    });
};
const getLinkToStore = () => {
    let arr = [];
    appInfos.forEach((appInfo) => {
        if (!appInfo.appNameId.includes("https:")) {
            if (appInfo.linkAndroid) {
                arr.push({
                    source: "/" + (appInfo?.appNameId ? appInfo?.appNameId + "/" : "") + `app-android`, //ANDROID_STORE_PATH
                    destination: appInfo.linkAndroid,
                    permanent: false,
                });
            }
            if (appInfo.linkIos) {
                arr.push({
                    source: "/" + (appInfo?.appNameId ? appInfo?.appNameId + "/" : "") + `app-ios`, //IOS_STORE_PATH
                    destination: appInfo.linkIos,
                    permanent: false,
                });
            }
        }
    });
    return arr;
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
