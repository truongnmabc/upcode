import Head from "next/head";
import { useRouter } from "next/router";
import { APP_SHORT_NAME, GOOGLE_SITE_VERIFICATION } from "../../config_app";
import { getDomainName } from "../../utils";

const SeoHeader = ({
    children,
    title,
    description,
    keyword,
}: {
    children?: any;
    title: string;
    description: string;
    keyword: string;
}) => {
    const router = useRouter();
    let image = `/info/images/${APP_SHORT_NAME}/logo60.png`;
    let urlCanonical = getDomainName(router);

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
            {/* <link rel="shortcut icon" href="/favicon.ico" /> */}
            <link rel="apple-touch-icon" href={image}></link>
            <link rel="profile" href="https://gmpg.org/xfn/11" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="preconnect" href="https://www.googletagmanager.com" />
            <meta name="google-site-verification" content={GOOGLE_SITE_VERIFICATION} />
            {children}
        </Head>
    );
};
export default SeoHeader;
