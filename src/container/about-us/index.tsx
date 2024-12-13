import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import dataAboutUs from "../../data/about-us-member.json";
// import SectionFooter from "../../components/SectionHome/SectionFooter/SectionFooter";
import "./index.scss";
import { IAppInfo } from "../../models/AppInfo";
import Routes from "@/config/routes";
import Link from "next/link";
import { APP_SHORT_NAME } from "@/config_app";
import Footer1 from "@/components/footer/Footer1";
import MyContainer from "@/components/v4-material/MyContainer";
import "../../styles/slick.css";
import "../../styles/slick.min.css";
import "../../styles/slick-theme.min.css";
import Layout2 from "@/components/layout/layout-2/Layout2";
import CoreValueIcon from "@/components/icon/about/CoreValueIcon";
import MissionIcon from "@/components/icon/about/MissionIcon";
import VisionIcon from "@/components/icon/about/VisionIcon";
import MemberAbout from "../../data/about-us-member.json";
import DropDown from "@/components/icon/about/DropDown";
const urlStorage = "https://storage.googleapis.com/micro-enigma-235001.appspot.com/about-us";
const listApp = [
    {
        imageName: "asvab-screenshot.png",
        imageBackground: "asvab-background.png",
        name: "ASVAB",
        url: "https://asvab-prep.com",
    },
    {
        imageName: "cdl-screenshot.png",
        imageBackground: "cdl-background.png",
        name: "CDL",
        url: "https://cdl-prep.com",
    },
    {
        imageName: "dmv-screenshot.png",
        imageBackground: "dmv-background.png",
        name: "DMV",
        url: "https://dmv-practicetests.com",
    },
    {
        imageName: "passemall-screenshot.png",
        imageBackground: "passemall-background.png",
        name: "Passemall",
        url: "https://passemall.com",
    },
    {
        imageName: "ged-screenshot.png",
        imageBackground: "ged-background.png",
        name: "GED",
        url: "https://ged-testprep.com",
    },
    {
        imageName: "teas-screenshot.png",
        imageBackground: "teas-background.png",
        name: "TEAS",
        url: "https://teas-prep.com",
    },
    {
        imageName: "servsafe-screenshot.png",
        imageBackground: "servsafe-background.png",
        name: "SERVSAFE",
        url: "https://servsafe-prep.com",
    },
    {
        imageName: "real-estate-screenshot.png",
        imageBackground: "real-estate-background.png",
        name: "Real Estate",
        url: "https://realestate-prep.com",
    },
    {
        imageName: "pmp-screenshot.png",
        imageBackground: "pmp-background.png",
        name: "PMP",
        url: "https://pmp-testprep.com",
    },
    {
        imageName: "ptce-screenshot.png",
        imageBackground: "ptce-background.png",
        name: "PTCE",
        url: "https://ptceprep.com",
    },
    {
        imageName: "aws-screenshot.png",
        imageBackground: "aws-background.png",
        name: "AWS",
        url: "https://aws-prep.com",
    },
    {
        imageName: "driving-theory-screenshot.png",
        imageBackground: "driving-theory-background.png",
        name: "driving Theory",
        url: "https://drivingtheory-tests.com",
    },
    {
        imageName: "cna-screenshot.png",
        imageBackground: "cna-background.png",
        name: "CNA",
        url: "https://cna-prep.com",
    },
    // {
    //     imageName: "medtutors-screenshot.png",
    //     imageBackground: "medtutors-background.png",
    //     name: "Medtutors",
    //     url: "https://medtutor.org",
    // },
    // {
    //     imageName: "testshub-screenshot.png",
    //     imageBackground: "testshub-background.png",
    //     name: "Testshub",
    //     url: "https://tests-hub.com",
    // },
    {
        imageName: "worksheet-screenshot.png",
        imageBackground: "worksheetzone-background.png",
        name: "worksheet",
        url: "https://worksheetzone.org",
    },
];
const contentPreview = [
    "Welcome to CDL Prep, owned by ABC Elearning.\n<span></span>\nCDL Prep is a trusted resource designed to help you pass your Commercial Driver’s License exams. Our platform offers expertly crafted practice questions, and insightful blog posts on CDL topics, requirements, and regulations.\n <span></span>\nCDL Prep is here to support your learning journey with resources that are accessible, effective, and tailored to help you succeed in your CDL career in your state.",
];
const listRecord = [
    {
        summary: "6 Years of Establishment",
        contentR: "With 6+ years of experience, CDL Prep has supported aspiring drivers in their test preparation.",
    },
    {
        summary: "1.4M+ Users",
        contentR: "More than 200.000 users have trusted CDL Prep for comprehensive and effective CDL practice tests.",
    },
    {
        summary: "96% Passing Rate",
        contentR: "Our users have achieved a 96% passing rate, a testament to our quality and effectiveness.",
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
    const router = useRouter();
    const isMobile = useMediaQuery("(max-width:768px)");
    const isMobileResize = useMediaQuery("(max-width:1200px)");

    // const width = isMobile ? "132" : "150";
    // const height = isMobile ? "41" : "100";
    const getSrcLogo = () => {
        let logo = `/images/${APP_SHORT_NAME}/logo-dark.png`;
        return logo;
    };
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Layout2 appInfo={appInfo} listTopics={[]} tests={[]}>
            <div className="about-us-container">
                <div className="about-us-top">
                    <div className="cluster-info-title max-w-component-desktop">
                        <div className="content-about-us">
                            <div className="title">ABOUT US</div>
                            <div className="list-contents" id="list-contents">
                                {/* {contentPreview.map((content, index) => ( */}
                                <div
                                    className={"content " + (isExpanded ? "show" : "hide")}
                                    dangerouslySetInnerHTML={{ __html: contentPreview }}
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
                                        {isExpanded ? "Show Less" : "Show More"} <DropDown isRotated={isExpanded} />
                                    </div>
                                )}
                                {/* ))} */}
                            </div>
                        </div>
                        <div className="list-records">
                            {listRecord.map((record, index) => (
                                <div className="record" key={index} id={`record-about-us-${index}`}>
                                    <div className="summary">{record.summary}</div>
                                    <div className="content">{record.contentR}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="about-us-bottom">
                    <div className="cluster-intro-about-us max-w-component-desktop">
                        {/* <img src="/images/about/back-line-component.png" alt="" /> */}
                        <div className="item-intro intro-1">
                            {!isMobileResize && <img src="/images/about/line-1.png" alt="" />}
                            <MissionIcon />
                            <div className="title" style={{ backgroundColor: introAboutUs[0].color }}>
                                {introAboutUs[0].title}
                            </div>
                            <div className="content">{introAboutUs[0].content}</div>
                        </div>
                        <div className="item-intro intro-2">
                            {!isMobileResize && <img src="/images/about/line-2.png" alt="" />}
                            <VisionIcon />
                            <div className="title" style={{ backgroundColor: introAboutUs[1].color }}>
                                {introAboutUs[1].title}
                            </div>
                            <div className="content">{introAboutUs[1].content}</div>
                        </div>
                        <div className="item-intro intro-3">
                            {!isMobileResize && <img src="/images/about/line-3.png" alt="" />}
                            <CoreValueIcon />
                            <div className="title" style={{ backgroundColor: introAboutUs[2].color }}>
                                {introAboutUs[2].title}
                            </div>
                            <div className="content">{introAboutUs[2].content}</div>
                        </div>
                    </div>
                    <div className="meet-the-team max-w-component-desktop">
                        <div className="title-meet-the-team">Meet The Team</div>
                        <div className="members">
                            {MemberAbout.map((item, index) => (
                                <div className="info-member" key={index}>
                                    <div className="avatar">
                                        <img src="/images/about/hello-there-avatar.png" alt="" />
                                    </div>
                                    <div className="name">{item.name}</div>
                                    <div className="position">{item.position}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout2>
    );
};

const OurTeamSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const sliderRef = useRef(null);
    const isDesktop = useMediaQuery("(min-width:769px)");
    const settings = {
        arrows: false,
        autoplaySpeed: 5000,
        centerMode: true,
        centerPadding: "0px",
        className: "body-content-slider",
        slideToShow: 1,
        slideToScroll: 1,
        dots: false,
        infinite: false,
        beforeChange: (current, next) => {
            setCurrentSlide(next);
        },
    };

    const goToNext = () => {
        if (sliderRef.current !== null) {
            sliderRef.current.slickNext();
        }
    };
    const goToPrev = () => {
        if (sliderRef.current !== null) {
            sliderRef.current.slickPrev();
        }
    };
    return (
        <>
            <div className="our-team-in-about-us-v0">
                <MyContainer>
                    <h2 className="title-our-team">Our Team</h2>
                    {isDesktop ? (
                        <div className="list-people-our-team">
                            {dataAboutUs.map((member, index) => {
                                return (
                                    <div className="item-people-our-team" key={index + member.name}>
                                        <img src={`${urlStorage}/people-${index + 1}.png`} className="image-people-our-team" />
                                        <div className="hover-container-item-our-team">
                                            <p className="name-people-our-team">{member.name}</p>
                                            <p className="position-people-our-team">{member.position}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="slider-people-our-team-mobile">
                            <Slider {...settings} ref={sliderRef}>
                                {dataAboutUs.map((member, index) => {
                                    return (
                                        <div className="item-people-our-team-mobile" key={index + member.name}>
                                            <img
                                                src={`${urlStorage}/people-${index + 1}.png`}
                                                className="image-people-our-team-mobile"
                                            />
                                            <div className="hover-container-item-our-team-mobile">
                                                <p className="name-people-our-team-mobile">{member.name}</p>
                                                <p className="position-people-our-team-mobile">{member.position}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </Slider>
                            <div className="slick-action-our-team">
                                <div
                                    onClick={goToPrev}
                                    style={{
                                        backgroundColor: `${currentSlide + 1 === 1 ? "rgba(33, 33, 33, .08)" : "#212121"}`,
                                    }}
                                    className="button-prev-our-team"
                                >
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M9.9048 13.0286L5.76511 8.8889C5.27622 8.40001 5.27622 7.60001 5.76511 7.11112L9.9048 2.97144"
                                            stroke="#fff"
                                            strokeWidth="2"
                                            strokeMiterlimit="10"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        ></path>
                                    </svg>
                                </div>
                                <span>
                                    {currentSlide + 1} of {dataAboutUs.length}
                                </span>
                                <div
                                    onClick={goToNext}
                                    className="button-next-our-team"
                                    style={{
                                        backgroundColor: `${
                                            currentSlide + 1 === dataAboutUs.length ? "rgba(33, 33, 33, .08)" : "#212121"
                                        }`,
                                    }}
                                >
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M9.9048 13.0286L5.76511 8.8889C5.27622 8.40001 5.27622 7.60001 5.76511 7.11112L9.9048 2.97144"
                                            stroke="#fff"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )}
                </MyContainer>
            </div>
        </>
    );
};

const WhoWeAre = () => {
    return (
        <Container>
            <Grid container className="who-we-are-section">
                <Grid item lg={6} xs={12}>
                    <img src={`${urlStorage}/who_we_are.png`} alt="who-we-are"></img>
                </Grid>
                <Grid item lg={6} xs={12} className="description-section">
                    <h2>Who we are</h2>
                    <p>
                        Hi there, we&apos;re ABC E-learning. We help test-takers <span>simplify their learning process</span>,
                        easily pass their upcoming tests, and get a brighter future.
                    </p>
                    <p>
                        We used to be candidates who wasted time and efforts with boring books and crowded classrooms. Based on
                        our own needs, we have created a new learning system that brings convenience and higher effectiveness.
                    </p>
                </Grid>
            </Grid>
        </Container>
    );
};
const WhatWeHave = () => {
    const isMobile = useMediaQuery("(max-width:780px)");
    return (
        <div className="what-we-have-section">
            <Container>
                <h2 className="title-section">What we Have</h2>
                <div className="image-container">
                    <img
                        src={`${urlStorage}/what_we_have${isMobile ? "_mobile" : ""}.png`}
                        className="main-image"
                        alt="what-we-have"
                    ></img>
                    {!isMobile && (
                        <>
                            <div className="icon-anim e-learning">
                                <img src={`${urlStorage}/e-learning-icon-anim.png`} className="image-background"></img>
                            </div>
                            <div className="icon-anim test-maker">
                                <img src={`${urlStorage}/test-maker-icon-anim.png`} className="image-background"></img>
                            </div>
                            <div className="icon-anim app">
                                <img src={`${urlStorage}/app-icon-anim.png`} className="image-background"></img>
                            </div>
                            <div className="icon-anim web">
                                <img src={`${urlStorage}/web-icon-anim.png`} className="image-background"></img>
                            </div>
                        </>
                    )}
                </div>
            </Container>
        </div>
    );
};
const LearningNetwork = () => {
    return (
        <Container className="learning-network-section">
            <h2>ABC E-learning Network</h2>
            <Grid container spacing={3} className="list-web">
                {listApp.map((item, index) => {
                    return (
                        <Grid item xs={12} lg={4} md={6} key={item.name + "-" + index}>
                            <a href={item.url} target="_blank" rel="noreferrer">
                                <div
                                    className="image-container"
                                    style={{
                                        backgroundImage: `url(${urlStorage}/${item.imageBackground})`,
                                        backgroundSize: "contain",
                                        backgroundRepeat: "no-repeat",
                                    }}
                                >
                                    <img src={urlStorage + "/" + item.imageName}></img>
                                </div>
                            </a>
                        </Grid>
                    );
                })}
            </Grid>
        </Container>
    );
};
export default AboutUsContainer;
