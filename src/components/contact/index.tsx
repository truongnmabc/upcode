"use client";

import FacebookIcon from "@/components/icon/FacebookIcon";
import LinkedinIcon from "@/components/icon/LinkedinIcon";
import TwitterIcon from "@/components/icon/TwitterIcon";
import YoutubeIcon from "@/components/icon/YoutubeIcon";
import { validateEmail } from "@/utils";

import ViewAnswerIcon from "@/components/contact/view-answer";
import { IAppInfo } from "@/models/app/appInfo";
import { sendEmailSubscribeApiV4 } from "@/services/home.service";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useRef, useState } from "react";
import DataFaqs from "../../data/contact-faqs.json";
import "./index.scss";
import { getContactApp } from "@/utils/getContact";
import { useRouter } from "next/navigation";

export default function ContactsScreenView({ appInfo }: { appInfo: IAppInfo }) {
    const isMobile = useMediaQuery("(max-width:780px)");
    const isTablet = useMediaQuery("(max-width:1210px)");
    const router = useRouter();
    const btn = useRef<HTMLButtonElement>(null);
    const [valueSendMail, setValueSendMail] = useState({
        email: "",
        message: "",
    });
    const [checkMessageExist, setCheckMessageExist] = useState(true);

    const { email: emailSupport } = getContactApp(appInfo.appShortName);

    const onChangeEmail = (e) => {
        setValueSendMail({
            ...valueSendMail,
            email: e.target.value,
        });
    };
    const onChangeMessage = (e) => {
        if (e.target.value != "") {
            setCheckMessageExist(true);
        } else {
            setCheckMessageExist(false);
        }
        setValueSendMail({
            ...valueSendMail,
            message: e.target.value,
        });
    };
    const handleSubmit = async () => {
        let result;
        try {
            let email = valueSendMail.email;
            let message = valueSendMail.message;
            const isValidEmail = validateEmail(valueSendMail.email);
            const isValidMessage = message.trim().length > 0;
            if (!isValidMessage) {
                setCheckMessageExist(false);
                btn.current.disabled = true;
            }
            if (isValidEmail && isValidMessage) {
                btn.current.innerHTML = "Sending...";
                btn.current.disabled = true;

                result = await sendEmailSubscribeApiV4(
                    email.trim(),
                    message.trim(),
                    appInfo.appName
                );
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
    return (
        <div className="contact-page">
            <div className="cluster-infor-title">
                {!isMobile && (
                    <div className="cluster-img-info">
                        <div className="title">Contact Information</div>
                        <div className="intro">
                            We’re always happy to hear from you!
                        </div>
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
                        <div>
                            <SocialsIcon appShortName={appInfo.appShortName} />
                        </div>
                    </div>
                )}
                <div className="cluster-send-mail">
                    <div className="form-send-mail">
                        <div className="title">Contact Us</div>
                        <div className="description">
                            Any questions, comments or feedback? We’re here to
                            help!
                        </div>

                        <div className="input-mail">
                            <p>Email</p>
                            <div className="group-input-noti">
                                <input
                                    type="text"
                                    name="email"
                                    value={valueSendMail.email}
                                    onChange={onChangeEmail}
                                    placeholder="Enter your email"
                                />
                                <div
                                    className={
                                        "noti " +
                                        (valueSendMail.email &&
                                        !validateEmail(valueSendMail.email)
                                            ? "check"
                                            : "")
                                    }
                                >
                                    Please provide a valid email address!
                                </div>
                            </div>
                        </div>
                        <div className="input-message">
                            <p>Message</p>
                            <div className="group-textarea-noti">
                                <textarea
                                    className="message-send-mail"
                                    id="message-send-mail"
                                    placeholder="Enter your message"
                                    value={valueSendMail.message}
                                    onChange={onChangeMessage}
                                ></textarea>
                                <div
                                    className={
                                        "noti " +
                                        (!checkMessageExist ? "check" : "")
                                    }
                                >
                                    Please type your message!
                                </div>
                            </div>
                        </div>

                        <button ref={btn} onClick={() => handleSubmit()}>
                            Send
                        </button>
                        {!isMobile ? (
                            <img
                                src="/images/contacts/cdl/form-contact-send-mail.png"
                                alt=""
                            />
                        ) : (
                            <>
                                <div className="contact-information">
                                    Contact Information
                                </div>
                                <div className="intro">
                                    We’re always happy to hear from you!
                                </div>
                                {emailSupport && (
                                    <div
                                        className="cluster-email"
                                        onClick={() => {
                                            router.push(
                                                `mailto:${emailSupport}`
                                            );
                                        }}
                                    >
                                        <img
                                            src="/images/contacts/sms.png"
                                            alt=""
                                        />

                                        <div className="text-info">
                                            {emailSupport}
                                        </div>
                                    </div>
                                )}
                                <SocialsIcon
                                    appShortName={appInfo.appShortName}
                                />
                            </>
                        )}
                        {}
                    </div>
                </div>
            </div>
            <div className="cluster-faqs max-w-page mx-auto">
                <div className="title max-w-component-desktop">FAQs</div>
                <div className="faqs-form max-w-component-desktop">
                    {DataFaqs.map((item, index) => (
                        <ViewFAQs faq={item} index={index} key={index} />
                    ))}
                </div>
            </div>
        </div>
    );
}

const SocialsIcon = ({ appShortName }: { appShortName: string }) => {
    const { facebook, email, twitter, youtube } = getContactApp(appShortName);

    return (
        <div className="socials-icon">
            {facebook && (
                <a href={facebook}>
                    <FacebookIcon color="#fff" colorApp="#343F82" />
                </a>
            )}
            {twitter && (
                <a href={twitter}>
                    <TwitterIcon color="#fff" colorApp="#343F82" />
                </a>
            )}
            {youtube && (
                <a href={youtube}>
                    <YoutubeIcon color="#fff" colorApp="#343F82" />
                </a>
            )}
        </div>
    );
};

const ViewFAQs = ({ faq, index }: { faq: any; index: any }) => {
    const [showAnswer, setShowAnswer] = useState(false);
    const handleShowAnswer = () => {
        setShowAnswer(!showAnswer);
    };

    return (
        <div
            className="item-faq"
            style={{
                backgroundColor: showAnswer ? "#343F82" : "#2121210a",
                color: showAnswer ? "#fff !important" : "unset",
            }}
        >
            <p style={{ color: showAnswer ? "#fff" : "#212121" }}>
                {(index + 1).toString().padStart(2, "0")}
            </p>
            <div className="cluster-aq">
                <div className="cluster-question-button">
                    <span style={{ color: showAnswer ? "#fff" : "#212121" }}>
                        {faq.question}
                    </span>
                    <ViewAnswerIcon
                        handleClick={handleShowAnswer}
                        showAnswer={showAnswer}
                    />
                </div>
                <div
                    className="answer"
                    style={{ display: showAnswer ? "block" : "none" }}
                >
                    <span
                        style={{
                            visibility: showAnswer ? "visible" : "hidden",
                        }}
                        dangerouslySetInnerHTML={{
                            __html: faq.answer,
                        }}
                    ></span>
                </div>
            </div>
        </div>
    );
};
