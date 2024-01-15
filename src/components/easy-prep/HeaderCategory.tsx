import { IAppInfo } from "@/models/AppInfo";
import categories from "../../data/categories.json";
import "./HeaderCategory.scss";
import { useEffect, useRef, useState } from "react";
import ExpandMoreIcon from "../icon/ExpandMoreIcon";
import Collapse from "@mui/material/Collapse";
const HeaderCategory = ({
    isDesktop,
    listAppInfos,
    buttonRef,
    hideMenu,
    showCategory = false,
}: {
    isDesktop: boolean;
    listAppInfos: IAppInfo[];
    buttonRef?: React.RefObject<HTMLDivElement>;
    hideMenu?: () => void;
    showCategory?: boolean;
}) => {
    const [activeCategory, setActiveCategory] = useState(-1);
    const areaRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (isDesktop) {
            const clickEvent = (e: MouseEvent) => {
                if (e.target) {
                    if (!areaRef.current?.contains(e.target as Node) && !buttonRef.current?.contains(e.target as Node))
                        hideMenu();
                }
            };

            window.addEventListener("mousedown", clickEvent);
            return () => {
                window.removeEventListener("mousedown", clickEvent);
            };
        }
    }, [isDesktop]);
    if (!isDesktop) {
        return (
            <Collapse in={showCategory}>
                <div className="header-1-category-mobile">
                    {categories.map((category) => {
                        return (
                            <>
                                <div
                                    className={"category-name align-center " + (activeCategory === category.id ? "active" : "")}
                                    onClick={() => {
                                        if (activeCategory !== category.id) setActiveCategory(category.id);
                                        else setActiveCategory(-1);
                                    }}
                                >
                                    {category.name}
                                    <div className="expand-icon align-center">
                                        <ExpandMoreIcon />
                                    </div>
                                </div>
                                <Collapse in={activeCategory == category.id}>
                                    <div className={"list-app " + (activeCategory == category.id ? "active" : "")}>
                                        {listAppInfos
                                            .filter((app) => app.categoryId === category.id)
                                            .sort((a, b) => a.appName.localeCompare(b.appName))
                                            .map((app) => {
                                                return <div className="app-name align-center">{app.appName.toUpperCase()}</div>;
                                            })}
                                    </div>
                                </Collapse>
                            </>
                        );
                    })}
                </div>
            </Collapse>
        );
    }
    return (
        <div className="header-1-category-desktop" ref={areaRef}>
            <div className="list-category">
                {categories.map((category) => {
                    return (
                        <div
                            className={"category-name " + (activeCategory === category.id ? "active" : "")}
                            key={category.id}
                            onClick={() => {
                                if (activeCategory !== category.id) setActiveCategory(category.id);
                            }}
                        >
                            {category.name}
                        </div>
                    );
                })}
            </div>
            <Collapse in={activeCategory !== -1} orientation="horizontal">
                <div className="list-app">
                    <div className="grid-app">
                        {listAppInfos
                            .filter((app) => app.categoryId === activeCategory)
                            .sort((a, b) => a.appName.localeCompare(b.appName))
                            .map((app) => {
                                return <div className="app-name align-center">{app.appName.toUpperCase()}</div>;
                            })}
                    </div>
                </div>
            </Collapse>
        </div>
    );
};

export default HeaderCategory;
