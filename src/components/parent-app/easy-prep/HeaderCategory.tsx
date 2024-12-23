import categories from "@/data/categories.json";
import { IAppInfo } from "@/models/app/appInfo";
import { getLink } from "@/utils";
import { ExpandMore } from "@mui/icons-material";
import Collapse from "@mui/material/Collapse";
import { useRef, useState } from "react";
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

    if (!isDesktop) {
        return (
            <Collapse in={showCategory}>
                <div className="header-1-category-mobile">
                    {categories.map((category) => {
                        return (
                            <div key={category.id}>
                                <div
                                    className={
                                        "category-name align-center " +
                                        (activeCategory === category.id
                                            ? "active"
                                            : "")
                                    }
                                    onClick={() => {
                                        if (activeCategory !== category.id)
                                            setActiveCategory(category.id);
                                        else setActiveCategory(-1);
                                    }}
                                >
                                    {category.name}
                                    <div className="expand-icon align-center">
                                        <ExpandMore />
                                    </div>
                                </div>
                                <Collapse in={activeCategory == category.id}>
                                    <div
                                        className={
                                            "list-app " +
                                            (activeCategory == category.id
                                                ? "active"
                                                : "")
                                        }
                                    >
                                        {listAppInfos
                                            // .filter(
                                            //     (app) =>
                                            //         app.categoryId ===
                                            //         category.id
                                            // )
                                            .sort((a, b) =>
                                                a.appName.localeCompare(
                                                    b.appName
                                                )
                                            )
                                            .map((app, index) => {
                                                return (
                                                    <a
                                                        className="app-name align-center"
                                                        href={getLink(app, "")}
                                                        key={index}
                                                        onClick={(e) => {
                                                            // ga.event({
                                                            //     action: "click_test_drop_down",
                                                            //     params: {
                                                            //         device: "mobile",
                                                            //         app: app.appName,
                                                            //     },
                                                            // });
                                                        }}
                                                    >
                                                        {app.appName.toUpperCase()}
                                                    </a>
                                                );
                                            })}
                                    </div>
                                </Collapse>
                            </div>
                        );
                    })}
                </div>
            </Collapse>
        );
    }
    return (
        <div
            className="header-1-category-desktop"
            ref={areaRef}
            // onMouseLeave={() => {
            //     hideMenu();
            // }}
        >
            <div className="list-category">
                {categories.map((category) => {
                    return (
                        <div
                            className={
                                "align-center category-name " +
                                (activeCategory === category.id ? "active" : "")
                            }
                            key={category.id}
                            onMouseEnter={() => {
                                if (activeCategory !== category.id)
                                    setActiveCategory(category.id);
                            }}
                        >
                            {category.name}{" "}
                            <ExpandMore width={20} height={20} />
                        </div>
                    );
                })}
            </div>
            <Collapse in={activeCategory !== -1} orientation="horizontal">
                <div className="list-app overflow-auto">
                    <div className="grid-app">
                        {listAppInfos
                            // .filter((app) => app.categoryId === activeCategory)
                            .sort((a, b) => a.appName.length - b.appName.length)
                            .map((app, index) => {
                                return (
                                    <a
                                        className="app-name align-center"
                                        href={getLink(app, "")}
                                        key={index}
                                        onClick={(e) => {
                                            // ga.event({
                                            //     action: "click_test_drop_down",
                                            //     params: {
                                            //         device: "desktop",
                                            //         app: app.appName,
                                            //     },
                                            // });
                                        }}
                                    >
                                        {app.appName.toUpperCase()}
                                    </a>
                                );
                            })}
                    </div>
                </div>
            </Collapse>
        </div>
    );
};

export default HeaderCategory;
