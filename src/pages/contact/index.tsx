import React from "react";
import { IAppInfo } from "../../models/AppInfo";
import useMediaQuery from "@mui/material/useMediaQuery";
import convertToJSONObject from "@/utils/convertToJSONObject";
import { getAppInfo } from "@/utils/getAppInfo";
import SeoHeader from "@/components/seo/SeoHeader";
import Footer1 from "@/components/footer/Footer1";
import { getContactLink } from "@/utils";
import MyContainer from "@/components/v4-material/MyContainer";
import "./index.scss";
import AppLogo from "@/components/logo/AppLogo";
import MailAboutUs from "@/components/icon/MailAboutUs";
import MediaAboutUs from "@/components/icon/MediaAboutUs";
const ContactsScreen = ({ appInfo }: { appInfo: IAppInfo }) => {
    const isMobile = useMediaQuery("(max-width:780px)");
    const isTablet = useMediaQuery("(max-width:1210px)");
    let emailSupport = "support@abc-elearning.org";
    return (
        <>
            <SeoHeader title={"Contact us – ABC Elearning"} description={""} keyword={""} />
            <div className="contacts">
                <MyContainer className="contacts-container">
                    <div className="logo">
                        <AppLogo />
                    </div>
                    <div className="contact-background-header" />
                    {!isMobile && (
                        <div className="background-dot">
                            <img
                                src="https://storage.googleapis.com/micro-enigma-235001.appspot.com/about-us/dot_background.png"
                                alt=""
                            ></img>
                        </div>
                    )}
                    <div className="contact-header-container">
                        <div className="left-side">
                            <h1 className="title-header">Contact us</h1>
                            <div className="description-header">We’re always happy to hear from you!</div>
                            <div className="media-container">
                                <MailAboutUs />
                                <div className="media-content">
                                    <div className="title">Direct email</div>
                                    <a className="description" href={`mailto:${emailSupport}`}>
                                        {emailSupport}
                                    </a>
                                </div>
                            </div>
                            <div className="media-container">
                                <MediaAboutUs />
                                <div className="media-content">
                                    <div className="title">Press & Media Inquiries</div>
                                    <a className="description" href={getContactLink("facebook")}>
                                        @facebook
                                    </a>
                                </div>
                            </div>
                        </div>
                        {!isMobile && (
                            <img
                                src="/images/contacts/contacts-header.png"
                                width={isTablet ? 366 : 610}
                                height={isTablet ? 339 : 557}
                                style={{ margin: isTablet ? "auto" : "" }}
                                loading="lazy"
                                alt=""
                            ></img>
                        )}
                    </div>
                </MyContainer>
            </div>
            <Footer1 />
        </>
    );
};
export const getStaticProps = async (context) => {
    let appInfo = getAppInfo();
    return convertToJSONObject({
        props: { appInfo },
    });
};
export default ContactsScreen;
