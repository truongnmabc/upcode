import { IAppInfo } from "@/models/AppInfo";
import React, { useRef } from "react";
import "./AppFooterV0.scss";
import MyContainer from "@/components/v4-material/MyContainer";
import { APP_SHORT_NAME } from "@/config_app";
import MailAboutUs from "@/components/icon/MailAboutUs";
import { getContactLink, validateEmail } from "@/utils";
import { sendEmailSubscribeApi } from "@/services/home.service";
import Link from "next/link";
import dynamic from "next/dynamic";
import useThemeCustom from "@/components/v4-material/useThemeCustom";
const RedditIcon = dynamic(() => import("@/components/icon/RedditIcon"));
const OldFacebookIcon = dynamic(() => import("@/components/icon/OldFacebookIcon"));
const XIcon = dynamic(() => import("@/components/icon/XIcon"));
const OldYoutubeIcon = dynamic(() => import("@/components/icon/OldYoutubeIcon"));

const AppFooterV0 = ({ appInfo, themeType = "children" }: { appInfo: IAppInfo; themeType?: "parent" | "children" }) => {
    const { theme } = useThemeCustom();
    let srcLogo = `images/${APP_SHORT_NAME}/logo-${!!theme ? theme : "light"}.png`;
    let _theme = "dark";
    if (themeType !== "parent") {
        _theme = !!theme ? theme : "light";
    }
    return (
        <div className={"v0-footer-theme " + themeType}>
            <MyContainer>
                <footer className="v0-app-footer">
                    <div className="v0-app-footer-logo_footer-option">
                        <div className="logo_cirtificate">
                            <div className="-logo">
                                <Link href="/">
                                    <a>
                                        <img src={srcLogo} alt="logo" width={174} height={40} />
                                    </a>
                                </Link>
                            </div>
                            <div className="cirtificate_social">
                                <img
                                    src="/images/dmca_protected.png"
                                    className="app-footer-dmca-certificate"
                                    alt="certificate"
                                    width="121"
                                    height="24"
                                ></img>
                                <div className="__768">
                                    <SocialV0 theme={_theme} />
                                </div>
                            </div>
                        </div>
                        {/* {footerContent ... passeamll khong co du lieu nay nen tam thoi chua them} */}
                        <div className="v0-option-company">
                            <p className="_769">Company</p>
                            <Link href="/about-us" prefetch={false}>
                                <a>About us</a>
                            </Link>
                            <Link href="/contact" prefetch={false}>
                                <a>Contact</a>
                            </Link>
                            <Link href="/privacy" prefetch={false}>
                                <a>Privacy</a>
                            </Link>
                            {/* <Link href="/support" prefetch={false}>
                                <a>Support</a>
                            </Link> */}
                            <Link href="/faq" prefetch={false}>
                                <a>FAQ</a>
                            </Link>
                        </div>
                    </div>
                    <div className="v0-app-footer-mail-and-social">
                        <div className="mail-subscribe">
                            <div className="subscribe-text">
                                <MailAboutUs color={themeType === "children" ? "#212121" : "#fff"} />
                                <div>
                                    <p>SUBSCRIBE</p>
                                    <span className="_769">
                                        Be first to know about the latest update and access free materials only for subscribers!
                                    </span>
                                    <span className="__768">Thanks for your subscribing!</span>
                                </div>
                            </div>
                            <SubscribeForm />
                        </div>
                        <div className="v0-social _769">
                            <SocialV0 theme={_theme} />
                        </div>
                    </div>
                </footer>
            </MyContainer>
            <small>v.1.7.24</small>
        </div>
    );
};

const SubscribeForm = () => {
    const _email = useRef<HTMLInputElement>(null);
    const _name = useRef<HTMLInputElement>(null);
    const error_email = useRef<HTMLParagraphElement>(null);
    const error_name = useRef<HTMLParagraphElement>(null);
    const btn = useRef<HTMLButtonElement>(null);
    const handleSubmit = async () => {
        let result;
        try {
            let email = _email.current.value;
            let name = _name.current.value;
            const isValidEmail = validateEmail(email);
            const isValidMessage = name.trim().length > 0;
            if (isValidEmail && isValidMessage) {
                btn.current.innerHTML = "...";
                btn.current.disabled = true;
                error_email.current.innerHTML = "";
                error_name.current.innerHTML = "";
                result = await sendEmailSubscribeApi(email.trim(), name.trim());
                _email.current.value = "";
                _name.current.value = "";
            } else {
                (error_email.current.innerHTML = isValidEmail ? "" : "Please provide a valid email address!"),
                    (error_name.current.innerHTML = isValidMessage ? "" : "Type your name please!");
            }
        } catch (error) {
            console.log("footer send mail error", error);
        }
        if (result) {
            btn.current.innerHTML = "Sent";
        }
        const sent = setTimeout(() => {
            btn.current.disabled = false;
            btn.current.innerHTML = "Send";
        }, 2000);

        return clearTimeout(sent);
    };
    return (
        <div className="v0-footer-mail-subscribe">
            <div className="input-container">
                <div className="v0-input-field">
                    <input
                        ref={_email}
                        type="email"
                        placeholder="Your email address"
                        onChange={(e) => {
                            if (!!error_email.current.innerHTML) error_email.current.innerHTML = "";
                        }}
                    />
                    <p ref={error_email} className="fieldset"></p>
                </div>
                <div className="v0-input-field">
                    <input
                        ref={_name}
                        type="text"
                        placeholder="Type your name"
                        onChange={(e) => {
                            if (!!error_name.current.innerHTML) error_name.current.innerHTML = "";
                        }}
                    />
                    <p ref={error_name} className="fieldset"></p>
                </div>
            </div>
            <button ref={btn} className="send-btn" onClick={handleSubmit}>
                Send
            </button>
        </div>
    );
};

const SocialV0 = ({ theme = "light" }: { theme?: string }) => {
    return (
        <>
            {getContactLink("twitter") != null && (
                <a href={getContactLink("twitter")} target="_blank" rel="noopener, noreferrer">
                    <XIcon color={theme == "light" ? "#212121" : "#fff"} />
                </a>
            )}
            {getContactLink("facebook") != null && (
                <a href={getContactLink("facebook")} target="_blank" rel="noopener, noreferrer">
                    <OldFacebookIcon color={theme == "light" ? "#212121" : "#fff"} />
                </a>
            )}

            {!!getContactLink("youtube") && (
                <a href={getContactLink("youtube")} target="_blank" rel="noopener, noreferrer">
                    <OldYoutubeIcon color={theme == "light" ? "#212121" : "#fff"} />
                </a>
            )}
            {!!getContactLink("reddit") && (
                <a href={getContactLink("reddit")} target="_blank" rel="noopener, noreferrer">
                    <RedditIcon color={theme == "light" ? "#212121" : "#fff"} />
                </a>
            )}
        </>
    );
};
export default AppFooterV0;
