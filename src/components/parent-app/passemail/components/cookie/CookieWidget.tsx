import MyContainer from "@/components/container/myContainer";
import "./CookieWidget.scss";
import Link from "next/link";
const CookieWidget = ({
    handleOnClickClose,
}: {
    handleOnClickClose: () => void;
}) => {
    return (
        <>
            <div className="cookie-widget-v0">
                <div id="spacer" />

                <div className="popup-cookie-v0">
                    <MyContainer>
                        <p>Privacy and Cookies</p>
                        <p>
                            This site uses cookies to offer you a better
                            browsing experience. Find out more on how we use
                            cookies.
                        </p>
                        <div className="container-cookie-v0">
                            <div>
                                <Link href="/privacy">
                                    <a>
                                        <button id="learn-more">
                                            Learn More
                                        </button>
                                    </a>
                                </Link>
                            </div>
                            <div>
                                <button
                                    id="accept"
                                    onClick={() => handleOnClickClose()}
                                >
                                    <p> Close and continue</p>
                                    <svg
                                        width="8"
                                        height="12"
                                        viewBox="0 0 8 12"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M1 0.710632C0.610004 1.10063 0.610004 1.73063 1 2.12063L4.88 6.00063L1 9.88063C0.610004 10.2706 0.610004 10.9006 1 11.2906C1.39 11.6806 2.02 11.6806 2.41 11.2906L7 6.70063C7.39 6.31063 7.39 5.68063 7 5.29063L2.41 0.700632C2.03 0.320632 1.39 0.320632 1 0.710632Z"
                                            fill="white"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </MyContainer>
                </div>
            </div>
        </>
    );
};
export default CookieWidget;
