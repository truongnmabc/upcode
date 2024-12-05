import StoreProvider from "@/app/StoreProvider";
import axiosInstance from "@/common/config/axios";
import { API_PATH } from "@/common/constants/api.constants";
import AppThemeProvider from "@/common/theme/themeProvider";
import AppLayout from "@/components/appLayout";
import InitData from "@/container/initData";
import "@/css/globals.css";
import type { Metadata } from "next";
import { Poppins, Vampiro_One } from "next/font/google";
import Head from "next/head";
import { Fragment } from "react";
import NotFound from "../not-found";
type Props = {
  params: { appShortName: string };
};

const vampiro = Vampiro_One({
  weight: ["400"],
  style: "normal",
  preload: true,
  display: "swap",
  variable: "--font-vampiro",
});

const poppins = Poppins({
  weight: ["400", "500", "600"],
  style: "normal",
  preload: true,
  display: "swap",
  variable: "--font-poppins",
});

export async function fetchAppData(appShortName: string, fetchAll = false) {
  const appInfo = await axiosInstance.get(
    `${API_PATH.APP_INFO}/${appShortName}`
  );
  let appConfig;
  if (appInfo.data.code === 404) {
    return {
      appInfo: null,
      appConfig,
    };
  }
  if (fetchAll && appInfo.data) {
    const res = await axiosInstance.get(
      `${API_PATH.APP_CONFIG}/${appInfo.data.data?.appShortName}`
    );
    appConfig = res.data?.data;
  }

  return { appInfo: appInfo.data.data, appConfig };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await params;
  const { appInfo } = await fetchAppData(data.appShortName);
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
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ appShortName: string }>;
}>) {
  const appShortName = (await params).appShortName || process.env.APP_ID;
  const { appInfo, appConfig } = await fetchAppData(appShortName, true);
  if (!appInfo) {
    return <NotFound />;
  }

  return (
    <Fragment>
      <Head>
        <meta charSet="UTF-8" />
        {/* <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        /> */}

        {/* <Script
          rel="preconnect"
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${appConfig.GA4_ID}`}
        /> */}
        {/* <Script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', "${appConfig.GA4_ID}");`,
          }}
        />
        <Script async defer src={`https://accounts.google.com/gsi/client`} /> */}

        {/* <Script
          type="text/javascript"
          id="MathJax-script"
          async
          src="https://cdn.jsdelivr.net/npm/mathjax@3.0.0/es5/tex-chtml.js"
        ></Script> */}
      </Head>
      <main className={`${vampiro.variable} ${poppins.variable} font-sans`}>
        <StoreProvider appInfo={appInfo} appConfig={appConfig}>
          <AppThemeProvider>
            <AppLayout>{children}</AppLayout>
            <InitData appInfo={appInfo} />
          </AppThemeProvider>
        </StoreProvider>

        {/* <GoogleAnalytics gaId={appConfig.GA4_ID} /> */}
        {/* <GoogleTagManager gtmId={appConfig.GA4_ID} /> */}
      </main>
    </Fragment>
  );
}
