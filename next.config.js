const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const withImages = require("next-images");
const appInfos = require("./src/data/appInfos.json");
const states = require("./src/data/statesName.json");
const is_parent_app =
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.includes("passemall") ||
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.includes("easy-prep");
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

        async rewrites() {
            let paths = [];
            if (is_parent_app) {
                appInfos.forEach((app) => {
                    let path = "";
                    if (app.appNameId && !app.appNameId.startsWith("http")) {
                        path = "/" + app.appNameId;
                        let _ = { source: path, destination: "/childrenApp" + path }; // điều hướng các trang của app con sang file theo đường dẫn này
                        paths.push(_);

                        if (app.hasState) {
                            // điều hướng các trang state của app con sang file theo đường dẫn này
                            states.forEach((state) => {
                                let __ = {
                                    source: path,
                                    destination: "/childrenApp" + _getLink(app, state.toLowerCase().trim().replace(" ", "-")),
                                };
                                paths.push(__);
                            });
                        }
                    }
                });
            }

            return paths;
        },
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

const _getLink = (app, stateSlug = "") => {
    let link = "/";
    if (app.appNameId.startsWith("http")) {
    } else {
        link = "/" + app.appNameId;
        if (stateSlug && app.hasState) {
            link += "/" + stateSlug;
        }
    }
    return link;
};
