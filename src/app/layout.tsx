import { Poppins, Vampiro_One } from "next/font/google";
import "@/css/globals.css";
import { getAppInfoParentApp } from "@/utils/getAppInfos";
import replaceYear from "@/utils/replaceYear";
import Head from "next/head";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import StoreProvider from "@/app/StoreProvider";
import Link from "next/link";

const vampiro = Vampiro_One({
    weight: ["400"],
    style: "normal",
    preload: true,
    display: "swap",
    variable: "--font-vampiro",
    subsets: ["latin"],
});

const poppins = Poppins({
    weight: ["400", "500", "600", "700"],
    style: "normal",
    preload: true,
    display: "swap",
    variable: "--font-poppins",
    subsets: ["latin"],
});

export async function generateMetadata() {
    if (!process.env.IS_SINGLE_APP) {
        const { appInfo } = getAppInfoParentApp();

        if (appInfo) {
            const image = `/infos/${appInfo?.appShortName}/logo60.png`;
            return {
                metadataBase: new URL("https://asvab-prep.com/"),
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
    }
}

export default function ParentAppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { appInfo } = getAppInfoParentApp();

    return (
        <html
            lang="en"
            className={`${vampiro?.variable} ${poppins?.variable} font-sans`}
        >
            <Head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <Link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <body>
                <StoreProvider appInfo={appInfo}>{children}</StoreProvider>
                <GoogleAnalytics gaId={process.env.GA_ID} />
                <GoogleTagManager gtmId={process.env.GTM_ID} />
            </body>
        </html>
    );
}
