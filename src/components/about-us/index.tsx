"use client";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Fragment, useState } from "react";
import CoreValueIcon from "@/components/icon/about/CoreValueIcon";
import DropDown from "@/components/icon/about/DropDown";
import MissionIcon from "@/components/icon/about/MissionIcon";
import VisionIcon from "@/components/icon/about/VisionIcon";
import MemberAbout from "../../data/about-us-member.json";
import "../../styles/slick-theme.min.css";
import "../../styles/slick.css";
import "../../styles/slick.min.css";
import "./index.scss";
import { IAppInfo } from "@/models/app/appInfo";

const contentPreview = [
    "Welcome to CDL Prep, owned by ABC Elearning.\n<span></span>\nCDL Prep is a trusted resource designed to help you pass your Commercial Driver’s License exams. Our platform offers expertly crafted practice questions, and insightful blog posts on CDL topics, requirements, and regulations.\n <span></span>\nCDL Prep is here to support your learning journey with resources that are accessible, effective, and tailored to help you succeed in your CDL career in your state.",
];
const listRecord = [
    {
        summary: "6 Years of Establishment",
        contentR:
            "With 6+ years of experience, CDL Prep has supported aspiring drivers in their test preparation.",
    },
    {
        summary: "1.4M+ Users",
        contentR:
            "More than 200.000 users have trusted CDL Prep for comprehensive and effective CDL practice tests.",
    },
    {
        summary: "96% Passing Rate",
        contentR:
            "Our users have achieved a 96% passing rate, a testament to our quality and effectiveness.",
    },
];
const introAboutUs = [
    {
        title: "Mission",
        color: "#FF6E65",
        content:
            "Deliver expertly designed practice questions, study materials, and reliable support to ensure a smooth and successful journey into the professional driving industry.",
    },
    {
        title: "Vision",
        color: "#897BFF",
        content:
            "To be the go-to platform for CDL preparation for drivers to be confident, well-prepared, and able to pursue rewarding careers on the road.",
    },
    {
        title: "Core Value",
        color: "#FFBC3F",
        content:
            "Provide top-quality, accurate, and up-to-date CDL prep resources, make them accessible and affordable to all, and ensure content is reliable, and crafted by experts",
    },
];
const AboutUsContainer = ({ appInfo }: { appInfo: IAppInfo }) => {
    const isMobile = useMediaQuery("(max-width:768px)");
    const isMobileResize = useMediaQuery("(max-width:1200px)");
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Fragment>
            <div className="about-us-container">
                <div className="bg-us-container">
                    <div className="about-us-top max-w-page mx-auto">
                        <div className="cluster-info-title max-w-component-desktop">
                            <div className="content-about-us">
                                <div className="title">ABOUT US</div>
                                <div
                                    className="list-contents"
                                    id="list-contents"
                                >
                                    <div
                                        className={
                                            "content " +
                                            (isExpanded ? "show" : "hide")
                                        }
                                        dangerouslySetInnerHTML={{
                                            __html: contentPreview,
                                        }}
                                    />
                                    {isMobile && (
                                        <div
                                            className="show-more"
                                            onClick={() => {
                                                const timeout = setTimeout(
                                                    () => {
                                                        setIsExpanded(
                                                            !isExpanded
                                                        );
                                                    },
                                                    100
                                                );
                                                return () =>
                                                    clearTimeout(timeout);
                                            }}
                                        >
                                            {isExpanded
                                                ? "Show Less"
                                                : "Show More"}{" "}
                                            <DropDown isRotated={isExpanded} />
                                        </div>
                                    )}
                                    {/* ))} */}
                                </div>
                            </div>
                            <div className="list-records">
                                {listRecord.map((record, index) => (
                                    <div
                                        className="record"
                                        key={index}
                                        id={`record-about-us-${index}`}
                                    >
                                        <div className="summary">
                                            {record.summary}
                                        </div>
                                        <div className="content">
                                            {record.contentR}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="about-us-bottom max-w-page mx-auto">
                    <div className="cluster-intro-about-us max-w-component-desktop">
                        <div className="item-intro intro-1">
                            {!isMobileResize && (
                                <img src="/images/about/line-1.png" alt="" />
                            )}
                            <MissionIcon />
                            <div
                                className="title"
                                style={{
                                    backgroundColor: introAboutUs[0].color,
                                }}
                            >
                                {introAboutUs[0].title}
                            </div>
                            <div className="content">
                                {introAboutUs[0].content}
                            </div>
                        </div>
                        <div className="item-intro intro-2">
                            {!isMobileResize && (
                                <img src="/images/about/line-2.png" alt="" />
                            )}
                            <VisionIcon />
                            <div
                                className="title"
                                style={{
                                    backgroundColor: introAboutUs[1].color,
                                }}
                            >
                                {introAboutUs[1].title}
                            </div>
                            <div className="content">
                                {introAboutUs[1].content}
                            </div>
                        </div>
                        <div className="item-intro intro-3">
                            {!isMobileResize && (
                                <img src="/images/about/line-3.png" alt="" />
                            )}
                            <CoreValueIcon />
                            <div
                                className="title"
                                style={{
                                    backgroundColor: introAboutUs[2].color,
                                }}
                            >
                                {introAboutUs[2].title}
                            </div>
                            <div className="content">
                                {introAboutUs[2].content}
                            </div>
                        </div>
                    </div>
                    <div className="meet-the-team max-w-component-desktop">
                        <div className="title-meet-the-team">Meet The Team</div>
                        <div className="members">
                            {MemberAbout.map((item, index) => (
                                <div className="info-member" key={index}>
                                    <div className="avatar">
                                        <img
                                            src="/images/about/hello-there-avatar.png"
                                            alt=""
                                        />
                                    </div>
                                    <div className="name">{item.name}</div>
                                    <div className="position">
                                        {item.position}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default AboutUsContainer;
