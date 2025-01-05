"use client";
import Image from "next/image";
import React from "react";
import Slider from "react-slick";
import "@/styles/slick.css";
import "@/styles/slick.min.css";
import "@/styles/slick-theme.min.css";
import feedback from "@/data/feedback.json";
import "./SliderWidgetV0.scss";
import MyContainer from "@/components/container";
import { DotsSVG } from "@/asset/icon/dots";
const SliderFeedBack = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };
    return (
        <div className="slider-component-v0">
            <div className="only-dots">
                <DotsSVG />
            </div>
            <MyContainer className="slider-v0">
                <Slider {...settings}>
                    {feedback.map((data, index) => {
                        return (
                            <div
                                key={index + data.avatar}
                                className="slider-comment"
                            >
                                <div className="slider-container">
                                    <p>{data.content}</p>
                                    <svg
                                        className="slider-double-quotes"
                                        width="52"
                                        height="41"
                                        viewBox="0 0 52 41"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M27.7 40.2H50.4V17.2H41.8C41.8 12.1 45 9.1 51.5 8.3L49.7 0C36.6 0.5 27.7 6.1 27.7 21.9V40.2ZM0 40.2H22.7V17.2H14.1C14.1 12.1 17.3 9.1 23.8 8.3L22 0C8.9 0.5 0 6.1 0 21.9V40.2Z"
                                            fill="var(--main-color-bold)"
                                        />
                                    </svg>
                                </div>
                                <div className="slider-frame">
                                    <Image
                                        src={data.avatar}
                                        alt="avatar"
                                        className="frame"
                                        width="72"
                                        height="72"
                                    />
                                </div>
                                <p className="userName">{data.userName}</p>
                            </div>
                        );
                    })}
                </Slider>
            </MyContainer>
            <div className="group-dots">
                <DotsSVG />
                <DotsSVG />
            </div>
        </div>
    );
};
export default SliderFeedBack;
