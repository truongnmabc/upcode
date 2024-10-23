// import absoluteUrl from "next-absolute-url";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
// import Layout from "../../components/Layout";
import Config from "../../config";
import { APP_SHORT_NAME } from "../../config_app";
// import { isWebASVAB } from "../../config_web";
import FaqScreen from "../../container/faq";
import { IAppInfo } from "../../models/AppInfo";
// import { IFooterContent } from "../../models/FooterContent";
// import { getHotQuestionssAction } from "../../redux/actions/faq-qa.action";
// import { getListSubmenuApi } from "../../services/home.service";

// import { ITopic } from "../../models/Topic";
// import getRawTopicsData from "../../utils/v4/getRawTopicsData";
import convertToJSONObject from "@/utils/convertToJSONObject";
import SEO from "@/components/seo/SEO";
import { getAppInfo } from "@/utils/getAppInfo";
const FAQPage = ({
    appInfo,
}: // footerContent,
// listSubMenu,
{
    appInfo: IAppInfo;
    // footerContent: IFooterContent[];
    // listSubMenu: ITopic[];
}) => {
    // const dispatch = useDispatch();
    // const appNameId = APP_SHORT_NAME;
    // let webData = {
    //     appId: appInfo.appId,
    //     type: "faq",
    // };
    // useEffect(() => {
    //     dispatch(getHotQuestionssAction([appNameId, Config.COMMON_QUESTION]));
    // }, []);
    return (
        <div>
            <SEO appInfo={appInfo}></SEO>
            <FaqScreen appInfo={appInfo} />
        </div>
    );
};

export async function getServerSideProps(context) {
    let appInfo = getAppInfo();
    // let footerContent = readFooterMenusData();
    // let listSubMenu = getRawTopicsData(appInfo.appShortName);
    return convertToJSONObject({
        props: {
            appInfo,
            // urlOrigin: origin,
            // footerContent,
            // listSubMenu,
        },
    });
}
export default FAQPage;
