import React from "react";
import AboutUsContainer from "../../container/about-us";
import { IAppInfo } from "../../models/AppInfo";
import convertToJSONObject from "@/utils/convertToJSONObject";
import { getAppInfo } from "@/utils/getAppInfo";
import StoreProvider from "@/redux/StoreProvider";
import SeoHeader from "@/components/seo/SeoHeader";
import Layout2 from "@/components/layout/layout-2/Layout2";

const AboutUsScreen = ({ appInfo }: { appInfo: IAppInfo }) => {
    return (
        <>
            <SeoHeader title={"About us – ABC Elearning"} description={""} keyword={""} />
            <AboutUsContainer appInfo={appInfo} />
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
