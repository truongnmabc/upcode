const fs = require("fs");
const appStudyUrl = require("./src/data/studyData.json");
const states = require("./src/data/statesName.json");
// const fetch = require("node-fetch");
const BUCKET = "new-data-web/";
const BUCKET2 = "new-data-web-test/";
exports.genDataFunc = async (appInfos = [], origin = "", web) => {
    // if (web === "development") {
    //     await genStudyData(appInfos, web);
    //     genXMLFunc(appInfos, origin);
    // }
};

/** gen ra file studyData.json */
const genStudyData = async (listAppInfos = []) => {
    let study = "[";
    let branchs = [
        {
            title: "Marine ASVAB Practice Test",
            url: "marine-asvab-practice-test",
            tag: "arithmetic-reasoning",
            isBranch: true,
        },
        {
            title: "Navy ASVAB Practice Test",
            url: "navy-asvab-practice-test",
            tag: "arithmetic-reasoning",
            isBranch: true,
        },
        {
            title: "Army ASVAB Practice Test",
            url: "army-asvab-practice-test",
            tag: "arithmetic-reasoning",
            isBranch: true,
        },
        {
            title: "Coast Guard ASVAB Practice Test",
            url: "asvab-coast-guard-practice-test",
            tag: "arithmetic-reasoning",
            isBranch: true,
        },
        {
            title: "Air Force ASVAB Practice Test",
            url: "air-force-asvab-practice-test",
            tag: "arithmetic-reasoning",
            isBranch: true,
        },
        {
            title: "National Guard ASVAB Practice Test",
            url: "national-guard-asvab-practice-test",
            tag: "arithmetic-reasoning",
            isBranch: true,
        },
    ];
    const fetchData = async (appInfo, _state) => {
        let a = {};
        let _2 = !!_state || true;
        console.log(appInfo.bucket, _state);
        await fetch(
            "https://storage.googleapis.com/micro-enigma-235001.appspot.com/" +
                (!!_2 ? BUCKET2 : BUCKET) +
                appInfo.bucket +
                (_state ? "/" + _state : "") +
                "/topics-and-tests.json?t=" +
                new Date().getTime()
        )
            .then((response) => response.json())
            .then((data) => {
                // Process the data here
                let topics = data?.topics ?? [];
                topics.sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });
                a = { ...data, topics };
            })
            .catch((error) => {
                // Handle any errors that occur during the fetch
                console.error("---------Error:", error);
            });

        return a;
    };
    for (let app of listAppInfos) {
        if (app.appId !== -1)
            try {
                if (app.hasState) {
                    let asn = app.appShortName;
                    if (asn === "dmv" || true) {
                        let _data = {
                            appId: app.appId,
                            topics: [],
                            fullTests: [],
                        };
                        let _states = states[asn];
                        for (let s of _states) {
                            let _s = s.tag;
                            if (_s === "iowa" || true) {
                                let appData = await fetchData(app, _s);
                                let _listTopics = appData?.topics ?? [];
                                let _tests = (appData?.fullTests ?? []).map((t) => _genStudyLink(asn, t.tag, true, _s));
                                let t = _listTopics.map((t) => ({
                                    title: t.name,
                                    url: _genStudyLink(asn, t.tag, false, _s),
                                    tag: t.tag,
                                }));
                                _data.topics.push(...t);
                                _data.fullTests.push(..._tests);
                            }
                        }
                        study += JSON.stringify(_data).replaceAll("/", "") + ",";
                    }
                } else {
                    let appData = await fetchData(app);
                    let _listTopics = appData?.topics ?? [];
                    let _tests = appData?.fullTests ?? [];
                    let t = _listTopics.map((t) => ({
                        title: t.name,
                        url: _genStudyLink(app.appShortName, t.tag, false),
                        tag: t.tag,
                    }));
                    if (app.appShortName === "asvab") t.push(...branchs);

                    study +=
                        JSON.stringify({
                            appId: app.appId,
                            topics: t,
                            fullTests: _tests.map((t) => _genStudyLink(app.appShortName, t.tag, true)),
                        }).replaceAll("/", "") + ",";
                }
            } catch (e) {
                console.log("error", e);
            }
    }
    study += "]";
    // console.log(study);
    fs.writeFile("./src/data/studyData.json", study, "utf8", (err) => {
        if (err) {
            console.error("Error writing ./src/data/studyData.json:", err);
        } else {
            console.log("./src/data/studyData.json has been written successfully.");
        }
    });
};
/**
 * gen ra file sitemap.xml
 * @param {*} appInfos
 * @param {*} origin: hiện tại chỉ đúng cho easyprep thôi vì wpDomain của nó là domain luôn, còn vd như asvab thì không phải
 */
