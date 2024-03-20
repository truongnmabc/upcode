import dynamic from "next/dynamic";
import Config from "../../config";
import { SYNC_TYPE } from "../../config/config_sync";
import * as ga from "../../services/ga";
import { IAppInfo } from "../../models/AppInfo";
import { ITopic } from "../../models/Topic";
import "./StudyView.scss";
import { isParentApp, setSession } from "../../config/config_web";
import MyContainer from "../v4-material/MyContainer";
import { useEffect, useRef } from "react";
import IWebData from "@/types/webData";
import { GameState } from "@/redux/features/game";
import V4CircleProgress from "../v4-material/V4CircleProgress";
import Link from "next/link";
import { getLink } from "@/utils";
import { ITestInfo } from "@/models/TestInfo";
import { getAppTopics } from "@/utils/getRawTopicsData";
const MainStudyView = dynamic(() => import("./MainStudyView"), {
    ssr: false,
    loading: () => <div className="main-study-frame v4-border-radius" />,
});
const HeaderStudyV4 = dynamic(() => import("./HeaderStudyV4"), {
    ssr: false,
    loading: () => <div className="header-study-v4-frame" />,
});
const StudyBannerDownloadApp = dynamic(() => import("./StudyBannerDownloadApp"), {
    ssr: false,
    loading: () => <div className="study-banner-download-frame v4-border-radius" />,
});
const EndTestV4 = dynamic(() => import("./end-test-v4"), {
    ssr: false,
    loading: () => <div className="v4-end-test-frame"></div>,
});
const AnswerSheet = dynamic(() => import("./AnswerSheet"));
const GridTopic = dynamic(() => import("../homepage/GridTopic"));

