import MyContainer from "@/components/v4-material/MyContainer";
import "./AppsSectionV0.scss";
import { IAppInfo } from "@/models/AppInfo";
import categoriesPassemall from "../../../data/categoriesPassemall.json";
import { useEffect, useRef, useState } from "react";
import { callApi } from "@/services";

interface CategoriesType {
    [categoryId: number]: IAppInfo[];
}
const AppsSectionV0 = ({
    appInfo,
    listAppInfo,
    isDesktop,
}: {
    appInfo: IAppInfo;
    listAppInfo: IAppInfo[];
    isDesktop: boolean;
}) => {
    const [categorySelected, setCategorySelected] = useState(categoriesPassemall[0]?.id ?? 0);
    const itemRef = useRef<HTMLDivElement>(null);
    let mapAppCategory: CategoriesType = {};
    for (let app of listAppInfo) {
        if (app.categoryId) {
            if (!mapAppCategory[app.categoryId]) {
                mapAppCategory[app.categoryId] = [];
            }
            mapAppCategory[app.categoryId].push(app);
        }
    }
    const focusCategory = (id: number) => {
        let category = document.getElementById("category-app-item-" + id);
        let triangle = document.getElementById("triangle");

        if (category) {
            let width = category.offsetWidth;
            let left = category.offsetLeft;
            if (triangle) {
                triangle.style.marginLeft = `calc(${left}px + ${width / 2}px - 20px - 6px)`; // 20px là 1/2 with của icon tam giác , 6px là padding left của parent element
            }
        }
    };
    return (
        <>
            <div className="apps-section-v0">
                <MyContainer className="container-apps-section-v0">
                    <div
                        className="title-apps-section-web"
                        onClick={() => {
                            exportData();
                        }}
                    >
                        Easily <span className="text-edit">Pass Your Exam</span> With Our Practice Tests
                    </div>
                    <div className="title-apps-section-mobile">
                        Exam Prep Built To Help You <span className="text-edit">Pass</span>
                    </div>
                    <div className="content-apps-section-v0">
                        {categoriesPassemall.map((category, index) => {
                            return (
                                <div className="container-category-app-v0" key={index + category.icon} ref={itemRef}>
                                    <ListCategory
                                        category={category}
                                        categorySelected={categorySelected}
                                        onClick={() => {
                                            if (itemRef.current && isDesktop) {
                                                itemRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                                            }
                                            if (categorySelected !== category.id) {
                                                setCategorySelected(category.id);
                                                focusCategory(category.id);
                                            } else {
                                                if (!isDesktop) {
                                                    setCategorySelected(null);
                                                    focusCategory(null);
                                                }
                                            }
                                        }}
                                    />
                                    {categorySelected === index + 1 ? (
                                        <div className="list-app-mobile">
                                            <ListApp appInfo={mapAppCategory[categorySelected]} />
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
                                    !!categorySelected ? "rgba(50, 150, 120, 0.04)" : "rgba(255, 255, 255, 0.8)"
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
            className={"category-app-item  " + (categorySelected == category.id ? "active" : "")}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            <div className="container-app-item">
                <img
                    className="icon"
                    src={`images/passemall/${
                        isHover || categorySelected === category.id ? category.activeIcon : category.icon
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
        let stateName = localStorage.getItem("stateSlug");
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
    return (
        <>
            <div className="list-app">
                <MyContainer className="grid-container-app">
                    {appInfo
                        ?.sort((a, b) => a.appName.localeCompare(b.appName))
                        .map((app, index) => {
                            return (
                                <a key={index + app.appId} className="grid-item-app" href={getLink(app)}>
                                    <div className="container-item-app">
                                        <div className="app-name">{app.appName.toUpperCase()}</div>
                                        <div className="dot">&middot;</div>
                                        <div className="total-question">{app.totalQuestion}</div>
                                        <div className="question">Questions</div>
                                    </div>
                                </a>
                            );
                        })}
                </MyContainer>
            </div>
        </>
    );
};

export default AppsSectionV0;

const exportData = async () => {
    for (let app of a) {
        // if (notExport.find((a) => a.appId !== app.appId) && app.appId !== -1) {
        await callApi({
            url: `app/update-data-for-web-only-app-id?appId=${app.appId}&hasState=false`, //`api/web?type=export-new-app&appId=${app.appId}&appName=${app.bucket}`,
            params: null,
            method: "get",
            baseURl: "http://localhost:4003/",
            headers: null,
            timeout: 90000,
        })
            .then((res) => {
                console.log("ok", app.appId, res.data);
            })
            .catch((err) => {
                console.log("error", app.appId);
            });
        // }
    }
};
let a = [
    // {
    //     appId: "4896549496684544",
    //     appName: "CBEST",
    // },
    // {
    //     appId: "6117350328762368",
    //     appName: "CFA Level 1",
    // },
    // {
    //     appId: "4561360798089216",
    //     appName: "AP Psychology",
    // },
    // {
    //     appId: "5551925043920896",
    //     appName: "CompTIA A+",
    // },
    // {
    //     appId: "4856116048560128",
    //     appName: "APUSH",
    // },
    // {
    //     appId: "6536271351513088",
    //     appName: "CCSP",
    // },
    // {
    //     appId: "6552799815925760",
    //     appName: "CEH",
    // },
    // {
    //     appId: "5962925959282688",
    //     appName: "AWS Solutions Architect Associate",
    // },
    // {
    //     appId: "6119576033034240",
    //     appName: "Accuplacer",
    // },
    // {
    //     appId: "5881924151148544",
    //     appName: "ASE Series A",
    // },
    // {
    //     appId: "4878338973761536",
    //     appName: "ASVAB",
    // },
    // {
    //     appId: "6500317395943424",
    //     appName: "Australian Citizenship",
    // },
    // {
    //     appId: "5910018231631872",
    //     appName: "AWS Certified Developer - Associate",
    // },
    // {
    //     appId: "5215607919214592",
    //     appName: "AWS Certified SysOps Administrator",
    // },
    // {
    //     appId: "6219842827845632",
    //     appName: "AWS Cloud Practitioner",
    // },
    // {
    //     appId: "4791736938266624",
    //     appName: "MBE",
    // },
    // {
    //     appId: "4739223829610496",
    //     appName: "CAPM",
    // },
    // {
    //     appId: "5884506440466432",
    //     appName: "CAST",
    // },
    // {
    //     appId: "5311366673989632",
    //     appName: "CCAT",
    // },
    // {
    //     appId: "5391119996157952",
    //     appName: "CCNA",
    // },
    // {
    //     appId: "4837345850294272",
    //     appName: "CEN",
    // },
    // {
    //     appId: "6391284127236096",
    //     appName: "CFA Level 2",
    // },
    // {
    //     appId: "5828429703282688",
    //     appName: "CHSPE",
    // },
    // {
    //     appId: "4574196346650624",
    //     appName: "CISSP",
    // },
    // {
    //     appId: "5007397443600384",
    //     appName: "CNA",
    // },
    // {
    //     appId: "6413438390632448",
    //     appName: "comptia itf+",
    // },
    // {
    //     appId: "6221301783986176",
    //     appName: "CPA",
    // },
    // {
    //     appId: "4540394026041344",
    //     appName: "CPCE",
    // },
    // {
    //     appId: "6326015811911680",
    //     appName: "CompTIA CySA+",
    // },
    // {
    //     appId: "5276218037370880",
    //     appName: "DAT",
    // },
    // {
    //     appId: "5243570678136832",
    //     appName: "EMT",
    // },
    // {
    //     appId: "5645825162084352",
    //     appName: "EPA 608",
    // },
    // {
    //     appId: "6036400967254016",
    //     appName: "FAA Part 107",
    // },
    // {
    //     appId: "5397248982646784",
    //     appName: "FSC",
    // },
    // {
    //     appId: "6634431222644736",
    //     appName: "FSOT",
    // },
    // {
    //     appId: "5296397775536128",
    //     appName: "GED",
    // },
    // {
    //     appId: "6098076194308096",
    //     appName: "GRE",
    // },
    // {
    //     appId: "5657969412800512",
    //     appName: "HESI A2",
    // },
    // {
    //     appId: "6504182246801408",
    //     appName: "HISET",
    // },
    // {
    //     appId: "6174673429594112",
    //     appName: "HSPT",
    // },
    // {
    //     appId: "4811628111462400",
    //     appName: "HVAC",
    // },
    // {
    //     appId: "5316459300388864",
    //     appName: "Journeyman Electrician",
    // },
    // {
    //     appId: "5719960095555584",
    //     appName: "MBLEx",
    // },
    // {
    //     appId: "5685410002894848",
    //     appName: "MCAT",
    // },
    // {
    //     appId: "6115280825614336",
    //     appName: "Microsoft Azure AZ-900",
    // },
    // {
    //     appId: "5473188218667008",
    //     appName: "CompTIA Net+",
    // },
    // {
    //     appId: "6513146321698816",
    //     appName: "NAPLEX",
    // },
    // {
    //     appId: "5794588703850496",
    //     appName: "NASM CPT",
    // },
    // {
    //     appId: "5198848772276224",
    //     appName: "NATE",
    // },
    // {
    //     appId: "5569772466995200",
    //     appName: "NCE",
    // },
    // {
    //     appId: "4691917260455936",
    //     appName: "NCLEX PN",
    // },
    // {
    //     appId: "5017963709071360",
    //     appName: "NCLEX RN",
    // },
    // {
    //     appId: "5252858371899392",
    //     appName: "NSW DKT",
    // },
    // {
    //     appId: "6341062520995840",
    //     appName: "Ontario G1",
    // },
    // {
    //     appId: "5643531427250176",
    //     appName: "Paramedic",
    // },
    // {
    //     appId: "4745883528724480",
    //     appName: "Parapro",
    // },
    // {
    //     appId: "5421595969454080",
    //     appName: "PCCN",
    // },
    // {
    //     appId: "5985539595436032",
    //     appName: "PERT",
    // },
    // {
    //     appId: "6328870527565824",
    //     appName: "Phlebotomy",
    // },
    // {
    //     appId: "5717345143095296",
    //     appName: "PHR",
    // },
    // {
    //     appId: "6640384538050560",
    //     appName: "PL-300",
    // },
    // {
    //     appId: "6711507096174592",
    //     appName: "PMP",
    // },
    // {
    //     appId: "5753091221618688",
    //     appName: "PTCE",
    // },
    // {
    //     appId: "5746867797229568",
    //     appName: "Servsafe",
    // },
    // {
    //     appId: "6482106442055680",
    //     appName: "SIE",
    // },
    // {
    //     appId: "5744053972893696",
    //     appName: "CompTIA Sec+",
    // },
    // {
    //     appId: "5258846803066880",
    //     appName: "TABE",
    // },
    // {
    //     appId: "5462477120733184",
    //     appName: "TASC",
    // },
    // {
    //     appId: "5186025303310336",
    //     appName: "TEAS",
    // },
    // {
    //     appId: "5278385414602752",
    //     appName: "TSI",
    // },
    // {
    //     appId: "4821614053031936",
    //     appName: "VTNE",
    // },
    // {
    //     appId: "5443462460604416",
    //     appName: "Wonderlic",
    // },
    // {
    //     appId: "6465005999357952",
    //     appName: "NMLS",
    // },
    // {
    //     appId: "5601951678988288",
    //     appName: "Series 7",
    // },
];