const genXMLFunc = (appInfos = [], origin = "") => {
    const is_parent_app = origin?.includes("passemall") || origin?.includes("easy-prep");
    let urls = "";
    urls += genUrl(origin); // trang home

    if (is_parent_app) {
        urls += genUrl(origin + "/contact"); // trang contact
        urls += genUrl(origin + "/about"); // trang about
        urls += genUrl(origin + "/privacy"); // trang privacy
        // các app con
        for (let app of appInfos) {
            if (!app.appNameId.startsWith("http") && app.appId !== -1) {
                childAppUrl = _getLink(app);
                urls += genUrl(origin + childAppUrl);

                let studyUrl = appStudyUrl.find((a) => a.appId === app.appId);
                if (studyUrl) {
                    // các trang học của app con
                    let topics = studyUrl.topics;
                    let fullTests = studyUrl.fullTests;

                    topics.map((t) => {
                        urls += genUrl(origin + childAppUrl + "/" + t.url);
                    });
                    fullTests.map((t) => {
                        urls += genUrl(origin + childAppUrl + "/" + t);
                    });
                }
            }
        }
        // sau còn bổ sung trang state nữa
    } else {
        urls += genUrl(origin + "/contact"); // trang contact
        urls += genUrl(origin + "/about-us"); // trang about
        urls += genUrl(origin + "/privacy"); // trang privacy
        urls += genUrl(origin + "/faq"); // trang privacy

        for (let app of appInfos) {
            if (!app.appNameId.startsWith("http") && app.appId !== -1) {
                let studyUrl = appStudyUrl.find((a) => a.appId === app.appId);
                if (studyUrl) {
                    // các trang học của app con
                    let topics = studyUrl.topics;
                    let fullTests = studyUrl.fullTests;

                    topics.map((t) => {
                        urls += genUrl(origin + "/" + t.url);
                    });
                    fullTests.map((t) => {
                        urls += genUrl(origin + "/" + t);
                    });
                }
            }
        }
        // sau còn bổ sung trang state nữa
    }
    const xmlData = `
    <urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xsi:schemalocation="http://www.sitemaps.org/schemas/sitemap/0.9http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
        ${urls}
    </urlset>`;
    fs.writeFileSync("./public/sitemap.xml", xmlData);
    console.log("gen sitemap.xml done!");
};

const genUrl = (url) => {
    return "<url><loc>" + url + "/" + "</loc><changefreq>monthly</changefreq><priority>1.00</priority></url>";
};

const _getLink = (app, stateSlug = "") => {
    // tương tự trong utils
    let link = "";
    if (app.appNameId.startsWith("http")) {
        link = app.appNameId;
    } else {
        link = "/" + app.appNameId;
        if (stateSlug && app.hasState) {
            link += "/" + stateSlug;
        }
    }
    return link;
};

const _genStudyLink = (appShortName, tag, fullTest, _state = "") => {
    // trong đường dẫn có cả thành phần state
    let url = "";
    if (!fullTest) {
        url = tag;
        if (!tag?.includes(appShortName)) url = appShortName + "-" + url;
        if (!tag?.includes("practice")) url = url + "-" + "practice-test";
        if (_state) url = url.replace(appShortName, _state + "-" + appShortName);
        url = "/" + url;
    } else {
        if (!!tag) url = `/full-length-${_state ? _state + "-" + appShortName : appShortName}-${tag}-practice-test`;
        // trường hợp full-length test
        else url = `/full-length-${_state ? _state + "-" + appShortName : appShortName}-practice-test`; // trường hợp full-length test
    }
    // trường hợp branch
    return url;
};
