import React from "react";
import MyContainer from "../v4-material/MyContainer";
import "./Footer1.scss";
import Link from "next/link";
import { getContactLink } from "@/utils";
import FacebookIcon from "../icon/FacebookIcon";
import YoutubeIcon from "../icon/YoutubeIcon";
import LinkedinIcon from "../icon/LinkedinIcon";
import InstagramIcon from "../icon/InstagramIcon";
import TwitterIcon from "../icon/TwitterIcon";
const Footer1 = () => {
    let fb = getContactLink("facebook");
    let tw = getContactLink("twitter");
    let yt = getContactLink("youtube");
    let ld = getContactLink("linkedin");
    let ins = getContactLink("instagram");
    return (
        <footer className="footer-1">
            <MyContainer className="footer-1-container">
                <div className="line-1 align-center">
                    <a href="/">
                        <img src="/images/easy-prep/logo-easy-prep.png" width={90} height={24} alt="logo" />
                    </a>
                    <div className="socials">
                        {fb && (
                            <a href={fb}>
                                <FacebookIcon />
                            </a>
                        )}
                        {tw && (
                            <a href={tw}>
                                <TwitterIcon />
                            </a>
                        )}
                        {yt && (
                            <a href={yt}>
                                <YoutubeIcon />
                            </a>
                        )}
                        {ld && (
                            <a href={ld}>
                                <LinkedinIcon />
                            </a>
                        )}
                        {ins && (
                            <a href={ins}>
                                <InstagramIcon />
                            </a>
                        )}
                    </div>
                </div>
                <div className="line-2 align-center">
                    <div className="line-2-option">
                        <Link href={"/contact"} prefetch={false}>
                            Contact
                        </Link>
                        <Link href={"/privacy"} prefetch={false}>
                            Privacy
                        </Link>
                        <Link href={"/legal"} prefetch={false}>
                            Legal
                        </Link>
                    </div>
                    <span>©2024 Easy Prep All Rights Reserved.</span>
                </div>
            </MyContainer>
        </footer>
    );
};

export default Footer1;
