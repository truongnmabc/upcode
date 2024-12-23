"use client";
import { useState } from "react";
import "./CompleteFreeV0.scss";
import MyContainer from "@/components/container/myContainer";
import LazyLoadImage from "@/components/images";
interface DataType {
    id: number;
    title: string;
    image: string;
    description: string;
}

const listContent: DataType[] = [
    {
        id: 1,
        title: "FREE PRACTICE QUESTIONS",
        image: "images/passemall/completely.png",
        description:
            "We offer free practice questions, so you can practice your test in our web or in any other devices with our available app on Google Play or App Store. No internet connection and no registration required.",
    },
    {
        id: 2,
        title: "3 INTERESTING TEST MODES",
        image: "/images/passemall/interesting.png",
        description:
            "3 different test modes with increases in difficult level let you experience the test in a very exciting way. Let's get accustomed to the format of the real test.",
    },
    {
        id: 3,
        title: "PRACTICE QUESTIONS BY TOPICS",
        image: "/images/passemall/practice.png",
        description:
            "Test your knowledge by practicing by topics exactly as in the real test. Moreover, each topic is also divided into small parts, which helps you get interested in studying, making it a happier study experience and easier to pass.",
    },
    {
        id: 4,
        title: "SPECIAL REVIEW MODE",
        image: "/images/passemall/special.png",
        description:
            "With this feature, you can review which questions you are weak, medium or strong. And this will help you find out where you need to work more and make the most of your study time.",
    },
];

const CompleteFreeV0 = () => {
    const [contentSelected, setContentSelected] = useState(
        listContent[0]?.id ?? 0
    );
    let mapData: { [data: string]: DataType } = {};
    for (const content of listContent) {
        if (content.id) {
            if (!mapData[content.id]) {
                mapData[content.id] = {
                    id: 0,
                    description: "",
                    image: "",
                    title: "",
                };
            }
            mapData[content.id] = content;
        }
    }
    return (
        <>
            <div className="completely-free-V0">
                <MyContainer className="completely-free">
                    <div className="completely-container">
                        <img
                            className="image"
                            src={mapData[contentSelected].image}
                            alt="image"
                        />
                        <div className="completely">
                            {listContent?.map((data, index) => {
                                return (
                                    <div
                                        id={"completely-item-" + data.id}
                                        className={
                                            "completely-item " +
                                            (contentSelected === data.id
                                                ? "active"
                                                : "")
                                        }
                                        key={index + data.image}
                                        onClick={() => {
                                            if (data.id !== contentSelected) {
                                                setContentSelected(data.id);
                                            }
                                        }}
                                        onMouseEnter={() => {
                                            setContentSelected(data.id);
                                        }}
                                    >
                                        <span className="title">
                                            {data.title}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </MyContainer>
                <div className="description-container">
                    <MyContainer>
                        <span>{mapData[contentSelected].description}</span>
                    </MyContainer>
                </div>
            </div>
        </>
    );
};
export default CompleteFreeV0;
