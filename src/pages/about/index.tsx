import SeoHeader from "@/components/seo/SeoHeader";
import { isParentApp } from "@/config/config_web";
import AboutLayout from "@/container/about-container/AboutLayout";
import { AppInfo, IAppInfo } from "@/models/AppInfo";
import convertToJSONObject from "@/utils/convertToJSONObject";
import { getAppInfo, readAllAppInfos } from "@/utils/getAppInfo";
import { GetStaticProps } from "next";

export default function Home({ appInfo, listAppInfo }: { appInfo: IAppInfo; listAppInfo: IAppInfo[] }) {
    return (
        <>
            <SeoHeader title={""} description={""} keyword={""} />
            <AboutLayout appInfo={appInfo} listAppInfos={listAppInfo} />
        </>
    );
}

export const getStaticProps: GetStaticProps = async (context) => {
    let appInfo: IAppInfo | null = getAppInfo();
    let listAppInfo = [];
    let _isParentApp = isParentApp();
    if (_isParentApp) {
        listAppInfo = readAllAppInfos();
        listAppInfo = listAppInfo.filter((w: any) => w.appId).map((w: any) => new AppInfo(w));
    }
    return convertToJSONObject({
        props: {
            appInfo,
            listAppInfo,
        },
    });
};
