import useMediaQuery from "@mui/material/useMediaQuery";
import dynamic from "next/dynamic";
import Config from "../../config";
import { SYNC_TYPE } from "../../config/config_sync";
import listAppTopic from "../../data/topic-landing-page.json";
// import * as ga from "../../lib/ga";
import { IAppInfo } from "../../models/AppInfo";
import { ITopic } from "../../models/Topic";
import "./StudyView.scss";
import { setSession } from "../../config/config_web";
import MyContainer from "../v4-material/MyContainer";
import { useEffect, useRef } from "react";
import IWebData from "@/types/webData";
import { GameState } from "@/redux/features/game";

const MainStudyView = dynamic(() => import("./MainStudyView"));
const HeaderStudyV4 = dynamic(() => import("./HeaderStudyV4"));
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
    const isDesktop = useMediaQuery("(min-width:769px)");
    const isFinish = gameState.isFinish;
    const gameType = gameState.gameType;
    let topicsApp = listAppTopic.find((app) => app.appName == appInfo.appShortName).topics.filter((t) => t.isBranch);
    let showAnswerSheet = contentData.type == SYNC_TYPE.TYPE_LEARN_TEST;
    const ref = useRef<HTMLDivElement>(null);
    // SEO
    const isStudyGame = !contentData?.slug?.includes("full-length-") && !contentData?.isBranch;
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
            {!isFinish && !isDesktop ? (
                <>
                    <MyContainer style={{ background: "#fff" }}>
                        <HeaderStudyV4 gameState={gameState} />
                    </MyContainer>
                    {gameState.gameType == Config.STUDY_GAME ? <LevelGameProgress gameState={gameState} /> : <></>}
                </>
            ) : (
                <></>
            )}
            <MyContainer>
                <div className="v4-study-main-view-0" id="v4-study-main-view-0">
                    {isDesktop && (
                        <div className="v4-study-main-view-left-bar-0">
                            {showAnswerSheet && <AnswerSheet gameState={gameState} contentData={contentData} />}
                            {isStudyGame || gameType === Config.STUDY_GAME ? (
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
                                contentData?.isBranch && (
                                    <div className="v4-study-list-branches-0 v4-border-radius">
                                        <h3 className="v4-font-semi-bold">{`More ${appInfo.appName} Tests`}</h3>
                                        {topicsApp.map((t, i) => (
                                            <a
                                                key={i}
                                                href={t.url}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    // ga.event({
                                                    //     action: "click_menu_branch_test",
                                                    //     params: {
                                                    //         from: window.location.href,
                                                    //         to: t.learnUrl,
                                                    //     },
                                                    // });
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
                    )}
                    <div className="v4-main-study-content">
                        {/* {!isFinish && !isDesktop && <HeaderStudyV4 gameState={gameState} />} */}
                        <h1
                            className={"v4-study-title v4-font-semi-bold " + (isFinish ? "" : "unfinish")}
                            onClick={() => {
                                setIsTester();
                            }}
                        >
                            {contentData.title}
                        </h1>
                        {isFinish ? (
                            <EndTestV4
                                gameState={gameState}
                                appInfo={appInfo}
                                currentTopic={listTopics.find((t) => gameState.id.includes(t.id))}
                            />
                        ) : (
                            <>
                                <MainStudyView gameState={gameState} appInfo={appInfo} />
                                <div id="v4-main-study-other-content" ref={ref}>
                                    <StudyBannerDownloadApp
                                        appInfo={appInfo}
                                        isDesktop={isDesktop}
                                        place={
                                            gameType == Config.TEST_GAME
                                                ? "full_test"
                                                : gameType == Config.STUDY_GAME
                                                ? "topic"
                                                : ""
                                        }
                                    />
                                    <div
                                        className="v4-study-topic-seo-content v4-border-radius"
                                        dangerouslySetInnerHTML={{
                                            __html: (contentData?.content ?? "").replace(/\[/g, "<").replace(/\]/g, ">"),
                                        }}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </MyContainer>
        </>
    );
};

const LevelGameProgress = ({ gameState }: { gameState: GameState }) => {
    let numOfCorrectAnswer = 0;
    let numOfLearningAnswer = 0;
    let totalQuestion = gameState.questions.length;
    gameState.questions.forEach((q) => {
        // điều kiện tương tự phần (**#**) bên MainStudyView
        if (q.questionStatus == Config.QUESTION_ANSWERED_CORRECT) {
            numOfCorrectAnswer++; // nếu trả lời đúng câu này
        } else if (q.questionStatus == Config.QUESTION_ANSWERED_INCORRECT) {
            numOfLearningAnswer++; // nếu trả lời sai câu này
        } else if (q.questionStatus == Config.QUESTION_NOT_ANSWERED) {
            // nếu chưa trả lời câu này (2 tình huống cần xét)
            if (gameState.answeredQuestionIds.includes(q.id)) {
                //trả lời lại:
                if (gameState.arrayIndexWrong.includes(q.index)) {
                    // [trả lời sai trước đó]
                    numOfLearningAnswer++;
                } else {
                    //[trả lời đúng nhưng random lại khi mà tiếp tục sai câu cuối cùng]
                    numOfCorrectAnswer++;
                }
            }
        }
    });
    return (
        <div style={{ height: "4px", background: "rgba(33, 33, 33, 0.2)", width: "100%", display: "flex" }}>
            <div
                style={{
                    width: totalQuestion == 0 ? 0 : (numOfCorrectAnswer * 100) / totalQuestion + "%",
                    background: "#00E291",
                    transition: "0.1s width",
                }}
            />
            <div
                style={{
                    width: totalQuestion == 0 ? 0 : (numOfLearningAnswer * 100) / totalQuestion + "%",
                    background: gameState.levelTag.includes("level") ? "#EBAD34" : "#F58383",
                    transition: "0.1s width",
                }}
            />
        </div>
    );
};
export default StudyView;
