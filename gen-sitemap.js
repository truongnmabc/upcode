const fs = require("fs");
const appStudyUrl = require("./src/data/studyData.json");

exports.genDataFunc = (appInfos = [], origin = "") => {
    genXMLFunc(appInfos, origin);
    // genStudyData(appInfos);
};

const genStudyData = async (listAppInfos = []) => {
    for (let app of listAppInfos) {
        if (app.appId !== -1)
            try {
                if (app.hasState) {
                    if (app.appShortName === "cdl") {
                        for (let s of states) {
                            let _s = s.trim().toLowerCase().replaceAll(" ", "-");
                            if (_s === "alabama") {
                                let appData = await readFileAppFromGoogleStorage(app, _s);
                                let _listTopics = appData?.topics ?? [];
                                let _tests = appData?.fullTests ?? [];
                                let t = _listTopics.map((t) => ({
                                    title: t.name,
                                    url: _genStudyLink(app.appShortName, t.tag, false, _s),
                                    tag: t.tag,
                                }));
                                r +=
                                    JSON.stringify({
                                        appId: app.appId,
                                        topics: t,
                                        fullTests: _tests.map((t) => _genStudyLink(app.appShortName, t.tag, true, _s)),
                                    }).replaceAll("/", "") + ",";
                            }
                        }
                    }
                } else {
                    let appData = await readFileAppFromGoogleStorage(app);
                    let _listTopics = appData?.topics ?? [];
                    let _tests = appData?.fullTests ?? [];
                    let t = _listTopics.map((t) => ({
                        title: t.name,
                        url: _genStudyLink(app.appShortName, t.tag, false),
                        tag: t.tag,
                    }));
                    if (app.appShortName === "asvab") t.push(...branchs);

                    r +=
                        JSON.stringify({
                            appId: app.appId,
                            topics: t,
                            fullTests: _tests.map((t) => _genStudyLink(app.appShortName, t.tag, true)),
                        }).replaceAll("/", "") + ",";
                }
            } catch (e) {
                console.log("error", app.bucket);
            }
    }
    r += "]";
    console.log(r);
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
