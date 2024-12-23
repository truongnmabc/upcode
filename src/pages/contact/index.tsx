import FacebookIcon from "@/components/icon/FacebookIcon";
import LinkedinIcon from "@/components/icon/LinkedinIcon";
import TwitterIcon from "@/components/icon/TwitterIcon";
import YoutubeIcon from "@/components/icon/YoutubeIcon";
import { getContactLink, validateEmail } from "@/utils";
import convertToJSONObject from "@/utils/convertToJSONObject";
import { getAppInfo } from "@/utils/getAppInfo";
import useMediaQuery from "@mui/material/useMediaQuery";
import { IAppInfo } from "../../models/AppInfo";
import "./index.scss";
import { useRouter } from "next/router";
import DataFaqs from "../../data/contact-faqs.json";
import ViewAnswerIcon from "@/components/contact/view-answer";
import { useEffect, useRef, useState } from "react";
import { sendEmailSubscribeApiV4 } from "@/services/home.service";
import Layout2 from "@/components/layout/layout-2/Layout2";
import SeoHeader from "@/components/seo/SeoHeader";
const ContactsScreen = ({ appInfo }: { appInfo: IAppInfo }) => {
    const isMobile = useMediaQuery("(max-width:780px)");
    const isTablet = useMediaQuery("(max-width:1210px)");
    const router = useRouter();
    const btn = useRef<HTMLButtonElement>(null);
    const [valueSendMail, setValueSendMail] = useState({
        email: "",
        message: "",
    });
    const [checkMessageExist, setCheckMessageExist] = useState(true);
    const [checkEmailExist, setCheckEmailExist] = useState(true);

    let emailSupport = "support@abc-elearning.org";
    const onChangeEmail = (e) => {
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
            }
            if (!isValidEmail || !email) {
                setCheckEmailExist(false);
            }
            if (isValidEmail && isValidMessage) {
                btn.current.innerHTML = "Sending...";
                btn.current.disabled = true;

                result = await sendEmailSubscribeApiV4(email.trim(), message.trim(), appInfo.appName);
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
    const layoutSendMail = () => {
        return (
            <div className="cluster-send-mail">
                <div className="form-send-mail">
                    <div className="title">Contact Us</div>
                    <div className="description">Any questions, comments or feedback? We’re here to help!</div>

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
                            <div className={"noti " + (!checkEmailExist ? "check" : "")}>
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
                            <div className={"noti " + (!checkMessageExist ? "check" : "")}>Please type your message!</div>
                        </div>
                    </div>

                    <button ref={btn} onClick={() => handleSubmit()}>
                        Send
                    </button>
                    {!isMobile ? (
                        <img src="/images/contacts/cdl/form-contact-send-mail.png" alt="" />
                    ) : (
                        <>
                            <div className="contact-information">Contact Information</div>
                            <div className="intro">We’re always happy to hear from you!</div>
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
                            <SocialsIcon />
                        </>
                    )}
                    {}
                </div>
            </div>
        );
    };
    return (
        <Layout2 appInfo={appInfo} listTopics={[]} tests={[]}>
            <SeoHeader title={"Contact us – ABC Elearning"} description={""} keyword={""} />
            <div className="contact-page">
                <div className="cluster-infor-title">
                    {!isMobile && (
                        <div className="in-form max-w-component-desktop">
                            <div className="left-form">
                                <img className="img-back" src="/images/contacts/cdl/truck-contact-page.png" alt="" />
                                <div className="cluster-img-info">
                                    <div className="title">Contact Information</div>
                                    <div className="intro">We’re always happy to hear from you!</div>
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
                                        <div className="text-info">209 S Rosemont Ave, Dallas, TX 75208</div>
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
        </Layout2>
    );
};

const SocialsIcon = () => {
    let fb = getContactLink("facebook");
    let tw = getContactLink("twitter");
    let yt = getContactLink("youtube");
    let ld = getContactLink("linkedin");
    let ins = getContactLink("instagram");
    return (
        <div className="socials-icon">
            {fb && (
                <a href={fb}>
                    <FacebookIcon color="#fff" colorApp="#343F82" />
                </a>
            )}
            {tw && (
                <a href={tw}>
                    <TwitterIcon color="#fff" colorApp="#343F82" />
                </a>
            )}
            {yt && (
                <a href={yt}>
                    <YoutubeIcon color="#fff" colorApp="#343F82" />
                </a>
            )}
            {ld && (
                <a href={ld}>
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
            style={{ backgroundColor: showAnswer ? "#343F82" : "#2121210a", color: showAnswer ? "#fff !important" : "unset" }}
        >
            <p style={{ color: showAnswer ? "#fff" : "#212121" }}>{(index + 1).toString().padStart(2, "0")}</p>
            <div className="cluster-aq">
                <div className="cluster-question-button">
                    <span style={{ color: showAnswer ? "#fff" : "#212121" }}>{faq.question}</span>
                    <ViewAnswerIcon handleClick={handleShowAnswer} showAnswer={showAnswer} />
                </div>
                <div className="answer" style={{ display: showAnswer ? "block" : "none" }}>
                    <span
                        style={{ visibility: showAnswer ? "visible" : "hidden" }}
                        dangerouslySetInnerHTML={{
                            __html: faq.answer,
                        }}
                    ></span>
                </div>
            </div>
        </div>
    );
};
const getEmailContact = (appInfo: IAppInfo) => {
    if (appInfo.appShortName === "cdl") return "support@abc-elearning.org";
    else if (appInfo.appShortName === "easyprep") return "support@easy-prep.org";
    else return "simplifyyourlearning.apps@gmail.com";
};
export const getStaticProps = async (context) => {
    let appInfo = getAppInfo();
    return convertToJSONObject({
        props: { appInfo },
    });
};
export default ContactsScreen;
