import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
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
    {
        imageName: "medtutors-screenshot.png",
        imageBackground: "medtutors-background.png",
        name: "Medtutors",
        url: "https://medtutor.org",
    },
    {
        imageName: "testshub-screenshot.png",
        imageBackground: "testshub-background.png",
        name: "Testshub",
        url: "https://tests-hub.com",
    },
    {
        imageName: "worksheet-screenshot.png",
        imageBackground: "worksheetzone-background.png",
        name: "worksheet",
        url: "https://worksheetzone.org",
    },
];
const AboutUsContainer = ({ appInfo }: { appInfo: IAppInfo }) => {
    const router = useRouter();
    // const isMobile = useMediaQuery("(max-width:780px)");
    // const width = isMobile ? "132" : "150";
    // const height = isMobile ? "41" : "100";
    const getSrcLogo = () => {
        let logo = `/images/${APP_SHORT_NAME}/logo-dark.png`;
        return logo;
    };
    return (
        <div className="about-us-container">
            <div className="about-us-header">
                <Container sx={{ zIndex: 1, position: "relative" }}>
                    <div className="logo-and-contact">
                        <Link href="/">
                            <img src={getSrcLogo()} alt={"logo-" + APP_SHORT_NAME} />
                        </Link>
                        <Button variant="text" className="contacts-btn" onClick={() => router.push(Routes.CONTACTS)}>
                            Contacts
                        </Button>
                    </div>
                    <h1 className="title-about-us">ABOUT US</h1>
                    <p className="description-header">ABC E-learning: Simplify your learning</p>
                    <Button variant="text" className="contacts-bottom" onClick={() => router.push(Routes.CONTACTS)}>
                        Contacts
                    </Button>
                </Container>
                <div className="background-header"></div>
            </div>
            <OurTeamSection></OurTeamSection>
            <WhoWeAre></WhoWeAre>
            <WhatWeHave></WhatWeHave>
            <LearningNetwork></LearningNetwork>
            <Footer1 appInfo={appInfo}></Footer1>
        </div>
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
                        easily pass their coming tests, and get a brighter future.
                    </p>
                    <p>
                        We are used to be candidates who wasted time and efforts with boring books and crowded classrooms. Based
                        on our own needs, we create a new learning system that bring convenience and higher effectiveness.
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
