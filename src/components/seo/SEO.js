import { useRouter } from "next/router";
import { APP_SHORT_NAME, GOOGLE_SITE_VERIFICATION } from "../../config_app";
import { capitalizeFirstWord, getDomainName } from "../../utils";
import Head from "next/head";
import replaceYear from "@/utils/replaceYear";
import { CheckAndAddAds } from "../ads/ads";

const SEO = ({
    appInfo,
    title = "",
    descriptionSEO = "",
    addMathJax = false,
    keywordsSeo = "",
    children = null,
    ads = true,
}) => {
    const router = useRouter();
    let description;
    let keywords =
        "Abc e-learning, abc elearning, study online,practice test, practice question,exam prepare,asvab,teas exam,cdl test,cdl practice,cissp exam,cissp practice,accuplacer,comptia practice test,comptia A+,compTIA Network,comptia security,dmv,dmv practice test,driving theory,driving theory UK,G1 test,GED,hesi,hesi A2,motorcycle permit,pmp,pmp exam,ptcb,ptce,real estate exam,practice app,practice test onl,free practice test,free practice questions,free practice app";
    let logoName = "logo60.png";

    let image = `/info/images/${APP_SHORT_NAME}/${logoName}`;
    let imageShare = `/info/images/${APP_SHORT_NAME}/${logoName}`;
    if (appInfo) {
        if (!title?.length) {
            if (appInfo.title) {
                title = appInfo.title;
            }
        }
        if (!title?.length) {
            title = "ABC Elearning - Free Practice Questions and Exam Prep";
        }
        // appInfo.description && (description = appInfo.description.replace(/(<([^>]+)>)/gi, "").replace(/&nbsp;/g, " "));

        if (descriptionSEO === undefined) {
            if (appInfo.descriptionSEO) {
                description = appInfo.descriptionSEO;
            } else {
                description =
                    "With thousands of our FREE practice questions, we are here to help you achieve your gate of success with our test prep solutions.";
            }
        } else {
            description = descriptionSEO;
        }
    }

    if (keywordsSeo) {
        keywords = keywordsSeo;
    }

    title = replaceYear(title);
    title = capitalizeFirstWord(title);
    let appName = appInfo?.appName ?? APP_SHORT_NAME;
    appName = capitalizeFirstWord(appName);
    title = title?.replaceAll(appName, appName?.toUpperCase() ?? "") ?? "";
    let urlCanonical = getDomainName(router);

    return (
        <>
            <Head>
                {!!(imageShare || image) ? <meta property="og:image" content={imageShare || image} /> : null}
                {addMathJax && (
                    <script type="text/javascript" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
                )}
                {children}
                {urlCanonical?.length && <link rel="canonical" href={urlCanonical}></link>}
                <link rel="icon" href={image} />
                {/* <link rel="manifest" href={router.basePath + "/manifest.json"} /> */}
                <link rel="preconnect" href="https://micro-enigma-235001.appspot.com" />
                <link rel="preconnect" href="https://www.googletagmanager.com" />
                <meta name="description" content={description} />
                <meta name="google-site-verification" content={GOOGLE_SITE_VERIFICATION} />
                <meta name="keywords" content={keywords} />
                <meta name="theme-color" content="#000000" />
                <meta name="title" content={title} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta property="og:description" content={description} />
                <meta property="og:title" content={title} />
                <meta property="og:type" content="website" />
                <title>{title}</title>
                {ads ? (
                    <script
                        async
                        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
                        crossOrigin="anonymous"
                    ></script>
                ) : (
                    <></>
                )}
            </Head>
            {ads && <CheckAndAddAds />}
        </>
    );
};

export default SEO;
