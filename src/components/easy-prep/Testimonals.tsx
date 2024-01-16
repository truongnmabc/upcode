import React from "react";
import MyContainer from "../v4-material/MyContainer";
import Slider from "react-slick";
import testimonals from "../../data/testimonals.json";
import { APP_SHORT_NAME } from "@/config_app";
import "./Testimonals.scss";
import ArrowLeft from "../icon/ArrowLeft";
import { useRef } from "react";
import { useState } from "react";

const slidesToShow = 2;
const slidesToScroll = 2;
const initialSlide = 0;
const settings = {
    dots: false,
    infinite: false,
    initialSlide: initialSlide,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: slidesToScroll,
    nextArrow: <></>,
    prevArrow: <></>,
};

const Testimonals = () => {
    const ref = useRef(null);
    const [currentSlide, setCurrentSlide] = useState(initialSlide);
    return (
        <MyContainer className="testimonals-container">
            <h2>Testimonals</h2>
            <div className="testimonial">
                <Slider
                    ref={ref}
                    {...settings}
                    afterChange={(v) => {
                        setCurrentSlide(v);
                    }}
                >
                    {testimonals.map((ele, index) => {
                        return (
                            <div key={index} className="testimonial-item">
                                <svg
                                    className="testimonial-double-quotes"
                                    width="41"
                                    height="26"
                                    viewBox="0 0 41 26"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M20.3814 20.8536C25.4968 17.5586 15.1817 19.8501 13.1309 2.17829C11.3862 -5.06 2.90612 11.9334 5.7714 15.3264C6.7674 21.0517 13.9234 24.1249 20.3814 20.8536ZM10.1234 4.08483C9.85438 4.70982 9.57363 5.36197 9.32493 5.97617C9.594 5.35118 9.86305 4.72621 10.1234 4.08483ZM8.27467 8.5253C8.1724 8.7263 8.08751 8.96008 8.00561 9.15029C8.0992 8.9329 8.18108 8.74269 8.27467 8.5253ZM11.4075 5.37743C11.2992 5.66555 11.4915 6.57088 11.2821 6.61876C11.3878 6.22712 11.389 5.78589 11.4075 5.37743ZM16.1176 17.6762C15.955 17.6154 15.3597 17.427 15.7438 17.2656C15.915 17.3428 16.6076 18.1093 16.1176 17.6762ZM7.76212 13.2237C7.71731 12.597 7.80813 13.4091 7.89488 13.573C7.87292 14.1721 7.53761 13.4894 7.76212 13.2237ZM14.4427 19.0453C13.5796 19.0406 13.0605 18.602 12.6901 18.0007C13.2919 17.955 14.9765 19.4132 14.4427 19.0453ZM18.677 20.2451C17.0592 20.9335 12.8297 21.2209 11.993 19.9852C14.2159 20.1935 16.2874 20.4608 18.677 20.2451ZM8.3721 16.5935C8.18953 16.3964 8.11606 15.617 8.58873 16.0173C9.04667 16.4882 9.06085 17.6977 8.3721 16.5935ZM10.4925 14.8837C9.72231 13.8227 10.6353 13.6751 10.8623 14.646C10.9271 15.409 10.2783 14.5775 10.4925 14.8837ZM12.3156 11.38C12.3013 11.3037 12.2375 11.2325 12.2899 11.1838C12.5933 10.7714 12.7392 11.6384 12.3156 11.38ZM9.82026 11.9874C9.68672 11.9322 9.62863 11.921 9.81199 11.8239L9.82026 11.9874Z"
                                        fill="#212121"
                                    />
                                    <path
                                        d="M38.3071 20.8536C43.4225 17.5586 33.1074 19.8501 31.0566 2.17829C29.3119 -5.06 20.8318 11.9334 23.6971 15.3264C24.6931 21.0517 31.8491 24.1249 38.3071 20.8536ZM28.0492 4.08483C27.7801 4.70982 27.4994 5.36197 27.2507 5.97617C27.5197 5.35118 27.7888 4.72621 28.0492 4.08483ZM26.2004 8.5253C26.0981 8.7263 26.0132 8.96008 25.9313 9.15029C26.0249 8.9329 26.1068 8.74269 26.2004 8.5253ZM29.3332 5.37743C29.2249 5.66555 29.4172 6.57088 29.2078 6.61876C29.3135 6.22712 29.3147 5.78589 29.3332 5.37743ZM34.0433 17.6762C33.8807 17.6154 33.2854 17.427 33.6695 17.2656C33.8408 17.3428 34.5333 18.1093 34.0433 17.6762ZM25.6878 13.2237C25.643 12.597 25.7339 13.4091 25.8206 13.573C25.7986 14.1721 25.4633 13.4894 25.6878 13.2237ZM32.3685 19.0453C31.5053 19.0406 30.9862 18.602 30.6158 18.0007C31.2176 17.955 32.9023 19.4132 32.3685 19.0453ZM36.6027 20.2451C34.9849 20.9335 30.7554 21.2209 29.9188 19.9852C32.1416 20.1935 34.2131 20.4608 36.6027 20.2451ZM26.2978 16.5935C26.1153 16.3964 26.0418 15.617 26.5144 16.0173C26.9724 16.4882 26.9866 17.6977 26.2978 16.5935ZM28.4183 14.8837C27.648 13.8227 28.561 13.6751 28.788 14.646C28.8528 15.409 28.204 14.5775 28.4183 14.8837ZM30.2413 11.38C30.227 11.3037 30.1632 11.2325 30.2157 11.1838C30.519 10.7714 30.6649 11.6384 30.2413 11.38ZM27.746 11.9874C27.6124 11.9322 27.5544 11.921 27.7377 11.8239L27.746 11.9874Z"
                                        fill="#212121"
                                    />
                                </svg>
                                <p className="testimonial-feedback">{ele.content.replace(/CDL/g, APP_SHORT_NAME)}</p>
                                <p className="userName">{ele.userName}</p>
                            </div>
                        );
                    })}
                </Slider>
                <div className="align-center slick-action">
                    <div
                        onClick={() => {
                            if (currentSlide != 0) ref.current.slickPrev();
                        }}
                        className={"prev-arrow " + (currentSlide === 0 ? " disabled" : "")}
                    >
                        <ArrowLeft color="#fff" />
                    </div>
                    <span>{`${currentSlide} of ${testimonals.length}`}</span>

                    <div
                        onClick={() => {
                            if (currentSlide + slidesToScroll < testimonals.length) ref.current.slickNext();
                        }}
                        className={"next-arrow " + (currentSlide + slidesToScroll === testimonals.length ? " disabled" : "")}
                    >
                        <ArrowLeft color="#fff" />
                    </div>
                </div>
            </div>
        </MyContainer>
    );
};

export default Testimonals;
