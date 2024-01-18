import React, { useEffect, useRef, useState } from "react";
import "./Header1.scss";
import ExpandMoreIcon from "../icon/ExpandMoreIcon";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuIcon from "../icon/MenuIcon";
import { IAppInfo } from "@/models/AppInfo";
import SearchIcon from "../icon/SearchIcon";
import CloseIcon from "../icon/CloseIcon";
import HeaderCategory from "../easy-prep/HeaderCategory";
import AppLogo from "../logo/AppLogo";
import Link from "next/link";
import dynamic from "next/dynamic";
const SearchAppComponent = dynamic(() => import("./SearchAppComponent"), {
    ssr: false,
});
const Header1 = ({ listAppInfos }: { listAppInfos: IAppInfo[] }) => {
    const isDesktop = useMediaQuery("(min-width: 769px)");
    const [focusSearch, setFocusSearch] = useState(false);
    const [focusMenu, setFocusMenu] = useState(false);
    useEffect(() => {
        let nextEle = document.getElementById("__next");
        if (!!nextEle) {
            if (focusMenu || focusSearch) {
                nextEle.style.height = "-webkit-fill-available";
                nextEle.style.overflow = "hidden";
                document.body.style.overflow = "hidden";
            } else {
                nextEle.style.height = "100%";
                nextEle.style.overflow = "";
                document.body.style.overflow = "unset";
            }
        }
    }, [focusMenu, focusSearch]);
    return (
        <header className={`header-1-container`}>
            <div className="header-grid">
                <div className="grid-frame -f1 align-center font-14">
                    <div className="menu-desktop align-center">
                        <HeaderMenu isDesktop={isDesktop} listAppInfos={listAppInfos} />
                    </div>

                    <div
                        className="menu-icon-mobile"
                        onClick={() => {
                            setFocusMenu(true);
                        }}
                    >
                        <MenuIcon />
                    </div>
                </div>
                <div className="grid-frame -f2 align-center">
                    <AppLogo />
                </div>
                <div className="grid-frame -f3 align-center">
                    <div className="search-desktop">
                        <SearchAppComponent listAppInfos={listAppInfos} isDesktop={isDesktop} />
                    </div>
                    <div
                        className="search-icon-mobile"
                        onClick={() => {
                            setFocusSearch(true);
                        }}
                    >
                        <SearchIcon />
                    </div>
                </div>
            </div>
            <div
                id="search-component-mobile"
                style={{
                    opacity: !isDesktop && focusSearch ? 1 : 0,
                    height: !isDesktop && focusSearch ? "100vh" : 0,
                    width: !isDesktop && focusSearch ? "100vw" : 0,
                }}
            >
                {!isDesktop && focusSearch && (
                    <div className="search-component-mobile">
                        <div className="align-center">
                            <SearchAppComponent listAppInfos={listAppInfos} isDesktop={isDesktop} />
                            <div
                                className="cancel-search-btn font-14"
                                onClick={() => {
                                    setFocusSearch(false);
                                }}
                            >
                                Cancel
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div
                id="menu-component-mobile"
                style={{
                    opacity: !isDesktop && focusMenu ? 1 : 0,
                    height: !isDesktop && focusMenu ? "100vh" : 0,
                    width: !isDesktop && focusMenu ? "100vw" : 0,
                }}
            >
                {!isDesktop && focusMenu && (
                    <div className="menu-component-mobile">
                        <div onClick={() => setFocusMenu(false)} style={{ marginBottom: "24px", padding: 16 }}>
                            <CloseIcon />
                        </div>
                        <HeaderMenu isDesktop={isDesktop} listAppInfos={listAppInfos} />
                    </div>
                )}
            </div>
        </header>
    );
};

// const LIMIT_HISTORY_SHOWN = 5;
// const SearchAppComponent = ({ listAppInfos, isDesktop }: { listAppInfos: IAppInfo[]; isDesktop: boolean }) => {
//     const [searchValue, setSearchValue] = useState<(IAppInfo | string)[]>([]);
//     const inputRef = useRef<HTMLInputElement>(null);
//     const containerRef = useRef<HTMLDivElement>(null);
//     const [activeSearchIcon, setActiveSearchIcon] = useState(false);
//     const [historySearchedLocalStorage, setHistorySearchedLocalStorage] = useState([]); // lịch sử tìm kiếm [{timeStamp: number, search: string}]
//     const [historySearched, setHistorySearched] = useState<HistorySearched[]>([]);
//     useEffect(() => {
//         //* để tránh truy cập vào localStorage nhiều lần không cần thiết thì sẽ lấy dữ liệu ra khi mount component
//         let historySearchedJSON = localStorage.getItem(KEY);
//         if (historySearchedJSON) {
//             let _historySearched = JSON.parse(historySearchedJSON);
//             if (_historySearched.length) setHistorySearchedLocalStorage(_historySearched);
//         }
//     }, []);
//     const handleSearchInput = (input: string) => {
//         // lọc lịch sử và kết quả từ text input
//         if (input.length > 0) {
//             if (!activeSearchIcon) setActiveSearchIcon(true);
//             let search = listAppInfos.filter((a) => a?.appName.toLowerCase().startsWith(input.toLowerCase()));
//             if (search.length > 0) {
//                 search.sort((a, b) => a.appName.toLowerCase().localeCompare(b.appName.toLowerCase()));
//                 setSearchValue(search);
//             } else setSearchValue(["No results found."]);
//         } else {
//             setSearchValue([]);
//             if (activeSearchIcon) setActiveSearchIcon(false);
//         }
//     };

//     const onFocusSearch = (e: string) => {
//         // khi focus vào thanh search thì cần lọc lịch sử
//         if (historySearchedLocalStorage.length) {
//             let _historySearched = [];
//             if (e) {
//                 _historySearched = historySearchedLocalStorage
//                     .filter((_h) => _h.search.toLowerCase().startsWith(e.toLowerCase()))
//                     .slice(0, LIMIT_HISTORY_SHOWN + 1);
//                 setHistorySearched(_historySearched);
//             } else {
//                 _historySearched = historySearchedLocalStorage.slice(0, LIMIT_HISTORY_SHOWN + 1);
//                 if (_historySearched.length) setHistorySearched(_historySearched);
//             }
//         }
//     };

//     const onSearch = () => {
//         // khi thực hiện hành động seach
//         if (searchValue.length) {
//             // nếu ĐANG có kết quả tìm kiếm thì sẽ lưu từ khoá hiện tại vào lịch sử tìm kiếm
//             let _hs = historySearchedLocalStorage.filter((h) => h.search !== inputRef.current.value);
//             let res: HistorySearched = { timeStamp: Date.now(), search: inputRef.current.value };
//             let _nh = [res, ..._hs];
//             setHistorySearchedLocalStorage(_nh);
//             localStorage.setItem(KEY, JSON.stringify(_nh));
//         }
//     };

//     return (
//         <div className="search-component align-center" ref={containerRef}>
//             <input
//                 ref={inputRef}
//                 type="text"
//                 placeholder="Search"
//                 className="font-14"
//                 onChange={(e) => {
//                     let input = e.currentTarget.value;
//                     handleSearchInput(input);
//                     console.log("dcm");

//                     onFocusSearch(input);
//                 }}
//                 onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                         onSearch();
//                     }
//                 }}
//                 autoFocus={!isDesktop}
//                 onFocus={(e) => {
//                     let input = e.currentTarget.value;
//                     if (input) {
//                         if (!searchValue.length) {
//                             handleSearchInput(input);
//                         }
//                     }
//                     onFocusSearch(input);
//                 }}
//             />
//             <div
//                 id="search-icon"
//                 className={activeSearchIcon ? "-focus" : ""}
//                 onClick={() => {
//                     inputRef.current.focus();
//                     onSearch();
//                 }}
//             >
//                 <SearchIcon color={activeSearchIcon ? "#fff" : "#262626"} />
//             </div>
//             {searchValue.length || historySearched.length ? (
//                 <SearchResult
//                     searchValue={searchValue}
//                     hideResult={() => {
//                         setSearchValue([]);
//                         setHistorySearched([]);
//                     }}
//                     containerRef={containerRef}
//                     histories={historySearched}
//                     removeHistorySearchedItem={(id: number) => {
//                         let _h = historySearchedLocalStorage.filter((h) => h.timeStamp != id);
//                         localStorage.setItem(KEY, JSON.stringify(_h));
//                         setHistorySearchedLocalStorage(_h);
//                         setHistorySearched(historySearched.filter((h) => h.timeStamp != id));
//                     }}
//                     onSelectHistorySearched={(res: HistorySearched) => {
//                         inputRef.current.value = res.search;
//                         let _h = historySearchedLocalStorage.filter((h) => h.timeStamp !== res.timeStamp);
//                         let _nh = [res, ..._h];
//                         handleSearchInput(res.search);
//                         localStorage.setItem(KEY, JSON.stringify(_nh)); // đưa lựa chọn lên đầu danh sách
//                         setHistorySearchedLocalStorage(_nh);
//                     }}
//                     onSelectAppResult={(res: HistorySearched) => {
//                         let _h = historySearchedLocalStorage.filter((h) => h.search !== res.search);
//                         let _nh = [res, ..._h];
//                         localStorage.setItem(KEY, JSON.stringify(_nh)); // đưa lựa chọn lên đầu danh sách
//                         setHistorySearchedLocalStorage(_nh);
//                     }}
//                 />
//             ) : (
//                 <></>
//             )}
//         </div>
//     );
// };

const HeaderMenu = ({ isDesktop, listAppInfos }: { isDesktop: boolean; listAppInfos: IAppInfo[] }) => {
    const [showCategory, setShowCategory] = useState(false);
    const buttonRef = useRef<HTMLDivElement>(null);
    return (
        <>
            <Link href="/">
                <a className="header-1-menu -option-home">Home</a>
            </Link>
            <Link href="/about" prefetch={false}>
                <a className="header-1-menu -option-about">About</a>
            </Link>
            <div
                ref={buttonRef}
                className={"header-1-menu -option-practice-test align-center " + (showCategory ? "active" : "")}
                onClick={() => {
                    if (!showCategory) setShowCategory(true);
                    else if (!isDesktop) setShowCategory(false);
                }}
                onMouseOver={() => {
                    if (!showCategory && isDesktop) setShowCategory(true);
                }}
            >
                Practice Tests
                <div className="icon align-center">
                    <ExpandMoreIcon />
                </div>
            </div>
            {isDesktop ? (
                showCategory && (
                    <div className="header-1-category-container-desktop">
                        <HeaderCategory
                            isDesktop={isDesktop}
                            listAppInfos={listAppInfos}
                            buttonRef={buttonRef}
                            hideMenu={() => setShowCategory(false)}
                        />
                    </div>
                )
            ) : (
                <HeaderCategory isDesktop={isDesktop} listAppInfos={listAppInfos} showCategory={showCategory} />
            )}
        </>
    );
};

export default Header1;
