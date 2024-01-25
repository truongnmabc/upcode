import dynamic from "next/dynamic";
import Config from "../../config";
import { SYNC_TYPE } from "../../config/config_sync";
import listAppTopic from "../../data/topic-landing-page.json";
import * as ga from "../../services/ga";
import { IAppInfo } from "../../models/AppInfo";
import { ITopic } from "../../models/Topic";
import "./StudyView.scss";
import { setSession } from "../../config/config_web";
import MyContainer from "../v4-material/MyContainer";
import { useEffect, useRef } from "react";
import IWebData from "@/types/webData";
import { GameState } from "@/redux/features/game";
import V4CircleProgress from "../v4-material/V4CircleProgress";
const MainStudyView = dynamic(() => import("./MainStudyView"));
const HeaderStudyV4 = dynamic(() => import("./HeaderStudyV4"), { ssr: false });
const StudyBannerDownloadApp = dynamic(() => import("./StudyBannerDownloadApp"));
const EndTestV4 = dynamic(() => import("./end-test-v4"));
const AnswerSheet = dynamic(() => import("./AnswerSheet"));
const GridTopic = dynamic(() => import("../homepage/GridTopic"));

const StudyView = ({
    appInfo,
    listTopics,
    gameState,
    contentData,
}: {
    appInfo: IAppInfo;
    listTopics: ITopic[];
    gameState: GameState;
    contentData: IWebData;
}) => {
    let isFinish = gameState.isFinishGame;
    const gameType = contentData.gameType;
    const listBranchs =
        listAppTopic.find((app) => app.appName == appInfo.appShortName)?.topics?.filter((t) => t.isBranch) ?? [];
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
        }
    }, []);
    return (
        <>
            <div className="__768" style={{ height: 60 }}>
                {isFinish == 0 ? (
                    <HeaderStudyV4 gameState={gameState} showProgress={gameType == Config.TOPIC_GAME} />
                ) : isFinish == 1 ? (
                    <div>{contentData.title}</div>
                ) : (
                    <></>
                )}
            </div>

            <MyContainer>
                <div className="v4-study-main-view-0" id="v4-study-main-view-0">
                    <div className="v4-study-main-view-left-bar-0 _769">
                        {showAnswerSheet && <AnswerSheet gameState={gameState} contentData={contentData} />}
                        {gameType === Config.TOPIC_GAME ? (
                            <div className="v4-study-list-topics-0">
                                <h3 className="v4-font-semi-bold">{`More ${appInfo.appName} Topics`}</h3>
                                <GridTopic
                                    listTopics={listTopics}
                                    highlightedTopicId={gameState.id}
                                    appInfo={appInfo}
                                    priority={4}
                                    place="study"
                                />
                            </div>
                        ) : (
                            gameType === Config.BRANCH_TEST_GAME && (
                                <div className="v4-study-list-branches-0 v4-border-radius">
                                    <h3 className="v4-font-semi-bold">{`More ${appInfo.appName} Tests`}</h3>
                                    {listBranchs.map((t, i) => (
                                        <a
                                            key={i}
                                            href={t.url}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                ga.event({
                                                    action: "click_menu_branch_test",
                                                    params: {
                                                        from: window.location.href,
                                                        to: t.learnUrl,
                                                    },
                                                });
                                                window.location.href = t.url;
                                            }}
                                        >
                                            {t.title}
                                        </a>
                                    ))}
                                </div>
                            )
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
                                                : ""
                                        }
                                    />
                                    {!!contentData?.content && (
                                        <div
                                            className="v4-study-topic-seo-content v4-border-radius"
                                            dangerouslySetInnerHTML={{
                                                __html: (contentData?.content ?? "").replace(/\[/g, "<").replace(/\]/g, ">"),
                                            }}
                                        />
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
