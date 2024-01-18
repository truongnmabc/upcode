// import Container from "@material-ui/core/Container";
import Link from "next/link";
import { getContactLink, validateEmail } from "@/utils";
import { APP_SHORT_NAME } from "../../config_app";
import { memo, useRef } from "react";
import { sendEmailSubscribeApiV4 } from "@/services/home.service";
import { IAppInfo } from "../../models/AppInfo";
import "./FooterLandingV4.scss";
import MyContainer from "../v4-material/MyContainer";
import FacebookIcon from "../icon/FacebookIcon";
import TwitterIcon from "../icon/TwitterIcon";
import YoutubeIcon from "../icon/YoutubeIcon";
const FooterLandingV4 = ({ appInfo }: { appInfo: IAppInfo }) => {
    const getSrcLogo = () => {
        let logo = `/images/${APP_SHORT_NAME}/logo-dark.png`;
        return logo;
    };
    const _email = useRef<HTMLInputElement>(null);
    const _message = useRef<HTMLInputElement>(null);
    const error_email = useRef<HTMLParagraphElement>(null);
    const error_message = useRef<HTMLParagraphElement>(null);
    const btn = useRef<HTMLButtonElement>(null);
    const handleSubmit = async () => {
        let result;
        try {
            let email = _email.current.value;
            let message = _message.current.value;
            const isValidEmail = validateEmail(email);
            const isValidMessage = message.trim().length > 0;
            if (isValidEmail && isValidMessage) {
                btn.current.innerHTML = "Sending...";
                btn.current.disabled = true;
                error_email.current.innerHTML = "";
                error_message.current.innerHTML = "";
                result = await sendEmailSubscribeApiV4(email.trim(), message.trim(), appInfo.appName);
                _email.current.value = "";
                _message.current.value = "";
            } else {
                (error_email.current.innerHTML = isValidEmail ? "" : "Please provide a valid email address!"),
                    (error_message.current.innerHTML = isValidMessage ? "" : "Type your message please!");
            }
        } catch (error) {
            console.log("footer send mail error", error);
        }
        if (result) {
            btn.current.innerHTML = "Sent";
            setTimeout(() => {
                btn.current.disabled = false;
                btn.current.innerHTML = "Contact Us";
            }, 2000);
        }
    };
    return (
        <div className="v4-footer-landing-0">
            <div className="v4-svg-desktop">
                <svg viewBox="0 0 1366 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M375.5 0C154.509 -5.69114e-06 0 44.9742 0 44.9742V49H1366V0C1366 0 1212.5 64.3678 951.955 44.9742C796.458 33.3999 664.088 7.43196e-06 375.5 0Z"
                        fill="#7C6F5B"
                    />
                </svg>
            </div>
            <div className="v4-svg-mobile">
                <svg viewBox="0 0 375 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M103.084 23.3151C42.4166 10.2552 0 11.483 0 11.483V29H375V9.0114C375 9.0114 332.076 -8.47021 261.335 5.26399C210 15.2304 177.95 39.4315 103.084 23.3151Z"
                        fill="#7C6F5B"
                    />
                </svg>
            </div>
            <div className="v4-footer-landing-container-0">
                <MyContainer>
                    <div className="v4-footer-landing-container-11">
                        <div className="v4-footer-landing-container-111">
                            <Link href="/" className={"logo-footer-v4"}>
                                <img src={getSrcLogo()} alt={"logo-" + APP_SHORT_NAME} height={40} width={132} />
                            </Link>
                            <img src={"/images/dmca_protected.png"} alt="certificate" width="121" height="24" />
                            <div className="v4-contact-social-desktop">
                                <PlatformContactsLogo />
                            </div>
                        </div>
                        <div className="v4-footer-landing-container-112">
                            <div>Any questions, comments or feedback? We’re here to help!</div>
                            <div className="v4-input-field v4-border-radius">
                                <input
                                    ref={_email}
                                    type="email"
                                    placeholder="Enter your email"
                                    onChange={(e) => {
                                        if (!!error_email.current.innerHTML) error_email.current.innerHTML = "";
                                    }}
                                />
                                <p ref={error_email} className="fieldset"></p>
                            </div>
                            <div className="v4-input-field v4-border-radius">
                                <input
                                    ref={_message}
                                    type="text"
                                    placeholder="Enter your message"
                                    onChange={(e) => {
                                        if (!!error_message.current.innerHTML) error_message.current.innerHTML = "";
                                    }}
                                />
                                <p ref={error_message} className="fieldset"></p>
                            </div>
                            <button
                                ref={btn}
                                className="v4-footer-btn-contact-us v4-border-radius v4-button-animtaion"
                                onClick={() => {
                                    handleSubmit();
                                }}
                            >
                                Contact Us
                            </button>
                        </div>
                    </div>
                    <div className="v4-footer-landing-container-12">
                        <div className="v4-contact-social-mobile">
                            <PlatformContactsLogo />
                        </div>
                        <div className="v4-footer-landing-container-121">
                            <Link href={"/about-us"} prefetch={false}>
                                About us
                            </Link>
                            <Link href={"/privacy"} prefetch={false}>
                                Privacy
                            </Link>
                            <Link href={"/faq"} prefetch={false}>
                                FAQs
                            </Link>
                        </div>
                        <div className="v4-footer-landing-container-122">© 2021 ABC E-learning All Rights Reserved.</div>
                    </div>
                </MyContainer>
            </div>
        </div>
    );
};

const PlatformContactsLogo = () => {
    let fb = getContactLink("facebook");
    let tw = getContactLink("twitter");
    let yt = getContactLink("youtube");
    // viet kieu nay de check core web vital
    return (
        <div className="v4-platform-logo-contact-0">
            {fb && (
                <div>
                    <a href={fb}>
                        {/* <img alt="facebook-icon" src="/images/v4-facebook.webp" width={24} height={24} /> */}
                        <FacebookIcon color="#fff" />
                    </a>
                </div>
            )}
            {tw && (
                <div>
                    <a href={tw}>
                        {/* <img alt="twitter-icon" src="/images/v4-twitter.webp" width={24} height={24} /> */}
                        <TwitterIcon color="#fff" />
                    </a>
                </div>
            )}
            {yt && (
                <div>
                    <a href={yt}>
                        {/* <img alt="youtube-icon" src="/images/v4-youtube.webp" width={24} height={24} /> */}
                        <YoutubeIcon color="#fff" />
                    </a>
                </div>
            )}
        </div>
    );
};

export default memo(FooterLandingV4, (prev, next) => {
    if (JSON.stringify(prev.appInfo).localeCompare(JSON.stringify(next.appInfo)) == 0) return true;
    return false;
});
