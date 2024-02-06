import { IAppInfo } from "@/models/AppInfo";
import { getLink } from "@/utils";
import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "../icon/CloseIcon";
import HistoryIcon from "../icon/HistoryIcon";
import "./SearchAppComponent.scss";
import SearchIcon from "../icon/SearchIcon";

const KEY = "historySearched";
type HistorySearched = {
    timeStamp: number;
    search: string;
    link?: string;
    img?: string;
};

const LIMIT_HISTORY_SHOWN = 5;
const SearchAppComponent = ({ listAppInfos, isDesktop }: { listAppInfos: IAppInfo[]; isDesktop: boolean }) => {
    const [searchValue, setSearchValue] = useState<(IAppInfo | string)[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeSearchIcon, setActiveSearchIcon] = useState(false);
    const [historySearchedLocalStorage, setHistorySearchedLocalStorage] = useState([]); // lịch sử tìm kiếm [{timeStamp: number, search: string}]
    const [historySearched, setHistorySearched] = useState<HistorySearched[]>([]);
    useEffect(() => {
        //* để tránh truy cập vào localStorage nhiều lần không cần thiết thì sẽ lấy dữ liệu ra khi mount component
        let historySearchedJSON = localStorage.getItem(KEY);
        if (historySearchedJSON) {
            let _historySearched = JSON.parse(historySearchedJSON);
            if (_historySearched.length) setHistorySearchedLocalStorage(_historySearched);
        }
    }, []);
    const handleSearchInput = (input: string) => {
        // lọc lịch sử và kết quả từ text input
        if (input.length > 0) {
            if (!activeSearchIcon) setActiveSearchIcon(true);
            let search = listAppInfos.filter((a) => a?.appName.toLowerCase().startsWith(input.toLowerCase()));
            if (search.length > 0) {
                search.sort((a, b) => a.appName.toLowerCase().localeCompare(b.appName.toLowerCase()));
                setSearchValue(search);
            } else setSearchValue(["No results found."]);
        } else {
            setSearchValue([]);
            if (activeSearchIcon) setActiveSearchIcon(false);
        }
    };

    const onFocusSearch = (e: string) => {
        // khi focus vào thanh search thì cần lọc lịch sử
        if (historySearchedLocalStorage.length) {
            let _historySearched = [];
            if (e) {
                _historySearched = historySearchedLocalStorage
                    .filter((_h) => _h.search.toLowerCase().startsWith(e.toLowerCase()))
                    .slice(0, LIMIT_HISTORY_SHOWN + 1);
                setHistorySearched(_historySearched);
            } else {
                _historySearched = historySearchedLocalStorage.slice(0, LIMIT_HISTORY_SHOWN + 1);
                if (_historySearched.length) setHistorySearched(_historySearched);
            }
        }
    };

    const onSearch = () => {
        // khi thực hiện hành động seach
        if (searchValue.length) {
            // nếu ĐANG có kết quả tìm kiếm thì sẽ lưu từ khoá hiện tại vào lịch sử tìm kiếm
            let _hs = historySearchedLocalStorage.filter((h) => h.search !== inputRef.current.value);
            let res: HistorySearched = { timeStamp: Date.now(), search: inputRef.current.value };
            let _nh = [res, ..._hs];
            setHistorySearchedLocalStorage(_nh);
            localStorage.setItem(KEY, JSON.stringify(_nh));
        }
    };

    return (
        <div className="search-component align-center" ref={containerRef}>
            <input
                ref={inputRef}
                type="text"
                placeholder="Search"
                className="font-14"
                onChange={(e) => {
                    let input = e.currentTarget.value;
                    handleSearchInput(input);
                    onFocusSearch(input);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        onSearch();
                    }
                }}
                autoFocus={!isDesktop}
                onFocus={(e) => {
                    let input = e.currentTarget.value;
                    if (input) {
                        if (!searchValue.length) {
                            handleSearchInput(input);
                        }
                    }
                    onFocusSearch(input);
                }}
            />
            <div
                id="search-icon"
                className={activeSearchIcon ? "-focus" : ""}
                onClick={() => {
                    inputRef.current.focus();
                    onSearch();
                }}
            >
                <SearchIcon color={activeSearchIcon ? "#fff" : "#262626"} />
            </div>
            {searchValue.length || historySearched.length ? (
                <SearchResult
                    searchValue={searchValue}
                    hideResult={() => {
                        setSearchValue([]);
                        setHistorySearched([]);
                    }}
                    containerRef={containerRef}
                    histories={historySearched}
                    removeHistorySearchedItem={(id: number) => {
                        let _h = historySearchedLocalStorage.filter((h) => h.timeStamp != id);
                        localStorage.setItem(KEY, JSON.stringify(_h));
                        setHistorySearchedLocalStorage(_h);
                        setHistorySearched(historySearched.filter((h) => h.timeStamp != id));
                    }}
                    onSelectHistorySearched={(res: HistorySearched) => {
                        inputRef.current.value = res.search;
                        let _h = historySearchedLocalStorage.filter((h) => h.timeStamp !== res.timeStamp);
                        let _nh = [res, ..._h];
                        handleSearchInput(res.search);
                        localStorage.setItem(KEY, JSON.stringify(_nh)); // đưa lựa chọn lên đầu danh sách
                        setHistorySearchedLocalStorage(_nh);
                        if (res.link) window.location.href = res.link;
                    }}
                    onSelectAppResult={(res: HistorySearched) => {
                        let _h = historySearchedLocalStorage.filter((h) => h.search !== res.search);
                        let _nh = [res, ..._h];
                        localStorage.setItem(KEY, JSON.stringify(_nh)); // đưa lựa chọn lên đầu danh sách
                        setHistorySearchedLocalStorage(_nh);
                        window.location.href = res.link;
                    }}
                />
            ) : (
                <></>
            )}
        </div>
    );
};

