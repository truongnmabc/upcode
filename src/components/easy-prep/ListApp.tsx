import React, { useEffect, useState } from "react";
import "./ListApp.scss";
import { IAppInfo } from "@/models/AppInfo";
import MyContainer from "../v4-material/MyContainer";
import categories from "../../data/categories.json";
import ArrowLeft from "../icon/ArrowLeft";
const ListApp = ({ listAppInfos }: { listAppInfos: IAppInfo[] }) => {
    const [categorySelected, setCategorySelected] = useState(categories[0]?.id ?? 0);
    let mapAppCategory: { [categoryId: number]: IAppInfo[] } = {};
    for (let app of listAppInfos) {
        if (app.categoryId) {
            if (!mapAppCategory[app.categoryId]) {
                mapAppCategory[app.categoryId] = [];
            }
            mapAppCategory[app.categoryId].push(app);
        }
    }
    useEffect(() => {
        focusCategory(categorySelected);
    }, [categorySelected]);
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
        const margin = 44; // trùng với margin của .category ***
        let nav = document.getElementById("nav-category");
        let lastCategory = document.getElementById("category-item-" + categories[categories.length - 1].id);
        let firstCategory = document.getElementById("category-item-" + categories[0].id);
        if (nav && lastCategory && firstCategory) {
            let navWidth = lastCategory.offsetWidth + lastCategory.offsetLeft - firstCategory.offsetLeft;
            let currentLEft = nav.offsetLeft;
            let _d = 0;
            let d = window.innerWidth - 12 - 12 - margin - margin;

            if (direction === "left") {
                if (currentLEft - d + navWidth < d) {
                    _d = d + margin - navWidth - 5; // 5 là margin của nút bấm, k hiểu tsao nó lại có liên quan ở đây nhưng phải thêm vào thì mới cân đối
                } else {
                    _d = currentLEft - d;
                }
            } else if (direction === "right") {
                if (currentLEft + d > margin) {
                    _d = margin;
                } else {
                    _d = currentLEft + d;
                }
            }
            nav.style.marginLeft = _d + "px";
        }
    };
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
                    <nav id="nav-category" className="align-center category">
                        {categories.map((category, index) => {
                            return (
                                <div
                                    key={category.id}
                                    id={"category-item-" + category.id}
                                    className={
                                        "category-item align-center " + (categorySelected == category.id ? "active" : "")
                                    }
                                    onClick={() => {
                                        if (categorySelected !== category.id) setCategorySelected(category.id);
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
                        ?.sort((a, b) => a.appName.localeCompare(b.appName))
                        .map((app, index) => {
                            return (
                                <a className="align-center list-app-item" key={index}>
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
