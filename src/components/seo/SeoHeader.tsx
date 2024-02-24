import Head from "next/head";
import { useRouter } from "next/router";
import { APP_SHORT_NAME, GOOGLE_SITE_VERIFICATION } from "../../config_app";
import { getDomainName } from "../../utils";
import replaceYear from "@/utils/replaceYear";

const SeoHeader = ({
    children,
    title,
    description,
    keyword,
    ads,
}: {
    children?: any;
    title: string;
    description: string;
    keyword: string;
    ads?: boolean;
}) => {
    const router = useRouter();
    let image = `/info/images/${APP_SHORT_NAME}/logo60.png`;
    let urlCanonical = getDomainName(router);
    title = replaceYear(title);
    description = replaceYear(description);
    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keyword} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#000000" />
            <meta property="og:type" content="website" />
            {urlCanonical?.length && <link rel="canonical" href={urlCanonical}></link>}
            <link rel="icon" href={image} />
            <link rel="preconnect" href="https://www.googletagmanager.com" />
            <link rel="profile" href="https://gmpg.org/xfn/11" />
            <meta name="google-site-verification" content={GOOGLE_SITE_VERIFICATION} />
            {ads ? (
                <script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2131195938375129"
                    crossOrigin="anonymous"
                ></script>
            ) : (
                <></>
            )}
            {children}
        </Head>
    );
};
export default SeoHeader;
