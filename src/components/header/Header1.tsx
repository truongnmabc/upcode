import React, { useEffect, useRef, useState } from "react";
import "./Header1.scss";
import ExpandMoreIcon from "../icon/ExpandMoreIcon";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuIcon from "../icon/MenuIcon";
import { IAppInfo } from "@/models/AppInfo";
import SearchIcon from "../icon/SearchIcon";
const Header1 = ({ listAppInfos }: { listAppInfos: IAppInfo[] }) => {
    const isDesktop = useMediaQuery("(min-width: 769px)");
    const [focusSearch, setFocusSearch] = useState(false);
    return (
        <div className={`header-1-container`}>
            <div className="grid-frame -f1 align-center font-14">
                {isDesktop ? (
                    <>
                        <a className="header-1-menu -option-home" href="/">
                            Home
                        </a>
                        <a className="header-1-menu -option-about" href="/about">
                            About
                        </a>
                        <div className="header-1-menu -option-practice-test align-center">
                            Practice Tests
                            <div className="icon">
                                <ExpandMoreIcon />
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <MenuIcon />
                    </>
                )}
            </div>
            <div className="grid-frame -f2 align-center">
                <img src="/images/easy-prep/logo-easy-prep.png" width={90} height={24} alt="logo" />
            </div>
            <div className="grid-frame -f3 align-center">
                {isDesktop ? (
                    <SearchAppComponent listAppInfos={listAppInfos} isDesktop={isDesktop} />
                ) : (
                    <>
                        <div
                            className="search-icon-mobile"
                            onClick={() => {
                                setFocusSearch(true);
                            }}
                        >
                            <SearchIcon />
                        </div>
                    </>
                )}
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
                <script type="text/javascript">{}</script>
            </div>
        </div>
    );
};

const SearchAppComponent = ({ listAppInfos, isDesktop }: { listAppInfos: IAppInfo[]; isDesktop: boolean }) => {
    const [searchValue, setSearchValue] = useState<(IAppInfo | string)[]>([]);
    const inpustRef = useRef<HTMLInputElement>(null);
    const handleSearchInput = (input: string) => {
        if (input.length > 0) {
            let search = listAppInfos.filter((a) => a?.appName.toLowerCase().startsWith(input.toLowerCase()));
            if (search.length > 0) {
                search.sort((a, b) => a.appName.toLowerCase().localeCompare(b.appName.toLowerCase()));
                setSearchValue(search);
            } else setSearchValue(["No results found."]);
        } else setSearchValue([]);
    };
    return (
        <div className="search-component align-center">
            <input
                ref={inpustRef}
                type="text"
                placeholder="Search"
                className="font-14"
                onChange={(e) => {
                    let input = e.currentTarget.value;
                    handleSearchInput(input);
                }}
                autoFocus={!isDesktop}
                onFocus={(e) => {
                    if (e.currentTarget.value) {
                        if (!searchValue.length) {
                            let input = e.currentTarget.value;
                            handleSearchInput(input);
                        }
                    }
                }}
            />
            <SearchIcon />
            {searchValue.length ? (
                <SearchResult
                    searchValue={searchValue}
                    hideResult={() => {
                        setSearchValue([]);
                    }}
                    inputRef={inpustRef}
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
    inputRef,
}: {
    searchValue: (IAppInfo | string)[];
    hideResult: () => void;
    inputRef: React.RefObject<HTMLInputElement>;
}) => {
    // https://dev.to/rashed_iqbal/how-to-handle-outside-clicks-in-react-with-typescript-4lmc
    const areaRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const clickEvent = (e: MouseEvent) => {
            if (e.target) {
                if (!areaRef.current?.contains(e.target as Node) && !inputRef.current?.contains(e.target as Node)) hideResult();
            }
        };
        window.addEventListener("mousedown", clickEvent);
        return () => {
            window.removeEventListener("mousedown", clickEvent);
        };
    }, []);
    return (
        <div className="search-result-container" ref={areaRef}>
            {searchValue.map((res: IAppInfo | string, index) => {
                if (typeof res === "string")
                    return (
                        <div key={index} className="no-result">
                            {res}
                        </div>
                    );
                else
                    return (
                        <div key={index} className="result-item align-center">
                            <img width={24} height={24} src={`/info/images/${res.appShortName}/logo60.png`} />
                            {res?.appName}
                        </div>
                    );
            })}
        </div>
    );
};

export default Header1;