const SearchResult = ({
    searchValue,
    hideResult,
    containerRef,
    histories,
    removeHistorySearchedItem,
    onSelectHistorySearched,
    onSelectAppResult,
}: {
    searchValue: (IAppInfo | string)[];
    hideResult: () => void;
    containerRef: React.MutableRefObject<HTMLDivElement>;
    histories: HistorySearched[];
    removeHistorySearchedItem: (id: number) => void;
    onSelectHistorySearched: (res: HistorySearched) => void;
    onSelectAppResult: (res: HistorySearched) => void;
}) => {
    // https://dev.to/rashed_iqbal/how-to-handle-outside-clicks-in-react-with-typescript-4lmc
    const areaRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const clickEvent = (e: MouseEvent) => {
            if (e.target) {
                if (!areaRef.current?.contains(e.target as Node) && !containerRef.current?.contains(e.target as Node))
                    hideResult();
            }
        };
        window.addEventListener("mousedown", clickEvent);
        return () => {
            window.removeEventListener("mousedown", clickEvent);
        };
    }, []);
    const stateName = localStorage.getItem("stateSlug");
    let _searchValue = searchValue.filter((v) => {
        if (typeof v != "string") return !histories.find((h) => h.link === getLink(v, stateName));
        return true;
    });
    return (
        <div className="search-result-container overflow-auto" ref={areaRef}>
            {!!histories.length && (
                <div style={{ padding: 12 }}>
                    {histories.map((hist, index) => {
                        return (
                            <div
                                key={index}
                                className="align-center history-item"
                                onClick={() => {
                                    console.log(hist);

                                    onSelectHistorySearched(hist);
                                }}
                            >
                                <span className="align-center">
                                    {!hist.img && (
                                        <div
                                            className="align-center"
                                            style={{
                                                flex: "none",
                                                marginRight: 8,
                                                width: 24,
                                                height: 24,
                                                justifyContent: "center",
                                            }}
                                        >
                                            <HistoryIcon />
                                        </div>
                                    )}
                                    <span className="align-center">
                                        {!!hist.img && (
                                            <img
                                                src={hist.img}
                                                width={24}
                                                height={24}
                                                loading="lazy"
                                                alt=""
                                                style={{ marginRight: 8 }}
                                            />
                                        )}
                                        {hist.search}
                                    </span>
                                </span>
                                <div
                                    className="flex"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        removeHistorySearchedItem(hist.timeStamp);
                                    }}
                                >
                                    <CloseIcon width={16} height={16} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            {!!_searchValue.length && (
                <div id="_search-result-container">
                    {_searchValue.map((res: IAppInfo | string, index) => {
                        if (typeof res === "string")
                            return (
                                <div key={index} className="no-result">
                                    {res}
                                </div>
                            );
                        else {
                            let srcImg = `/info/images/${res.bucket}/logo60.png`;
                            return (
                                <div
                                    key={index}
                                    className="result-item align-center"
                                    onClick={() => {
                                        let link = getLink(res, stateName);
                                        let _h = { timeStamp: Date.now(), search: res.appName, link: link, img: srcImg };
                                        onSelectAppResult(_h);
                                    }}
                                >
                                    <img width={24} height={24} src={srcImg} alt="" />
                                    {res?.appName}
                                </div>
                            );
                        }
                    })}
                </div>
            )}
        </div>
    );
};

export default SearchAppComponent;
