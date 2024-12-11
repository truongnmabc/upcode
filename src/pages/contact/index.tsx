import FacebookIcon from "@/components/icon/FacebookIcon";
import LinkedinIcon from "@/components/icon/LinkedinIcon";
import TwitterIcon from "@/components/icon/TwitterIcon";
import YoutubeIcon from "@/components/icon/YoutubeIcon";
import { getContactLink } from "@/utils";
import convertToJSONObject from "@/utils/convertToJSONObject";
import { getAppInfo } from "@/utils/getAppInfo";
import useMediaQuery from "@mui/material/useMediaQuery";
import { IAppInfo } from "../../models/AppInfo";
import "./index.scss";
import { useRouter } from "next/router";
import DataFaqs from "../../data/contact-faqs.json";
const ContactsScreen = ({ appInfo }: { appInfo: IAppInfo }) => {
    const isMobile = useMediaQuery("(max-width:780px)");
    const isTablet = useMediaQuery("(max-width:1210px)");
    const router = useRouter();
    const cssNoti = "text-[#FD5F57] text-[14px] leading-[21px] font-normal text-left mt-[8px]";
    let emailSupport = getContactLink("email");
    return (
        <div className="contact-page flex flex-col w-full h-full">
            <div className="cluster-infor-title  w-1/2  flex h-full">
                <div
                    className="cluster-img-info   flex flex-col justify-end flex-end pl-[80px] pb-[48px]
      bg-[url('/images/contacts/cdl/truck-contact-page.png')] bg-cover bg-center h-[885px]  w-full"
                >
                    <div className="title text-white text-[32px] leading-[48px] font-semibold text-left ">
                        Contact Information
                    </div>
                    <div className="intro text-[18px] leading-[27px] text-[#FFFFFFCC] font-normal text-left mt-[4px]">
                        We’re always happy to hear from you!
                    </div>
                    {emailSupport && (
                        <div
                            className="cluster-email  flex gap-2 items-center cursor-pointer mt-[24px]"
                            onClick={() => {
                                router.push(`mailto:${emailSupport}`);
                            }}
                        >
                            <img src="/images/contacts/sms.png" alt="" />

                            <div className="text-info">{emailSupport}</div>
                        </div>
                    )}
                    <div
                        className="cluster-location  flex gap-2 items-center cursor-pointer mt-[24px]"
                        onClick={() => {
                            router.push("/");
                        }}
                    >
                        <img src="/images/contacts/location.png" alt="" />
                        <div className="text-info  -sm text-white font-medium leading-[27px]">
                            209 S Rosemont Ave, Dallas, TX 75208
                        </div>
                    </div>
                    <div className="mt-[24px]">
                        <SocialsIcon />
                    </div>
                </div>
                <div className="cluster-send-mail  flex flex-wrap justify-end content-center w-1/2 bg-[#E6EAFF] pr-[80px]">
                    <div className="form-send-mail bg-white  pt-[24px] px-[24px]">
                        <div className="title   text-[#212121] text-[52px] leading-[78px] font-bold text-center">
                            Contact Us
                        </div>
                        <div className="description  text-[#21212185] text-[16px] leading-[24px] font-normal text-center">
                            Any questions, comments or feedback? We’re here to help!
                        </div>

                        <div className="input-mail   flex flex-col gap-[4px]">
                            <p className="m-[0] text-[#212121] text-[16px] leading-[24px] font-medium text-left mt-[32px]">
                                Email
                            </p>
                            <div className="group-input-noti">
                                <input
                                    type="text"
                                    className="border border-[#21212129] placeholder-[#21212185] placeholder-opacity-80  px-4 py-2 rounded-[8px] focus:outline-none w-full"
                                    placeholder="Enter your email"
                                />
                                <div className={`noti ${cssNoti}`}>Please provide a valid email address!</div>
                            </div>
                        </div>
                        <div className="input-message  flex flex-col gap-[4px] mt-[24px]">
                            <p className="m-[0] text-[#212121] text-[16px] leading-[24px] font-medium text-left">Message</p>
                            <div className="group-textarea-noti">
                                <textarea
                                    className="message-send-mail   resize-none border border-[#21212129] placeholder-[#21212185] placeholder-opacity-80  px-4 py-2 rounded-[8px] focus:outline-none w-full"
                                    id="message-send-mail"
                                    placeholder="Enter your message"
                                ></textarea>
                                <div className={`noti ${cssNoti}`}>Please type your message!</div>
                            </div>
                        </div>

                        <button className="bg-[#343F82] text-white font-semibold text-[16px] leading-[24px] w-full py-[16px] rounded-[8px] mt-[32px] mb-[19px]">
                            Send
                        </button>
                        <img
                            src="/images/contacts/cdl/form-contact-send-mail.png"
                            className="max-w-[512px] max-h-[184px] px-[8px]"
                            alt=""
                        />
                    </div>
                </div>
            </div>
            <div className="cluster-faqs">
                <div className="title">FAQs</div>
                <div className="faqs-form">
                    {DataFaqs.map((item, index) => (
                        <div className="item-faq" key={index}>
                            <p>{index + 1}</p>
                            <div className="cluster-aq">
                                <div className="cluster-question-button">{item.question}</div>
                                <div className="answer">{item.answer}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
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
