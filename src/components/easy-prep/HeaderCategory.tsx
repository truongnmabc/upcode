import { IAppInfo } from "@/models/AppInfo";
import categories from "../../data/categories.json";
import "./HeaderCategory.scss";
import { useEffect, useRef, useState } from "react";
const HeaderCategory = ({
    isDesktop,
    listAppInfos,
    buttonRef,
    hideMenu,
}: {
    isDesktop: boolean;
    listAppInfos: IAppInfo[];
    buttonRef?: React.RefObject<HTMLDivElement>;
    hideMenu?: () => void;
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
        return <div></div>;
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
            {activeCategory !== -1 && (
                <div className="list-app">
                    <div className="grid-app">
                        {listAppInfos
                            .filter((app) => app.categoryId === activeCategory)
                            .sort((a, b) => a.appName.localeCompare(b.appName))
                            .map((app) => {
                                return <div className="app-name">{app.appName.toUpperCase()}</div>;
                            })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeaderCategory;
