import { isWebPASSEMALL } from "@/config/config_web";
import Document, { Head, Html, Main, NextScript } from "next/document";
import React from "react";
import { ServerStyleSheets } from "@mui/styles";
import { GA4_ID, TAG_MANAGER_ID } from "@/config_app";
class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <meta charSet="UTF-8" />
                </Head>
                <body id="canvas">
                    {isWebPASSEMALL() && (
                        <script
                            type="text/javascript"
                            src="https://s.skimresources.com/js/221681X1703163.skimlinks.js"
                        ></script>
                    )}

                    <noscript>
                        {TAG_MANAGER_ID?.length ? (
                            <iframe
                                src={`https://www.googletagmanager.com/ns.html?id=${TAG_MANAGER_ID}`}
                                height="0"
                                width="0"
                                style={{
                                    display: "none",
                                    visibility: "hidden",
                                }}
                            />
                        ) : null}
                    </noscript>

                    <script rel="preconnect" async src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} />
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `window.dataLayer = window.dataLayer || [];
                                      function gtag(){dataLayer.push(arguments);}
                                      gtag('js', new Date());
                                      gtag('config', "${GA4_ID}");`,
                        }}
                    />
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
MyDocument.getInitialProps = async (ctx) => {
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
        });

    const initialProps = await Document.getInitialProps(ctx);

    return {
        ...initialProps,
        styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
    };
};
export default MyDocument;
