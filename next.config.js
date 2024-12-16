const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const withImages = require("next-images");
const appInfos = require("./src/data/appInfos.json");
const states = require("./src/data/statesName.json");
const studyData = require("./src/data/studyData.json");
const cdlJSON = require("./src/data/cdlLinkLandingPage.json");
const is_parent_app =
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.includes("passemall") ||
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.includes("easy-prep");
const isWebCDL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.includes("cdl-prep");
module.exports = () => {
    const plugins = [withImages];
    return plugins.reduce((acc, next) => next(acc), {
        /* normal nextjs config options here */
        sassOptions: {
            includePaths: [path.join(__dirname, "styles")],
        },
        images: {
            remotePatterns: [
                {
                  protocol: 'https',
                  hostname: 'storage.googleapis.com',
                 
                },
                {
                    protocol: 'https',
                    hostname: 'cdl-prep.com',
                   
                  },
              ],
            // domains: ["storage.googleapis.com","cdl-prep.com/"],
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
            // định tuyến trong project (điều hướng url nào đi vào file giao diện nào)
            let paths = [];
            if (is_parent_app) {
                appInfos.forEach((app) => {
                    if (app.appId !== -1) {
                        let path = "";
                        if (app.appNameId && !app.appNameId.startsWith("http")) {
                            path = "/" + app.appNameId;
                            let _ = { source: path, destination: "/stateAndChildrenApp" + path }; // điều hướng các trang của app con sang file theo đường dẫn này
                            paths.push(_);

                            if (app.hasState) {
                                // điều hướng các trang state của app con sang file theo đường dẫn này
                                states[app.appShortName].forEach((state) => {
                                    let __ = {
                                        source: _getLink(app, state.tag),
                                        destination: "/stateAndChildrenApp" + _getLink(app, state.tag),
                                    };
                                    paths.push(__);
                                });
                            }

                            let study = studyData.find((s) => s.appId === app.appId); // cần đảm bảo dữ liệu trong này đúng (dữ liệu được sinh ra từ genstudyDataJSON)
                            if (study) {
                                let { topics, fullTests } = study;
                                if (app.hasState) {
                                    // các app có state
                                    topics.forEach((t) => {
                                        let p = _getLink(app) + "/" + t.url;
                                        let _ = { source: p, destination: "/study" + p };
                                        paths.push(_);
                                    });

                                    fullTests.forEach((t) => {
                                        let p = _getLink(app) + "/" + t;
                                        let _ = { source: p, destination: "/study" + p };
                                        paths.push(_);
                                    });
                                } else {
                                    // các app k có state
                                    topics.forEach((t) => {
                                        let p = _getLink(app) + "/" + t.url;
                                        let _ = { source: p, destination: "/study" + p };
                                        paths.push(_);
                                    });

                                    fullTests.forEach((t) => {
                                        let p = _getLink(app) + "/" + t;
                                        let _ = { source: p, destination: "/study" + p };
                                        paths.push(_);
                                    });
                                }
                            }
                        }
                    }
                });
            } else {
                // là web con được build riêng thì trường hợp có state sẽ trỏ trang state về file này
                appInfos.forEach((app) => {
                    if (app.hasState) {
                        // điều hướng các trang state sang file theo đường dẫn này
                        states[app.appShortName].forEach((state) => {
                            let path = "/" + state.tag;
                            let __ = {
                                source: path,
                                destination: "/stateAndChildrenApp" + path,
                            };
                            paths.push(__);
                        });

                        let study = studyData.find((s) => s.appId === app.appId); // cần đảm bảo dữ liệu trong này đúng (dữ liệu được sinh ra từ genstudyDataJSON)
                        if (study) {
                            let { topics, fullTests } = study;
                            // các app có state
                            topics.forEach((t) => {
                                let p = "/" + t.url;
                                let _ = { source: p, destination: "/study" + p };
                                paths.push(_);
                            });

                            fullTests.forEach((t) => {
                                let p = "/" + t;
                                let _ = { source: p, destination: "/study" + p };
                                paths.push(_);
                            });
                        }
                    } else {

                        
                        let study = studyData.find((s) => s.appId === app.appId); // cần đảm bảo dữ liệu trong này đúng (dữ liệu được sinh ra từ genstudyDataJSON)
                        if(study) {
                            let { topics, fullTests } = study;

                            topics.forEach((t) => {
                                let p = "/" + t.url;
                                let _ = { source: p, destination: "/study" + p };
                                paths.push(_);
                            });
    
                            fullTests.forEach((t) => {
                                let p = "/" + t;
                                let _ = { source: p, destination: "/study" + p };
                                paths.push(_);
                            });
                        }
                        
                    }
                });
            }
            return paths;
        },
        async redirects() {
            let config_2 = getLinkToStore();
            let cdlUrlLandingPage = [];
            if (isWebCDL) {
                states.cdl.map((s) => {
                    let state = "/" + s.tag;
                    cdlJSON.forEach((topic) => {
                        Object.keys(topic).forEach((topicName) => {
                            const keywords = topic[topicName];
                            keywords.forEach((keyword) => {
                                const keyReplace = keyword.replaceAll(/ /g, "-");
                                const url = state + "-" + keyReplace;
                                cdlUrlLandingPage.push({
                                    source: url,
                                    destination: state,
                                    permanent: true,
                                });
                                cdlUrlLandingPage.push({
                                    source: state + url,
                                    destination: state,
                                    permanent: true,
                                });
                            });
                        });
                    });
                });
            }
            return [
                ...config_2,
                {
                    source: "/about",
                    destination: "/about-us",
                    permanent: true,
                },
                ...cdlUrlLandingPage,
            ];
        },
    });
};
const getLinkToStore = () => {
    let arr = [];
    appInfos.forEach((appInfo) => {
        if (!appInfo.appNameId.includes("https:")) {
            if (appInfo.linkAndroid) {
                arr.push({
                    source: "/" + `app-android`, //ANDROID_STORE_PATH
                    destination: appInfo.linkAndroid,
                    permanent: false,
                });
            }
            if (appInfo.linkIos) {
                arr.push({
                    source: "/" + `app-ios`, //IOS_STORE_PATH
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

/** link được return ra có / ở đầu */
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
