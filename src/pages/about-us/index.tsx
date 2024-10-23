import React from "react";
import AboutUsContainer from "../../container/about-us";
import { IAppInfo } from "../../models/AppInfo";
import convertToJSONObject from "@/utils/convertToJSONObject";
import { getAppInfo } from "@/utils/getAppInfo";
import StoreProvider from "@/redux/StoreProvider";
import SeoHeader from "@/components/seo/SeoHeader";

const AboutUsScreen = ({ appInfo }: { appInfo: IAppInfo }) => {
    return (
        <>
            <SeoHeader title={"About us – ABC Elearning"} description={""} keyword={""} />
            <>
                <div id="page" className="site desktop">
                    <StoreProvider webData={{ appId: appInfo.appId, type: "about-us" }} appInfo={appInfo} />
                    <AboutUsContainer appInfo={appInfo} />
                </div>
            </>
        </>
    );
};
export const getStaticProps = async (context) => {
    let appInfo = getAppInfo();

    return convertToJSONObject({
        props: {
            appInfo,
        },
    });
};
export default AboutUsScreen;
