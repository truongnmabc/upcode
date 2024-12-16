import { IAppInfo } from "@/models/AppInfo";
import React from "react";
import "./AboutLayout.scss";
import MyContainer from "@/components/v4-material/MyContainer";
import dynamic from "next/dynamic";

const Layout1 = dynamic(() => import("@/components/layout/layout-1/Layout1"));
const Layout2 = dynamic(() => import("@/components/layout/layout-2/Layout2"));

const LineDraw = (
    <div className="line-draw flex">
        <svg width="285" height="40" viewBox="0 0 285 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_1511_3275)">
                <path
                    d="M181.534 0.697693C161.338 1.32264 141.154 2.37084 121.004 3.84228C102.718 4.16632 84.4294 4.49037 66.1438 4.81442C46.0794 5.17153 26.0149 5.52534 5.95371 5.88245C4.01273 5.91552 1.00703 7.34066 0.709436 9.49326C0.382082 11.8674 3.31835 12.2642 4.97165 12.2377C18.0096 12.0063 31.0475 11.7748 44.0855 11.5434C38.6593 12.2344 33.2398 12.952 27.8203 13.7026C25.9421 13.9638 23.32 14.8433 22.7215 16.8968C22.1858 18.7286 23.859 20.0281 25.6346 20.0612C55.7446 20.577 85.8578 21.0961 115.968 21.612C122.376 21.7211 128.784 21.8335 135.192 21.9426C125.974 22.9511 116.768 24.1118 107.589 25.4245C93.1952 27.4878 78.861 29.9347 64.5897 32.7222C63.0489 33.0231 60.8632 34.3722 60.6284 36.1015C60.4003 37.7548 62.2222 38.8361 63.6837 38.8493C97.9269 39.1469 132.17 39.4478 166.413 39.7454C176.069 39.8281 185.721 39.914 195.376 39.9967C197.588 40.0165 200.425 39.385 201.539 37.2125C202.535 35.2682 200.67 33.6513 198.768 33.6348C165.805 33.3471 132.841 33.0594 99.8778 32.7718C100.797 32.6329 101.713 32.4907 102.632 32.3551C115.088 30.51 127.587 28.946 140.113 27.6664C165.177 25.107 190.353 23.6819 215.546 23.4008C216.661 23.3876 217.788 23.381 218.912 23.3744C231.682 23.5926 244.449 23.8142 257.219 24.0324C259.428 24.0688 262.275 23.4075 263.383 21.2482C264.401 19.2643 262.497 17.7465 260.612 17.6705C247.581 17.1481 234.536 16.9232 221.495 16.9993C204.423 16.705 187.351 16.414 170.279 16.1197C140.169 15.6039 110.056 15.0847 79.9456 14.5689C77.5186 14.5259 75.0882 14.4862 72.6612 14.4433C88.4271 12.7668 104.219 11.3483 120.032 10.1943C152.995 9.60899 185.962 9.02703 218.926 8.44176C238.99 8.08465 259.055 7.73084 279.116 7.37373C280.957 7.34066 283.662 6.07754 284.214 4.17955C284.757 2.32454 283.07 1.08126 281.301 1.01513C248.06 -0.221543 214.779 -0.330661 181.534 0.697693Z"
                    fill="#FBEB9F"
                />
            </g>
            <defs>
                <clipPath id="clip0_1511_3275">
                    <rect width="283.634" height="40" fill="white" transform="translate(0.682983)" />
                </clipPath>
            </defs>
        </svg>
    </div>
);

const featuresData = [
    {
        img: "images/about/feature-1.png",
        title: "3-Step Practice Formula",
        description:
            "Our highly effective 3-Step Practice Formula is designed to empower users with the knowledge and skills needed to conquer their exams.",
    },
    {
        img: "images/about/feature-2.png",
        title: "Personalized Study Plan",
        description:
            "With advanced algorithms and data-driven insights, we create a customized plan that optimizes users' study efficiency.",
    },
    {
        img: "images/about/feature-3.png",
        title: "Passing Possibility",
        description:
            "Through our analytical methodology, we equip users with valuable insights into their level of preparedness for achieving success.",
    },
];
const AboutLayout = ({
    appInfo,
    listAppInfos,
    isParentApp,
    listTopics,
}: {
    appInfo: IAppInfo;
    listAppInfos: IAppInfo[];
    isParentApp: boolean;
    listTopics: any[];
}) => {
    if (isParentApp)
        return (
            <Layout1 listAppInfos={listAppInfos} appInfo={appInfo}>
                <AboutContent />
            </Layout1>
        );
    return (
        <Layout2 appInfo={appInfo} listTopics={listTopics} tests={[]}>
            <AboutContent />
        </Layout2>
    );
};

const AboutContent = () => {
    return (
        <div className="about-layout-container">
            <div className="background-about-page align-center">
                <p className="p1">About Us</p>
                <p className="p2">
                    Our unwavering mission is to simplify the learning journey for our users, providing them with the tools and
                    resources they need to pass their tests with ease. 
                </p>
            </div>
            <MyContainer className="about-page-content">
                <p className="about-primary-title">Exam Success Guaranteed</p>
                {LineDraw}
                <div className="part-1 flex">
                    <div className="subject-content">
                        <p className="p-title">A Streamlined Path to Attain Desired Certificate</p>
                        <div className="line-color" />
                        <p className="p-description">
                            Our platform offers users a carefully designed pathway that not only facilitates the attainment of
                            their desired certificate but also ensures an effective journey towards achieving their academic or
                            professional goals.
                        </p>
                        <button
                            onClick={() => {
                                window.location.href = "/";
                            }}
                        >
                            <div className="align-center">
                                View more <div className="shape-circle-1" /> <div className="shape-circle-2" />
                            </div>
                        </button>
                    </div>
                    <div className="blank-space" />
                    <img src="/images/about/img1.png" alt="" />
                </div>
                <div className="part-2 flex">
                    <img src="/images/about/img2.png" alt="" />
                    <div className="blank-space" />
                    <div className="subject-content">
                        <p className="p-title">Dedicated Professionals Who Make a Difference</p>
                        <div className="line-color" />
                        <p className="p-description">
                            We take pride in our exceptional team. Each member is a distinguished subject matter expert in their
                            respective fields, equipped with a wealth of knowledge and possessing extensive experience in test
                            preparation.
                        </p>
                    </div>
                </div>
                <div className="part-3 flex">
                    <div className="subject-content">
                        <p className="p-title">A Trusted E-Learning Platform That Exceeds User Expectations</p>
                        <div className="line-color" />
                        <p className="p-description">
                            We are diligently working towards the establishment of a reputable e-learning platform. Through
                            continuous improvement, we strive to create an exceptional learning environment that consistently
                            goes beyond the expectations of our esteemed users.
                        </p>
                        <button
                            onClick={() => {
                                window.location.href = "/";
                            }}
                        >
                            <div className="align-center">
                                View more
                                <div className="shape-circle-1" />
                                <div className="shape-circle-2" />
                            </div>
                        </button>
                    </div>
                    <div className="blank-space" />
                    <img src="/images/about/img3.png" alt="" />
                </div>
                <p className="about-primary-title">Our Features</p>
                {LineDraw}
                <div className="grid-features">
                    {featuresData.map((feature, index) => {
                        return (
                            <div key={index} className="align-center about-feature-item">
                                <img src={feature.img} alt="" height={100} />
                                <p className="feature-title">{feature.title}</p>
                                <p className="feature-description">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </MyContainer>
        </div>
    );
};

export default AboutLayout;
