import { createTheme, ThemeProvider } from "@mui/material/styles";
import mediaQuery from "../declaration/mediaQuery";
import { Fragment, useEffect } from "react";
import isMobileFunctionsWithUserAgent from "@/utils/isMobileFunctionsWithUserAgent";
import getCountryAPI from "@/utils/getCountryAPI";
import "../styles/index.css";
export default function App({ Component, pageProps, deviceType }: any) {
    console.log(deviceType);
    const ssrMatchMedia = (query: any) => ({
        matches: mediaQuery.match(query, {
            // The estimated CSS width of the browser.
            width: deviceType === "mobile" ? "0px" : "1025px",
        }),
    });
    const theme = createTheme({
        components: {
            MuiUseMediaQuery: {
                defaultProps: {
                    ssrMatchMedia,
                },
            },
        },
    });
    useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector("#jss-server-side");
        if (jssStyles) {
            jssStyles.parentElement?.removeChild(jssStyles);
        }
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
            const { register } = require("../serviceWorker");
            register();
        }
        async function getCountryFC() {
            let countryLocalStorage = localStorage.getItem("country");
            if (!countryLocalStorage) {
                let getCountry = await getCountryAPI();
                if (getCountry?.country) {
                    localStorage.setItem("country", getCountry?.country);
                    if (getCountry.country == "VN") {
                        countryLocalStorage = getCountry?.country;
                        window.location.reload();
                    }
                }
            } else {
                // setProduction(pageProps?.urlOrigin, countryLocalStorage);
            }
            if (countryLocalStorage == "VN") {
                var element = document.getElementsByTagName("ins");
                for (let index = element.length - 1; index >= 0; index--) {
                    element[index].parentNode?.removeChild(element[index]);
                }
            }
        }
        getCountryFC();
    }, []);
    useEffect(() => {
        // if ("serviceWorker" in navigator) {
        //     window.addEventListener("load", function () {
        //         navigator.serviceWorker.register("/sw.js").then(
        //             function (registration) {},
        //             function (err) {}
        //         );
        //     });
        // }
    }, []);
    return (
        <Fragment>
            <ThemeProvider theme={theme}>
                {/* <DialogProvider> */}
                <Component {...pageProps} />
                {/* </DialogProvider> */}
            </ThemeProvider>
        </Fragment>
    );
}

App.getInitialProps = async (context: any) => {
    let deviceType;
    if (context.ctx.req) {
        let isMobile = isMobileFunctionsWithUserAgent(context.ctx.req.headers["user-agent"]);
        deviceType = isMobile ? "mobile" : "desktop";
    }
    return {
        deviceType,
    };
};
