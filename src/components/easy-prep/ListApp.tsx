import React, { useEffect, useRef, useState } from "react";
import "./ListApp.scss";
import { IAppInfo } from "@/models/AppInfo";
import MyContainer from "../v4-material/MyContainer";
import categories from "../../data/categories.json";
import ArrowLeft from "../icon/ArrowLeft";
import { getLink } from "@/utils";
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
        let nav = navRef.current;
        if (direction == "left") nav.scrollBy({ left: 220, behavior: "smooth" });
        else if (direction == "right") nav.scrollBy({ left: -220, behavior: "smooth" });
    };

    const [stateSlug, setStateSlug] = useState("");
    useEffect(() => {
        let stateName = localStorage.getItem("stateSlug");
        if (stateName?.length) {
            setStateSlug(stateName);
        }
    }, []);

    return (
        <MyContainer className="list-app-container">
            <h2>Easily Pass Your Exam With Our Practice Tests</h2>
            <div className="category-and-list-app">
                <div className="category-container">
                    <div className="slider-left">
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
                    <div className="slider-right">
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
                                <a className="align-center list-app-item" key={index} href={getLink(app, stateSlug)}>
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
