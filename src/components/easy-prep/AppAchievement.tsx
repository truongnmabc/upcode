import React from "react";
import "./AppAchievement.scss";
import CertificateIcon from "../icon/CertificateIcon";
import UsersIcon from "../icon/UsersIcon";
import LikeIcon from "../icon/LikeIcon";
import StarIcon from "../icon/StartIcon";
const achievements = [
    {
        title: <>80+ Certificates</>,
        description: "have been covered, which includes most of the common ones",
        icon: <CertificateIcon />,
    },
    {
        title: <>90.000 users/Month</>,
        description: "trust us and continue using our system for their upcoming tests",
        icon: <UsersIcon />,
    },
    {
        title: (
            <>
                <span style={{ marginBottom: -4 }}>4.9/5</span> <StarIcon />
            </>
        ),
        description: "average rating on both Google and Apple stores",
        icon: <LikeIcon />,
    },
];
const AppAchievement = () => {
    return (
        <div className="app-archivement-container">
            <div className="grid-achievement">
                {achievements.map((arc, index) => (
                    <div className="achievement-item" key={index}>
                        <div className="achievement-icon align-center">{arc.icon}</div>
                        <div>
                            <div className="achievement-title align-center">{arc.title}</div>
                            <div className="achievement-description">{arc.description}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AppAchievement;
