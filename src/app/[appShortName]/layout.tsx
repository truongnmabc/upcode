import StoreProvider from "@/app/StoreProvider";
import axiosInstance from "@/common/config/axios";
import { API_PATH } from "@/common/constants/api.constants";
import AppThemeProvider from "@/common/theme/themeProvider";
import AppLayout from "@/components/appLayout";
import InitData from "@/container/initData";
import type { Metadata } from "next";
import { Poppins, Vampiro_One } from "next/font/google";
import NotFound from "../not-found";
import TestModal from "@/tests";
import { Fragment } from "react";
import "@/css/globals.css";

const vampiro = Vampiro_One({
  weight: ["400"],
  style: "normal",
  preload: true,
  display: "swap",
  variable: "--font-vampiro",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["400", "500", "600"],
  style: "normal",
  preload: true,
  display: "swap",
  variable: "--font-poppins",
  subsets: ["latin"],
});
type Props = {
  params: { appShortName: string };
};

export async function fetchAppData(appShortName: string, fetchAll = false) {
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

  const image = `/images/logo/logo60.png`;

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

  if (!appInfo) {
    return <NotFound />;
  }

  return (
    <Fragment>
      <main className={`${vampiro?.variable} ${poppins?.variable} font-sans`}>
        <StoreProvider appInfo={appInfo} appConfig={appConfig}>
          <AppThemeProvider>
            <AppLayout>{children}</AppLayout>
            <InitData appInfo={appInfo} />
            {process.env.NODE_ENV === "development" && <TestModal />}
          </AppThemeProvider>
        </StoreProvider>
      </main>
    </Fragment>
  );
}
