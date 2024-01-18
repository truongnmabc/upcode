import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Fragment, useEffect } from "react";
import isMobileFunctionsWithUserAgent from "@/utils/isMobileFunctionsWithUserAgent";
import getCountryAPI from "@/utils/getCountryAPI";
// import { Provider } from "react-redux";
import mediaQuery from "css-mediaquery";
import "../styles/index.css";
import { wrapper } from "@/redux/store";
function App(props: any) {
    // function App({ Component, ...rest }: any) {
    // const { store, props } = wrapper.useWrappedStore(rest);
    const { Component, pageProps, deviceType } = props;
    // const { pageProps, deviceType } = props;

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

        async function getCountryFC() {
            let countryLocalStorage = localStorage.getItem("country");
            if (!countryLocalStorage) {
                let getCountry: any = await getCountryAPI();
                if (getCountry?.country) {
                    localStorage.setItem("country", getCountry?.country);
                    if (getCountry.country == "VN") {
                        countryLocalStorage = getCountry?.country;
                        window.location.reload();
                    }
                }
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

    return (
        // <Provider store={store}>
        <Fragment>
            <ThemeProvider theme={theme}>
                <Component {...pageProps} />
            </ThemeProvider>
        </Fragment>
        // </Provider>
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
export default wrapper.withRedux(App);
