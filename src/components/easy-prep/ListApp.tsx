import React, { useEffect, useRef, useState } from "react";
import "./ListApp.scss";
import { IAppInfo } from "@/models/AppInfo";
import MyContainer from "../v4-material/MyContainer";
import categories from "../../data/categories.json";
import ArrowLeft from "../icon/ArrowLeft";
import { getLink } from "@/utils";
import * as ga from "../../services/ga";
const _MARGIN = 44; // trùng với margin trong scss
const ListApp = ({ listAppInfos }: { listAppInfos: IAppInfo[] }) => {
    const [categorySelected, setCategorySelected] = useState(categories[0]?.id ?? 0);
    const navRef = useRef<HTMLElement>(null);
    let mapAppCategory: { [categoryId: number]: IAppInfo[] } = {};
    for (let app of listAppInfos) {
        if (app.categoryId) {
            if (!mapAppCategory[app.categoryId]) {
                mapAppCategory[app.categoryId] = [];
            }
            mapAppCategory[app.categoryId].push(app);
        }
    }

    const focusCategory = (id: number) => {
        let background = document.getElementById("category-background");
        let category = document.getElementById("category-item-" + id);
        let triangle = document.getElementById("triangle");

        if (category) {
            let width = category.offsetWidth;
            let left = category.offsetLeft;
            if (background) {
                background.style.left = left + "px";
                background.style.width = width + "px";
            }
            if (triangle) {
                triangle.style.marginLeft = `calc(${left}px + ${width / 2}px - 20px)`;
            }
        }
    };

    const scroll = (direction: "left" | "right") => {
        let d = 220;
        let nav = navRef.current;
        if (direction == "left")
            nav.scrollBy({
                left:
                    nav.scrollLeft + d + nav.clientWidth >= nav.scrollWidth
                        ? nav.scrollWidth - nav.scrollLeft - nav.clientWidth
                        : d,
                behavior: "smooth",
            });
        else if (direction == "right")
            nav.scrollBy({ left: nav.scrollLeft - d < 0 ? -nav.scrollLeft : -d, behavior: "smooth" });
    };

    const handleScroll = (loc: "mid" | "left" | "right") => {
        let buttonRight = document.getElementById("slider-right");
        let buttonLeft = document.getElementById("slider-left");
        if (buttonLeft && buttonRight) {
            if (loc === "right") buttonRight.style.display = "none";
            else if (loc === "left") buttonLeft.style.display = "none";
            else {
                buttonRight.style.display = "block";
                buttonLeft.style.display = "block";
            }
        }
    };

    // const [stateSlug, setStateSlug] = useState("");
    // useEffect(() => {
    //     let stateName = localStorage.getItem("stateSlug");
    //     if (stateName?.length) {
    //         setStateSlug(stateName);
    //     }
    // }, []);

    useEffect(() => {
        const element = navRef.current;
        if (element) {
            const _scroll = () => {
                const scrollLeft = element.scrollLeft;
                const scrollWidth = element.scrollWidth;
                const clientWidth = element.clientWidth;
                if (scrollLeft <= 0) {
                    // Detect scroll to left
                    handleScroll("left");
                } else if (scrollLeft + clientWidth >= scrollWidth - _MARGIN) {
                    // Detect scroll to right
                    handleScroll("right");
                } else {
                    handleScroll("mid");
                }
            };
            element.addEventListener("scroll", _scroll);
            return () => element.removeEventListener("scroll", _scroll);
        }
    }, [navRef]);
    return (
        <MyContainer className="list-app-container">
            <h2>Easily Pass Your Exam With Our Practice Tests</h2>
            <div className="category-and-list-app">
                <div className="category-container">
                    <div className="slider-left" id="slider-left">
                        <div className="left-icon align-center" onClick={() => scroll("right")}>
                            <ArrowLeft width={20} height={20} />
                        </div>
                        <div className="blur-gradient-left"></div>
                    </div>
                    <nav ref={navRef} id="nav-category" className="align-center category">
                        {categories.map((category, index) => {
                            return (
                                <div
                                    key={category.id}
                                    id={"category-item-" + category.id}
                                    className={
                                        "category-item align-center " + (categorySelected == category.id ? "active" : "")
                                    }
                                    onClick={(e) => {
                                        if (categorySelected !== category.id) {
                                            setCategorySelected(category.id);
                                            focusCategory(category.id);
                                            if (typeof window !== "undefined" && window.innerWidth < 1024) {
                                                e.currentTarget.scrollIntoView({
                                                    behavior: "smooth",
                                                    block: "nearest",
                                                    inline: "center",
                                                });
                                            }
                                        }
                                        let action = "click_category_block";
                                        if (category.name === "Information Technology") action = "click_it_block";
                                        else if (category.name === "HSE & College Admission") action = "click_hse_block";
                                        else if (category.name === "Medical & Nursing") action = "click_med_block";
                                        else if (category.name === "Drivers Ed") action = "click_driver_block";
                                        else if (category.name === "Careers") action = "click_career_block";
                                        ga.event({
                                            action,
                                            params: { from: window.location.href },
                                        });
                                    }}
                                    style={{ marginLeft: index != 0 ? "10px" : "" }}
                                >
                                    <h3 className="font-14">{category.name}</h3>
                                    <span>{mapAppCategory[category.id].length ?? 0}</span>
                                </div>
                            );
                        })}
                        <div id="category-background" />
                    </nav>
                    <div className="slider-right" id="slider-right">
                        <div className="right-icon align-center" onClick={() => scroll("left")}>
                            <ArrowLeft width={20} height={20} />
                        </div>
                        <div className="blur-gradient-right" />
                    </div>
                    <div className="_blank">
                        <div id="triangle" />
                    </div>
                </div>
                <div className="list-app">
                    {mapAppCategory[categorySelected]
                        ?.sort((a, b) => a.appName.length - b.appName.length)
                        .map((app, index) => {
                            return (
                                <a
                                    className="align-center list-app-item"
                                    key={index}
                                    href={getLink(app, "")}
                                    onClick={(e) => {
                                        ga.event({
                                            action: "click_test_blocks",
                                            params: { app: app.appName },
                                        });
                                    }}
                                >
                                    <div className="font-14 app-name">{app.appName.toUpperCase()}</div>
                                    <div className="font-14 dot">&middot;</div>
                                    <div className="font-14 total-questions">{app.totalQuestion}</div>
                                    <div className="question">Questions</div>
                                </a>
                            );
                        })}
                </div>
            </div>
        </MyContainer>
    );
};

export default ListApp;
