import { Poppins, Vampiro_One } from "next/font/google";
import "@/css/globals.css";
import { getAppInfoParentApp } from "@/utils/getAppInfos";
import replaceYear from "@/utils/replaceYear";

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
    return (
        <html
            lang="en"
            className={`${vampiro?.variable} ${poppins?.variable} font-sans`}
        >
            <body>{children}</body>
        </html>
    );
}