const StudyView = ({
    appInfo,
    listTopics,
    gameState,
    contentData,
    tests,
}: {
    appInfo: IAppInfo;
    listTopics: ITopic[];
    gameState: GameState;
    contentData: IWebData;
    tests: ITestInfo[];
}) => {
    let isFinish = gameState.isFinishGame;
    const gameType = contentData.gameType;
    const listBranchs =
        getAppTopics()
            .find((app) => app.appId == appInfo.appId)
            ?.topics?.filter((t) => t.isBranch) ?? [];
    const showAnswerSheet = contentData.type == SYNC_TYPE.TYPE_LEARN_TEST;
    const ref = useRef<HTMLDivElement>(null);
    // SEO
    let tempCount = 0;
    const setIsTester = () => {
        tempCount++;
        if (tempCount == 0) {
            setTimeout(() => {
                tempCount = 0;
            }, 5000);
        }
        if (tempCount >= 10) {
            setSession(Config.TESTER_KEY, "true");
            alert("You are tester!");
            location.reload();
        }
    };
    useEffect(() => {
        if (typeof window != "undefined") {
            // khi có tương tác với trang thì sẽ kéo phần nội dung (banner download, seo) ở dưới màn hình lên
            window.onscroll = (e) => {
                if (ref?.current?.className != undefined)
                    if (!ref.current.className.includes("nested")) ref.current.className = "nested";
            };
            window.onclick = (e) => {
                if (ref?.current?.className != undefined)
                    if (!ref.current.className.includes("nested")) ref.current.className = "nested";
            };
            window.ontouchstart = (e) => {
                if (ref?.current?.className != undefined)
                    if (!ref.current.className.includes("nested")) ref.current.className = "nested";
            };
            window.onkeydown = (e) => {
                if (ref?.current?.className != undefined)
                    if (!ref.current.className.includes("nested")) ref.current.className = "nested";
            };
        }
    }, []);
    return (
        <>
            <div className="__768" style={{ height: 60 }}>
                {isFinish == 0 ? (
                    <HeaderStudyV4 gameState={gameState} isTopicTest={gameType == Config.TOPIC_GAME} appInfo={appInfo} />
                ) : isFinish == 1 ? (
                    <div
                        className="align-center"
                        style={{
                            lineHeight: "23px",
                            height: 60,
                            justifyContent: "center",
                            textAlign: "center",
                            fontWeight: 600,
                            padding: "0 16px",
                        }}
                    >
                        {contentData.title}
                    </div>
                ) : (
                    <></>
                )}
            </div>

            <MyContainer>
                <div className="v4-study-main-view-0" id="v4-study-main-view-0">
                    <div className="v4-study-main-view-left-bar-0 _769">
                        <div className="v4-study-breadcum">
                            <Link href="/" prefetch={false}>
                                Home
                            </Link>
                            {isParentApp() && (
                                <>
                                    <img src="/images/arrow-left.png" alt="" width={12} height={12} />
                                    <Link href={getLink(appInfo)}>{appInfo.appName}</Link>

                                    {!!contentData._state && (
                                        <>
                                            <img src="/images/arrow-left.png" alt="" width={12} height={12} />
                                            <Link href={getLink(appInfo, contentData._state)}>
                                                {contentData._state.replaceAll("-", " ")}
                                            </Link>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                        {showAnswerSheet && <AnswerSheet gameState={gameState} contentData={contentData} />}
                        {!!(gameType === Config.TOPIC_GAME) && (
                            <div className="v4-study-list-topics-0">
                                <h3 className="v4-font-semi-bold">{`More ${appInfo.appName} Topics`}</h3>
                                <GridTopic
                                    listTopics={listTopics}
                                    highlightedTopicId={gameState.id}
                                    appInfo={appInfo}
                                    priority={4}
                                    place="study"
                                    _state={contentData._state}
                                />
                            </div>
                        )}
                        {(gameType === Config.TOPIC_GAME ??
                            (gameType === Config.BRANCH_TEST_GAME ? listBranchs : tests).length > 1) && (
                            <div className="v4-study-list-branches-0 v4-border-radius">
                                <h3 className="v4-font-semi-bold">{`More ${appInfo.appName} Tests`}</h3>
                                {(gameType === Config.BRANCH_TEST_GAME ? listBranchs : tests).map((t, i) => {
                                    let url = "";
                                    let title = "";
                                    if (gameType === Config.BRANCH_TEST_GAME) {
                                        url = t.url;
                                        title = t.title;
                                    } else {
                                        url = t.slug;
                                        title = t.title + ((t.title as string).toLowerCase().endsWith("test") ? "" : " Test");
                                    }
                                    return (
                                        <a
                                            key={i}
                                            href={url}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                ga.event({
                                                    action: "click_menu_branch_test",
                                                    params: {
                                                        from: window.location.href,
                                                        to: t.url,
                                                    },
                                                });
                                                window.location.href = url;
                                            }}
                                        >
                                            {title}
                                        </a>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <div className="v4-main-study-content">
                        <h1
                            className={"v4-study-title v4-font-semi-bold " + (isFinish ? "" : "unfinish")}
                            onClick={() => {
                                setIsTester();
                            }}
                        >
                            {contentData.title}
                        </h1>
                        {isFinish == 1 ? (
                            <EndTestV4
                                gameState={gameState}
                                appInfo={appInfo}
                                currentTopic={listTopics.find((t) => gameState.id.includes(t.id))}
                                _state={contentData._state}
                            />
                        ) : isFinish == 0 ? (
                            <>
                                <MainStudyView gameState={gameState} appInfo={appInfo} />
                                <div id="v4-main-study-other-content" ref={ref}>
                                    <StudyBannerDownloadApp
                                        appInfo={appInfo}
                                        place={
                                            gameType == Config.TEST_GAME
                                                ? "full_test"
                                                : gameType == Config.TOPIC_GAME
                                                ? "topic"
                                                : "branch_test"
                                        }
                                    />
                                    {!!contentData?.content ? (
                                        <div
                                            className="v4-study-topic-seo-content v4-border-radius"
                                            dangerouslySetInnerHTML={{
                                                __html: (contentData?.content ?? "").replace(/\[/g, "<").replace(/\]/g, ">"),
                                            }}
                                        />
                                    ) : (
                                        <div style={{ height: 64 }} />
                                    )}
                                </div>
                            </>
                        ) : (
                            <V4CircleProgress />
                        )}
                    </div>
                </div>
            </MyContainer>
        </>
    );
};

export default StudyView;
