import { GetServerSideProps, NextPage } from "next";
import { IAppInfo } from "../../models/AppInfo";
import SeoHeader from "@/components/seo/SeoHeader";
import { getAppInfo } from "@/utils/getAppInfo";
import { ANDROID_STORE_PATH, IOS_STORE_PATH } from "@/config/config_web";
const QRCodeRedirect: NextPage = () => {
    return (
        <>
            <SeoHeader title={"About us – ABC Elearning"} description={""} keyword={""} />
            <></>
        </>
    );
};
export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const isServer = !!ctx.req;
    console.log("ctx.req", ctx.query);
    const appNameId: string | any = ctx.query.appNameId;
    let appInfo: IAppInfo | null = appNameId ? getAppInfo(appNameId) : getAppInfo();
    const userAgent = isServer ? ctx.req.headers["user-agent"] : navigator.userAgent;
    const isMobile = /(iPad|iPhone|Android|Mobile)/i.test(userAgent) || false;
    const isAndroid = /Android/.test(userAgent);
    if (isMobile && isAndroid) {
        ctx.res
            .writeHead(302, {
                Location: "/" + (appInfo?.appNameId ? appInfo?.appNameId + "/" : "") + ANDROID_STORE_PATH,
            })
            .end();
    } else {
        ctx.res
            .writeHead(302, {
                Location: "/" + (appInfo?.appNameId ? appInfo?.appNameId + "/" : "") + IOS_STORE_PATH,
            })
            .end();
    }
    return {
        props: {},
    };
};
export default QRCodeRedirect;
