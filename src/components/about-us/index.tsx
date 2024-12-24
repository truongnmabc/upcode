"use client";
import { Fragment, useEffect, useState } from "react";
import { getMemberApi } from "@/services/contact.service";
import "../../styles/slick-theme.min.css";
import "../../styles/slick.css";
import "../../styles/slick.min.css";
import "./index.scss";
import { IMember } from "@/models/member-contact/member";
import ActivityComponent from "./asvab/activity";
import HeaderComponent from "./asvab/header";
import AboutHeaderCdl from "./cdl/header";
import { IAppInfo } from "@/models/app/appInfo";
import AboutActivityCdl from "./cdl/header/activity";



const AboutUsContainer = ({ appInfo }: { appInfo: IAppInfo }) => {
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
    const renderHeaderAbout = () => {
        switch (appInfo.appName.toLocaleLowerCase()) {
            case "cdl":
                return <AboutHeaderCdl />
            case
                "asvab": return <HeaderComponent appInfo={appInfo} />

        }
    }
    const renderActivityAbout = () => {
        switch (appInfo.appName.toLocaleLowerCase()) {
            case "cdl":
                return <AboutActivityCdl />
            case
                "asvab": return <ActivityComponent />

        }
    }
    return (
        <Fragment>
            <div className="about-us-container">
                {renderHeaderAbout()}

                <div className="about-us-bottom">
                    {renderActivityAbout()}
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
