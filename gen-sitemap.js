const fs = require("fs");
const appStudyUrl = require("./src/data/studyData.json");

/**
 * gen ra file sitemap.xml
 * @param {*} appInfos
 * @param {*} origin: hiện tại chỉ đúng cho easyprep thôi vì wpDomain của nó là domain luôn, còn vd như asvab thì không phải
 */
exports.genXMLFunc = (appInfos = "", origin = "") => {
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
