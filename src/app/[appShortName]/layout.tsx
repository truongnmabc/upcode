import StoreProvider from "@/app/StoreProvider";
import axiosInstance from "@/common/config/axios";
import { API_PATH } from "@/common/constants/api.constants";
import AppThemeProvider from "@/common/theme/themeProvider";
import AppLayout from "@/components/appLayout";
import InitData from "@/components/initData";
import "@/css/globals.css";
import { IAppInfo } from "@/models/app/appInfo";
import { IAppConfigData } from "@/redux/features/appConfig";
import TestModal from "@/tests";
import type { Metadata } from "next";
import { Fragment } from "react";
import NotFound from "../not-found";
import Head from "next/head";
import EventListener from "@/components/event";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

type Props = {
    params: { appShortName: string };
};

export async function fetchAppData(
    appShortName: string,
    fetchAll = false
): Promise<{
    appInfo?: IAppInfo | null;
    appConfig?: IAppConfigData;
}> {
    try {
        const { data: appInfo } = await axiosInstance.get(
            `${API_PATH.APP_INFO}/${appShortName}`
        );

        if (!appInfo || appInfo.code === 404) {
            return { appInfo: null, appConfig: undefined };
        }

        let appConfig;
        if (fetchAll) {
            const { data: configData } = await axiosInstance.get(
                `${API_PATH.APP_CONFIG}/${appInfo.data?.appShortName}`
            );
            appConfig = configData?.data;
        }

        return { appInfo: appInfo.data, appConfig };
    } catch (error) {
        console.error("Failed to fetch app data:", error);
        return { appInfo: null, appConfig: undefined };
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { appShortName } = await params;

    if (!appShortName) {
        return {
            title: "Not Found",
            description: "Application not found",
        };
    }

    const { appInfo } = await fetchAppData(appShortName);

    if (!appInfo) {
        return {
            title: "Not Found",
            description: "Application not found",
        };
    }

    const image = `/infos/${appInfo.appShortName}/logo60.png`;

    return {
        title: appInfo.title,
        description: appInfo.descriptionSEO,
        keywords: appInfo.keywordSEO,
        icons: image,
        openGraph: {
            description: appInfo.descriptionSEO,
            title: appInfo.title,
            images: image,
        },
    };
}

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { appShortName: string };
}) {
    const { appShortName } = await params;
    const { appInfo, appConfig } = await fetchAppData(appShortName, true);
    console.log("🚀 ~ appConfig:", appConfig);

    if (!appInfo || !appConfig) {
        return <NotFound />;
    }
    return (
        <Fragment>
            <Head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
            </Head>
            <main>
                <StoreProvider appInfo={appInfo} appConfig={appConfig}>
                    <AppThemeProvider>
                        <AppLayout>{children}</AppLayout>
                        <InitData appInfo={appInfo} />
                        <EventListener />
                        {process.env.NODE_ENV === "development" && (
                            <TestModal />
                        )}
                    </AppThemeProvider>
                </StoreProvider>

                <GoogleAnalytics gaId={process.env.GA_ID} />
                <GoogleTagManager gtmId={process.env.GTM_ID} />
            </main>
        </Fragment>
    );
}
