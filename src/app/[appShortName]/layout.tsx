import axiosInstance from "@/common/config/axios";
import { API_PATH } from "@/common/constants/api.constants";
import AppThemeProvider from "@/components/theme/themeProvider";
import AppLayout from "@/components/appLayout";
import EventListener from "@/components/event";
import { IAppInfo } from "@/models/app/appInfo";
import { IAppConfigData } from "@/redux/features/appConfig";
import InitDataStore from "@/redux/initDataStore";
import replaceYear from "@/utils/replaceYear";
import type { Metadata } from "next";
import NotFound from "../not-found";
import InitData from "@/components/initData";

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
        title: replaceYear(appInfo.title),
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

    if (!appInfo || !appConfig) {
        return <NotFound />;
    }
    return (
        <main>
            <InitDataStore appConfig={appConfig} appInfo={appInfo} />
            <InitData appInfo={appInfo} />
            <AppThemeProvider>
                <AppLayout>{children}</AppLayout>
                <EventListener />
            </AppThemeProvider>
        </main>
    );
}
