import Link from "next/link";
import { getContactLink, validateEmail } from "@/utils";
import { APP_SHORT_NAME } from "../../config_app";
import { memo, useRef } from "react";
import { sendEmailSubscribeApiV4 } from "@/services/home.service";
import { IAppInfo } from "../../models/AppInfo";
import "./FooterLandingV4.scss";
import MyContainer from "../v4-material/myContainer";
import FacebookIcon from "../icon/FacebookIcon";
import TwitterIcon from "../icon/TwitterIcon";
import YoutubeIcon from "../icon/YoutubeIcon";
import { useRouter } from "next/router";
import { useMediaQuery } from "@mui/material";
const FooterLandingV4 = ({ appInfo }: { appInfo: IAppInfo }) => {
    const isMobile = useMediaQuery("(max-width:768px)");
    const router = useRouter();
    let emailSupport = getContactLink("email");
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
                result = await sendEmailSubscribeApiV4(
                    email.trim(),
                    message.trim(),
                    appInfo.appName
                );
                _email.current.value = "";
                _message.current.value = "";
            } else {
                (error_email.current.innerHTML = isValidEmail
                    ? ""
                    : "Please provide a valid email address!"),
                    (error_message.current.innerHTML = isValidMessage
                        ? ""
                        : "Type your message please!");
            }
        } catch (error) {
            console.log("footer send mail error", error);
        }
        if (result) {
            btn.current.innerHTML = "Sent";
            setTimeout(() => {
                btn.current.disabled = false;
                btn.current.innerHTML = "Send";
            }, 2000);
        }
    };
    const groupCompanyLegal = () => {
        return (
            <>
                <div className="item-footer cluster-company">
                    <div className="title">Company</div>
                    <Link href={"/about-us"} prefetch={false}>
                        About us
                    </Link>
                    <Link href={"/contact"} prefetch={false}>
                        Contact
                    </Link>
                </div>
                <div className="item-footer cluster-legal">
                    <div className="title">Legal</div>
                    <Link href={"/editorial-policy"} prefetch={false}>
                        Editorial Policy
                    </Link>
                    <Link href={"/privacy-policy"} prefetch={false}>
                        Privacy Policy
                    </Link>
                    <Link href={"/"} prefetch={false}>
                        Terms & Conditions
                    </Link>
                    <Link href={"/refund-policy"} prefetch={false}>
                        Refund Policy
                    </Link>
                </div>
            </>
        );
    };
    return (
        <div className="v4-footer-landing-0">
            <div className="v4-footer-landing-container-0 max-w-component-desktop">
                <div className="item-footer  cluster-logo-description">
                    <div className="cluster-logo-protected">
                        <Link href="/">
                            <div className={"logo-footer-v4"}>
                                <img
                                    className="img-logo-footer"
                                    src={getSrcLogo()}
                                    alt={"logo-" + APP_SHORT_NAME}
                                    width={162}
                                />
                            </div>
                        </Link>
                        {isMobile && (
                            <img
                                src={"/images/dmca_protected.png"}
                                alt="certificate"
                                width="121"
                                height="24"
                            />
                        )}
                    </div>

                    <span>{appInfo.descriptionSEO}</span>

                    {!isMobile && (
                        <img
                            src={"/images/dmca_protected.png"}
                            alt="certificate"
                            width="121"
                            height="24"
                        />
                    )}
                </div>

                {isMobile ? (
                    <div className="cluster-company-legal">
                        {" "}
                        {groupCompanyLegal()}{" "}
                    </div>
                ) : (
                    groupCompanyLegal()
                )}
                <div className="item-footer support">
                    <div className="title">Support</div>
                    {emailSupport && (
                        <div
                            className="cluster-email"
                            onClick={() => {
                                router.push(`mailto:${emailSupport}`);
                            }}
                        >
                            <img src="/images/contacts/sms.png" alt="" />

                            <div className="text-info">{emailSupport}</div>
                        </div>
                    )}
                    <div
                        className="cluster-location"
                        onClick={() => {
                            router.push("/");
                        }}
                    >
                        <img src="/images/contacts/location.png" alt="" />
                        <div className="text-info">
                            209 S Rosemont Ave, Dallas, TX 75208
                        </div>
                    </div>
                    <div className="intro-suport">
                        Any questions or feedback? We’re here to help!
                    </div>
                    <div className="v4-input-field v4-border-radius">
                        <input
                            ref={_email}
                            type="email"
                            placeholder="Enter your email"
                            onChange={(e) => {
                                if (!!error_email.current.innerHTML)
                                    error_email.current.innerHTML = "";
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
                                if (!!error_message.current.innerHTML)
                                    error_message.current.innerHTML = "";
                            }}
                        />
                        <p ref={error_message} className="fieldset"></p>
                    </div>
                    <div className="footer-support">
                        <button
                            ref={btn}
                            className="v4-footer-btn-contact-us v4-border-radius v4-button-animtaion"
                            onClick={() => {
                                handleSubmit();
                            }}
                        >
                            Send
                        </button>
                    </div>
                </div>

                {/* <div className="v4-footer-landing-container-11">
                    <div className="v4-footer-landing-container-111">
                        <Link href="/" className={"logo-footer-v4"}>
                            <img className="img-logo-footer" src={getSrcLogo()} alt={"logo-" + APP_SHORT_NAME} />
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
                </div> */}
                {/* <div className="v4-footer-landing-container-12">
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
                        <Link href={"/contact"} prefetch={false}>
                            Contact
                        </Link>
                    </div>
                    <div className="v4-footer-landing-container-122">© 2021 ABC E-learning All Rights Reserved.</div>
                </div> */}
            </div>
            <div className="v4-footer-landing-container-1">
                <div className="footer-social max-w-component-desktop">
                    <span>
                        ©2024 {appInfo.appName}Prep by ABC-Elearning. All Rights
                        Reserved.
                    </span>
                    <PlatformContactsLogo />
                </div>
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
                        <FacebookIcon color="#fff" colorApp="#343F82" />
                    </a>
                </div>
            )}
            {tw && (
                <div>
                    <a href={tw}>
                        {/* <img alt="twitter-icon" src="/images/v4-twitter.webp" width={24} height={24} /> */}
                        <TwitterIcon color="#fff" colorApp="#343F82" />
                    </a>
                </div>
            )}
            {yt && (
                <div>
                    <a href={yt}>
                        {/* <img alt="youtube-icon" src="/images/v4-youtube.webp" width={24} height={24} /> */}
                        <YoutubeIcon color="#fff" colorApp="#343F82" />
                    </a>
                </div>
            )}
        </div>
    );
};

export default memo(FooterLandingV4, (prev, next) => {
    if (
        JSON.stringify(prev.appInfo).localeCompare(
            JSON.stringify(next.appInfo)
        ) == 0
    )
        return true;
    return false;
});
