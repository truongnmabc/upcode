"use client";

import FacebookIcon from "@/components/icon/FacebookIcon";
import LinkedinIcon from "@/components/icon/LinkedinIcon";
import TwitterIcon from "@/components/icon/TwitterIcon";
import YoutubeIcon from "@/components/icon/YoutubeIcon";
import { validateEmail } from "@/utils";
import useMediaQuery from "@mui/material/useMediaQuery";
import { IAppInfo } from "../../models/app/appInfo";
import "./index.scss";
import DataFaqs from "../../data/contact-faqs.json";
import ViewAnswerIcon from "@/components/contact/view-answer";
import { Fragment, useEffect, useRef, useState } from "react";
import { sendEmailSubscribeApiV4 } from "@/services/home.service";
import { useRouter } from "next/navigation";
import { getContactApp } from "@/utils/getContact";
const ContactsScreen = ({ appInfo }: { appInfo: IAppInfo }) => {
    const isMobile = useMediaQuery("(max-width:780px)");
    const router = useRouter();
    const btn = useRef<HTMLButtonElement>(null);
    const [valueSendMail, setValueSendMail] = useState({
        email: "",
        message: "",
    });
    const [checkMessageExist, setCheckMessageExist] = useState(true);
    const [checkEmailExist, setCheckEmailExist] = useState(true);

    let emailSupport = "support@abc-elearning.org";
    const onChangeEmail = (e: { target: { value: string } }) => {
        if (e.target.value != "") {
            setCheckEmailExist(true);
        } else {
            setCheckEmailExist(false);
        }
        setValueSendMail({
            ...valueSendMail,
            email: e.target.value,
        });
    };
    const onChangeMessage = (e: { target: { value: string } }) => {
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
        if (btn.current) {
            let result;
            try {
                let email = valueSendMail.email;
                let message = valueSendMail.message;
                const isValidEmail = validateEmail(valueSendMail.email);
                const isValidMessage = message.trim().length > 0;
                if (!isValidMessage) {
                    setCheckMessageExist(false);
                }
                if (!isValidEmail || !email) {
                    setCheckEmailExist(false);
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
                    if (btn.current) {
                        btn.current.disabled = false;
                        btn.current.innerHTML = "Send";
                    }
                }, 2000);
            }
        }
    };
    const layoutSendMail = () => {
        return (
            <div className="cluster-send-mail">
                <div className="form-send-mail">
                    <div className="title">Contact Us</div>
                    <div className="description">
                        Any questions, comments or feedback? We’re here to help!
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
                                    "noti " + (!checkEmailExist ? "check" : "")
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
                                        router.push(`mailto:${emailSupport}`);
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
                            <SocialsIcon />
                        </>
                    )}
                    {}
                </div>
            </div>
        );
    };
    return (
        <Fragment>
            <div className="contact-page">
                <div className="cluster-infor-title">
                    {!isMobile && (
                        <div className="in-form max-w-component-desktop">
                            <div className="left-form">
                                <img
                                    className="img-back"
                                    src="/images/contacts/cdl/truck-contact-page.png"
                                    alt=""
                                />
                                <div className="cluster-img-info">
                                    <div className="title">
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
                                    <div
                                        className="cluster-location"
                                        onClick={() => {
                                            router.push("/");
                                        }}
                                    >
                                        <img
                                            src="/images/contacts/location.png"
                                            alt=""
                                        />
                                        <div className="text-info">
                                            209 S Rosemont Ave, Dallas, TX 75208
                                        </div>
                                    </div>
                                    <div>
                                        <SocialsIcon />
                                    </div>
                                </div>
                            </div>

                            {layoutSendMail()}
                        </div>
                    )}
                    {isMobile && layoutSendMail()}
                </div>

                <div className="cluster-faqs">
                    <div className="title max-w-component-desktop">FAQs</div>
                    <div className="faqs-form max-w-component-desktop">
                        {DataFaqs.map((item, index) => (
                            <ViewFAQs faq={item} index={index} key={index} />
                        ))}
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

const SocialsIcon = () => {
    const facebook = getContactApp("facebook").facebook;
    const twitter = getContactApp("twitter").twitter;
    const youtube = getContactApp("youtube").youtube;
    const linkedin = getContactApp("linkedin").linkedin;
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
            {linkedin && (
                <a href={linkedin}>
                    <LinkedinIcon color="#fff" colorApp="#343F82" />
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
    useEffect(() => {
        if (index == 0) {
            setShowAnswer(true);
        }
    }, []);
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

export default ContactsScreen;
