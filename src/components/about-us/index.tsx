"use client";

import useMediaQuery from "@mui/material/useMediaQuery";
import { Fragment, useEffect, useState } from "react";
import CoreValueIcon from "@/components/icon/about/CoreValueIcon";
import DropDown from "@/components/icon/about/DropDown";
import MissionIcon from "@/components/icon/about/MissionIcon";
import VisionIcon from "@/components/icon/about/VisionIcon";
import { getMemberApi } from "@/services/contact.service";
import "../../styles/slick-theme.min.css";
import "../../styles/slick.css";
import "../../styles/slick.min.css";
import "./index.scss";
import { IMember } from "@/models/member-contact/member";

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
            "Deliver expertly designed practice questions, study materials, and reliable support to ensure a smooth and successful journey into the professional driving industry.<br/><br/>",
    },
    {
        title: "Vision",
        color: "#897BFF",
        content:
            "To be the go-to platform for CDL preparation for drivers to be confident, well-prepared, and able to pursue rewarding careers on the road.<br/><br/>",
    },
    {
        title: "Core Value",
        color: "#FFBC3F",
        content:
            "Provide top-quality, accurate, and up-to-date CDL prep resources, make them accessible and affordable to all, and ensure content is reliable, and crafted by experts.<br/><br/>",
    },
];

const AboutUsContainer = () => {
    const isMobile = useMediaQuery("(max-width:768px)");
    const isMobileResize = useMediaQuery("(max-width:1200px)");
    const [isExpanded, setIsExpanded] = useState(false);
    const [listMember, setListMember] = useState<IMember[]>([]);
    useEffect(() => {
        const fetchMembers = async () => {
            const members: IMember[] = await getMemberApi();
            setListMember(handleMember(members));
        };
        fetchMembers();
    }, []);
    const showProfileMember = (memberNameSlug: string) => {
        window.open(`https://cdl-prep.com/author/${memberNameSlug}`, "_blank");
    };
    return (
        <Fragment>
            <div className="about-us-container">
                <div className="about-us-top">
                    <div className="cluster-info-title max-w-component-desktop">
                        <div className="content-about-us">
                            <div className="title">ABOUT US</div>
                            <div className="list-contents" id="list-contents">
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
                                            const timeout = setTimeout(() => {
                                                setIsExpanded(!isExpanded);
                                            }, 100);
                                            return () => clearTimeout(timeout);
                                        }}
                                    >
                                        {isExpanded ? "Show Less" : "Show More"}{" "}
                                        <DropDown isRotated={isExpanded} />
                                    </div>
                                )}
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
                <div className="about-us-bottom">
                    <div className="cluster-intro-about-us max-w-component-desktop">
                        {/* <img src="/images/about/back-line-component.png" alt="" /> */}
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
                            <div
                                className="content"
                                dangerouslySetInnerHTML={{
                                    __html: introAboutUs[0].content,
                                }}
                            />
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
                            <div
                                className="content"
                                dangerouslySetInnerHTML={{
                                    __html: introAboutUs[1].content,
                                }}
                            />
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
                            <div
                                className="content"
                                dangerouslySetInnerHTML={{
                                    __html: introAboutUs[2].content,
                                }}
                            />
                        </div>
                    </div>
                    <div className="meet-the-team max-w-component-desktop">
                        <div className="title-meet-the-team">Meet The Team</div>
                        <div className="members">
                            {listMember.map((item, index) => (
                                <div className="info-member" key={index}>
                                    <div
                                        className="avatar"
                                        onClick={() => {
                                            showProfileMember(
                                                item.user_nicename
                                            );
                                        }}
                                    >
                                        <img src={item.avatar} alt="" />
                                    </div>
                                    <div
                                        className="name"
                                        onClick={() => {
                                            showProfileMember(
                                                item.user_nicename
                                            );
                                        }}
                                    >
                                        {item.name}
                                    </div>
                                    <div className="position">{item.role}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

const handleMember = (memberQueryWp: IMember[]) => {
    const listMember: IMember[] = [
        {
            ID: 100,
            username: "mason-scott@gmail.com",
            email: "mason-scott@gmail.com",
            name: "Mason Scott",
            role: "Project Manager",
            avatar: "/images/about/avatar-mason-scott.png",
            user_nicename: "mason-scott",
        },
        {
            ID: 101,
            username: "alex-martinez@abc-elearning.org",
            email: "alex-martinez@abc-elearning.org",
            name: "Alex Martinez",
            role: "Lead CDL Instructor",
            avatar: "/images/about/avatar-alex-martinez.png",
            user_nicename: "alex-martinez",
        },
        {
            ID: 102,
            username: "james-roberts",
            email: "james-roberts@abc-elearning.org",
            name: "James Roberts",
            role: "Lead Web Developer",
            avatar: "/images/about/avatar-james-roberts.png",
            user_nicename: "james-roberts",
        },
        {
            ID: 103,
            username: "lili-nguyen",
            email: "lili-nguyen@abc-elearning.org",
            name: "Lili Nguyen",
            role: "Content Manager",
            avatar: "/images/about/avatar-lili-nguyen.png",
            user_nicename: "lili-nguyen",
        },
        {
            ID: 104,
            username: "lena-nguyen",
            email: "lena-nguyen@gmail.com",
            name: "Lena Nguyen",
            role: "Content Writer",
            avatar: "/images/about/avatar-lena-nguyen.png",
            user_nicename: "lena-nguyen",
        },
        {
            ID: 105,
            username: "alina-duong",
            email: "alina-duong@gmail.com",
            name: "Alina Duong",
            role: "Content Writer",
            avatar: "/images/about/avatar-alina-duong.png",
            user_nicename: "alina-duong",
        },
        {
            ID: 106,
            username: "morgan-davis",
            email: "morgan-davis@gmail.com",
            name: "Morgan Davis",
            role: "Designer",
            avatar: "/images/about/avatar-morgan-davis.png",
            user_nicename: "morgan-davis",
        },
        {
            ID: 107,
            username: "riley-anderson",
            email: "riley-anderson@gmail.com",
            name: "Riley Anderson",
            role: "Content Writer",
            avatar: "/images/about/avatar-riley-anderson.png",
            user_nicename: "riley-anderson",
        },
        {
            ID: 108,
            username: "sarah-patel",
            email: "sarah-patel@gmail.com",
            name: "Sarah Patel",
            role: "Quality Assurance (QA) Specialist",
            avatar: "/images/about/avatar-sarah-patel.png",
            user_nicename: "sarah-patel",
        },
    ];
    const mapB = new Map(
        memberQueryWp.map((item) => {
            if (item.role == "editor") {
                return [item.name, { ...item, role: "Content Writer" }];
            } else {
                return [item.name, item];
            }
        })
    );
    const mergeArray = listMember.map((item) => {
        if (mapB.has(item.name)) {
            const updatedItem = { ...item, ...mapB.get(item.name) };
            mapB.delete(item.name);
            return updatedItem;
        }
        return item;
    });
    const remainingFromB = Array.from(mapB.values());

    return [...mergeArray, ...remainingFromB];
};
export default AboutUsContainer;
