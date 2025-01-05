"use client";

import { IAppInfo } from "@/models/app/appInfo";
import "./AppsSectionV0.scss";
import { useEffect, useRef, useState } from "react";
import MyContainer from "@/components/container";
import { useIsMobile } from "@/hooks/useIsMobile";
import categoriesPassemall from "@/data/categoriesPassemall.json";
import { useRouter } from "next/navigation";

interface CategoriesType {
    [categoryId: number]: IAppInfo[];
}
const AppsSectionV0 = ({ listAppInfo }: { listAppInfo: IAppInfo[] }) => {
    const [categorySelected, setCategorySelected] = useState(
        categoriesPassemall[0]?.id ?? 0
    );
    const isMobile = useIsMobile();
    const itemRef = useRef<HTMLDivElement>(null);
    let mapAppCategory: CategoriesType = {};
    for (const app of listAppInfo) {
        if (app.categoryId) {
            if (!mapAppCategory[app.categoryId]) {
                mapAppCategory[app.categoryId] = [];
            }
            mapAppCategory[app.categoryId].push(app);
        }
    }
    const focusCategory = (id: number) => {
        const category = document.getElementById("category-app-item-" + id);
        const triangle = document.getElementById("triangle");

        if (category) {
            const width = category.offsetWidth;
            const left = category.offsetLeft;
            if (triangle) {
                triangle.style.marginLeft = `calc(${left}px + ${
                    width / 2
                }px - 20px - 6px)`; // 20px là 1/2 with của icon tam giác , 6px là padding left của parent element
            }
        }
    };
    return (
        <>
            <div className="apps-section-v0">
                <MyContainer className="container-apps-section-v0">
                    <div className="title-apps-section-web">
                        Easily <span className="text-edit">Pass Your Exam</span>{" "}
                        With Our Practice Tests
                    </div>
                    <div className="title-apps-section-mobile">
                        Exam Prep Built To Help You{" "}
                        <span className="text-edit">Pass</span>
                    </div>
                    <div className="content-apps-section-v0">
                        {categoriesPassemall.map((category, index) => {
                            return (
                                <div
                                    className="container-category-app-v0"
                                    key={index + category.icon}
                                    ref={itemRef}
                                >
                                    <ListCategory
                                        category={category}
                                        categorySelected={categorySelected}
                                        onClick={() => {
                                            if (itemRef.current && !isMobile) {
                                                itemRef.current.scrollIntoView({
                                                    behavior: "smooth",
                                                    block: "start",
                                                });
                                            }
                                            if (
                                                categorySelected !== category.id
                                            ) {
                                                setCategorySelected(
                                                    category.id
                                                );
                                                focusCategory(category.id);
                                            } else {
                                                if (isMobile) {
                                                    setCategorySelected(null);
                                                    focusCategory(null);
                                                }
                                            }
                                        }}
                                    />
                                    {categorySelected === index + 1 ? (
                                        <div className="list-app-mobile">
                                            <ListApp
                                                appInfo={
                                                    mapAppCategory[
                                                        categorySelected
                                                    ]
                                                }
                                            />
                                        </div>
                                    ) : (
                                        <div />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="_blank">
                        <div
                            id="triangle"
                            style={{
                                borderBottom: `30px solid ${
                                    !!categorySelected
                                        ? "rgba(50, 150, 120, 0.04)"
                                        : "rgba(255, 255, 255, 0.8)"
                                }`,
                            }}
                        />
                    </div>
                </MyContainer>
                {!!categorySelected ? (
                    <div className="list-app-web">
                        <ListApp appInfo={mapAppCategory[categorySelected]} />
                    </div>
                ) : (
                    <div />
                )}
            </div>
        </>
    );
};
const ListCategory = ({
    category,
    categorySelected,
    onClick,
}: {
    category: any;
    categorySelected: number;
    onClick: () => void;
}) => {
    const [isHover, setIsHovered] = useState(false);
    return (
        <div
            id={"category-app-item-" + category.id}
            className={
                "category-app-item  " +
                (categorySelected == category.id ? "active" : "")
            }
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            <div className="container-app-item">
                <img
                    className="icon"
                    src={`images/passemall/${
                        isHover || categorySelected === category.id
                            ? category.activeIcon
                            : category.icon
                    }`}
                    alt="icon"
                    width={40}
                />
                <span className="title-category-app">{category.name}</span>
            </div>
        </div>
    );
};
const ListApp = ({ appInfo }: { appInfo: IAppInfo[] }) => {
    const [stateSlug, setStateSlug] = useState("");
    useEffect(() => {
        const stateName = localStorage.getItem("stateSlug");
        if (stateName?.length) {
            setStateSlug(stateName);
        }
    }, []);

    const getLink = (app: IAppInfo) => {
        let link: string = "";
        if (app.appNameId.startsWith("http")) {
            link = app.appNameId;
        } else {
            link = "/" + app.appNameId;
            if (stateSlug && app.hasState) {
                link += "/" + stateSlug;
            }
        }
        return link;
    };

    const router = useRouter();

    return (
        <>
            <div className="list-app">
                <MyContainer className="grid-container-app ">
                    {appInfo
                        ?.sort((a, b) => a.appName.localeCompare(b.appName))
                        .map((app, index) => {
                            return (
                                <div
                                    key={index + app.appId}
                                    className="grid-item-app "
                                    onClick={() => {
                                        router.push(app.appShortName);
                                    }}
                                >
                                    <div className="container-item-app">
                                        <div className="app-name">
                                            {app.appName.toUpperCase()}
                                        </div>
                                        <div className="dot">&middot;</div>
                                        <div className="total-question">
                                            {app.totalQuestion}
                                        </div>
                                        <div className="question">
                                            Questions
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </MyContainer>
            </div>
        </>
    );
};

export default AppsSectionV0;
