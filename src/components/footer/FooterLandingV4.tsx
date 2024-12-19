"use client";

import { appInfoState } from "@/redux/features/appInfo";
import { useAppSelector } from "@/redux/hooks";
import { sendEmailSubscribeApiV4 } from "@/services/home.service";
import { validateEmail } from "@/utils";
import { getContactApp } from "@/utils/getContact";
import { useMediaQuery } from "@mui/material";
import Link from "next/link";
import { memo, useRef } from "react";
import { IAppInfo } from "../../models/app/appInfo";
import FacebookIcon from "../icon/FacebookIcon";
import TwitterIcon from "../icon/TwitterIcon";
import YoutubeIcon from "../icon/YoutubeIcon";
import "./FooterLandingV4.scss";

const FooterLandingV4 = () => {
    const isMobile = useMediaQuery("(max-width:768px)");
    let emailSupport = "support@abc-elearning.org";
    const getSrcLogo = () => {
        let logo = `/images/${appInfo.appShortName}/logo-dark.png`;
        return logo;
    };
    const { appInfo } = useAppSelector(appInfoState);
    const _email = useRef<HTMLInputElement>(null);
    const _message = useRef<HTMLInputElement>(null);
    const error_email = useRef<HTMLParagraphElement>(null);
    const error_message = useRef<HTMLParagraphElement>(null);
    const btn = useRef<HTMLButtonElement>(null);
    const handleSubmit = async () => {
        let result;
        if (
            _email.current &&
            btn.current &&
            _message.current &&
            error_email.current &&
            error_message.current
        ) {
            try {
                const email = _email.current.value;
                const message = _message.current.value;
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
                    if (btn.current) {
                        btn.current.disabled = false;
                        btn.current.innerHTML = "Send";
                    }
                }, 2000);
            }
        }
    };
    const groupCompanyLegal = () => {
        return (
            <>
                <div className="item-footer cluster-company">
                    <div className="title">Company</div>
                    <Link href={"/about-us"} prefetch={false}>
                        About Us
                    </Link>
                    <Link href={"/contact"} prefetch={false}>
                        Contact Us
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
                                    alt={"logo-" + appInfo.appShortName}
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

                    <span>
                        {appInfo.appName == "CDL"
                            ? "CDL Prep is your ultimate resource to ace your CDL exam with ease, providing simulated practice tests, key insights, and everything you need to hit the road successfully!"
                            : appInfo.descriptionSEO}
                    </span>

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
                    <div className="cluster-info-send-mail">
                        {emailSupport && (
                            <div
                                className="cluster-email"
                                onClick={() => {
                                    // router.push(`mailto:${emailSupport}`);
                                }}
                            >
                                <img src="/images/contacts/sms.png" alt="" />

                                <div className="text-info">{emailSupport}</div>
                            </div>
                        )}
                        <div
                            className="cluster-location"
                            onClick={() => {
                                // router.push("/");
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
                                    if (
                                        error_email.current &&
                                        !!error_email.current.innerHTML
                                    )
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
                                    if (
                                        error_message.current &&
                                        !!error_message.current.innerHTML
                                    )
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
                </div>
            </div>
            <div className="v4-footer-landing-container-1">
                <div className="footer-social max-w-component-desktop">
                    <span>
                        ©2024 {appInfo.appName} Prep by ABC-Elearning. All
                        rights reserved.
                    </span>
                    <PlatformContactsLogo appInfo={appInfo} />
                </div>
            </div>
        </div>
    );
};

const PlatformContactsLogo = ({ appInfo }: { appInfo: IAppInfo }) => {
    const { facebook, twitter, youtube } = getContactApp(appInfo.appShortName);
    // viet kieu nay de check core web vital
    return (
        <div className="v4-platform-logo-contact-0">
            {facebook && (
                <div>
                    <a href={facebook}>
                        {/* <img alt="facebook-icon" src="/images/v4-facebook.webp" width={24} height={24} /> */}
                        <FacebookIcon color="#fff" colorApp="#343F82" />
                    </a>
                </div>
            )}
            {twitter && (
                <div>
                    <a href={twitter}>
                        {/* <img alt="twitter-icon" src="/images/v4-twitter.webp" width={24} height={24} /> */}
                        <TwitterIcon color="#fff" colorApp="#343F82" />
                    </a>
                </div>
            )}
            {youtube && (
                <div>
                    <a href={youtube}>
                        {/* <img alt="youtube-icon" src="/images/v4-youtube.webp" width={24} height={24} /> */}
                        <YoutubeIcon color="#fff" colorApp="#343F82" />
                    </a>
                </div>
            )}
        </div>
    );
};

export default memo(FooterLandingV4);
