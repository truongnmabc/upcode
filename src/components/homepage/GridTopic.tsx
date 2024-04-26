import { useDispatch, useSelector } from "react-redux";
import * as ga from "../../services/ga";
import { IAppInfo } from "../../models/AppInfo";
import { ITopic } from "../../models/Topic";
import { GameState, getNumOfCorrectAnswer } from "../../redux/features/game";
import TargetIcon from "../icon/TargetIcon";
import "./GridTopic.scss";
import { getGameProgress, getHighhestLevelOfTopicBePracticed } from "../../utils/v4_study";
import { SYNC_TYPE } from "../../config/config_sync";
import { memo } from "react";
import { render } from "react-dom";
import getRawTopicsData from "../../utils/getRawTopicsData";
import AppState from "@/redux/appState";
import { getStudyData } from "@/redux/reporsitory/game.repository";
import Config from "@/config";

const RANDOM_COLORS = [
    "#30749F",
    "#E68A4F",
    "#309F98",
    "#8CCAC7",
    "#DAB542",
    "#656C86",
    "#789A6B",
    "#859051",
    "#CCA68B",
    "#4fdbb7",
    "#962434",
    "#729e1d",
    "#eaae2a",
    "#86b5fe",
    "#c7be6d",
    "#e46873",
    "#a5b34f",
    "#43c59e",
    "#984fe6",
    "#4a2267",
    "#11c8c4",
    "#579362",
    "#b95226",
    "#8f6232",
    "#5d9133",
    "#97af7a",
    "#7b9bd1",
    "#c9c695",
];

interface ITopicJson {
    icon: string;
    tag: string;
    name: string;
    topics: any[];
    id: string;
    slug: string;
}

const GridTopic = ({
    listTopics,
    highlightedTopicId = "-2",
    appInfo,
    priority = 3,
    place = "",
    allowExpand = true,
    _state,
}: {
    listTopics: ITopic[]; // cân nhắc trường hợp lấy từ redux ra, không truyền tham số như này nữa
    highlightedTopicId?: string;
    appInfo: IAppInfo;
    priority?: 1 | 2 | 3 | 4;
    place?: string;
    allowExpand?: boolean;
    _state: string;
}) => {
    let topics: ITopic[] | ITopicJson[] = listTopics.map((a) => {
        return { ...a };
    });
    let listGameState: GameState[] = useSelector((state: AppState) => state.listGameReducer.games);
    if (!topics.length) {
        // trường hợp listTopics chưa lấy được từ redux ra sẽ lấy topic từ file JSON
        // để hiển thị link và tên topic cho SEO
        topics = getRawTopicsData(appInfo, _state);
    }
    try {
        topics.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
    } catch (e) {
        console.log(e);
    }
    topics = topics.map((t, i) => ({ ...t, color: RANDOM_COLORS[i] }));
    topics.sort((a, b) => {
        if (highlightedTopicId.includes(a.id + "")) return -1; // đưa topic đang làm lên đầu tiên
        return 1;
    });
    const dispatch = useDispatch();
    const dispatchAction = (data: any) => {
        dispatch(getStudyData({ ...data, _state: _state }));
    };

    console.log("xx0", highlightedTopicId);

    return (
        <div className={`v4-grid-topic-0 ${place}`}>
            {topics.map((topic, index) => {
                let isHighlighted = highlightedTopicId.includes(topic.id);
                let _href = topic.slug;
                return (
                    <div key={index} id={index}>
                        <a
                            className="v4-grid-topic-item-0 v4-border-radius"
                            href={_href}
                            onMouseOver={(e) => {
                                if (window.innerWidth > 768) {
                                    e.currentTarget.style.borderColor = topic.color;
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (window.innerWidth > 768) {
                                    e.currentTarget.style.borderColor = isHighlighted ? topic.color : "var(--border-color)";
                                }
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                ga.event({
                                    action: "click_topic",
                                    params: {
                                        from: window.location.href,
                                        to: topic.tag,
                                    },
                                });
                                if (allowExpand && place == "home") {
                                    let expandComponent = document.getElementById("expand-topic-" + index);
                                    let content = document.getElementById("topic-progress-" + index);
                                    if (!content.hasChildNodes()) {
                                        // viết như này để ở cải thiện total blocking time ở trang home (warning khi nội dung trong này không hiện ra nhưng vẫn phải load rất nhiều (trong này cũng không cần check link và seo))
                                        render(
                                            <TopicLevelProgress
                                                levels={topic?.topics ?? []}
                                                currentTopic={topic}
                                                place={place}
                                                listGameState={listGameState}
                                                dispatchAction={dispatchAction}
                                                topicUrl={_href}
                                            />,
                                            content
                                        );
                                    }
                                    if (expandComponent.className.includes("expand-topic-level")) {
                                        //đang mở thì đóng lại
                                        expandComponent.style.height = "0";
                                        expandComponent.className = "topic-levels";
                                    } else {
                                        // đang đóng thì mở ra đồng thời đóng tất cả các cái khác (chỉ expand 1 topic 1 lần)
                                        let _h = 0; // độ cao của phần content đang được expand phía trước topic muốn expand
                                        for (let i = 0; i < topics.length; i++) {
                                            let component = document.getElementById("expand-topic-" + i);
                                            if (component.className.includes("expand-topic-level")) {
                                                let _content = document.getElementById("topic-progress-" + i);
                                                if (i < index) _h += _content.clientHeight;
                                                component.style.height = "0";
                                                component.className = "topic-levels";
                                            }
                                        }
                                        let _y = expandComponent.getBoundingClientRect().y;
                                        if (_y + content.clientHeight > window.innerHeight) {
                                            let scrollPos =
                                                expandComponent.offsetTop + content.clientHeight - _h - window.innerHeight + 8; // +8 để nó không sát mép dưới màn hình thôi
                                            if (scrollPos < 0) scrollPos = 0;
                                            window.scrollTo({ top: scrollPos });
                                        }
                                        expandComponent.style.height = content.clientHeight + "px"; // phải là set height trước className
                                        expandComponent.className += " expand-topic-level";
                                    }

                                    return;
                                }
                                if (!window.location.href.includes(_href)) window.location.href = _href;
                            }}
                            style={{
                                borderColor: isHighlighted ? topic.color : "var(--border-color)",
                            }}
                        >
                            <div
                                className="v4-grid-topic-icon"
                                style={{
                                    background: topic.color,
                                }}
                            >
                                <img src={topic.icon} alt={appInfo?.appName + " " + topic.name + " Practice Test"} />
                            </div>
                            {priority == 1 && <h1 className="-h_i v4-font-semi-bold">{topic.name}</h1>}
                            {priority == 2 && <h2 className="-h_i v4-font-semi-bold">{topic.name}</h2>}
                            {priority == 3 && <h3 className="-h_i v4-font-semi-bold">{topic.name}</h3>}
                            {priority == 4 && <h4 className="-h_i v4-font-semi-bold">{topic.name}</h4>}
                        </a>

                        <div
                            id={"expand-topic-" + index}
                            className={
                                "topic-levels" +
                                (place != "home" && // không phải trang home và cho phép expand và đang highlight thì expand luôn
                                allowExpand &&
                                isHighlighted
                                    ? " expand-topic-level"
                                    : "")
                            }
                            style={{
                                height: place != "home" && allowExpand && isHighlighted ? "248px" : "0",
                            }}
                        >
                            {allowExpand && topic?.topics?.length && (place == "home" ? true : isHighlighted) ? (
                                <div id={"topic-progress-" + index} className="topic-progress">
                                    {place != "home" && ( // các trang khác trang home cần expand luôn nên viết như này
                                        <TopicLevelProgress
                                            levels={topic?.topics ?? []}
                                            currentTopic={topic}
                                            place={place}
                                            topicUrl={_href}
                                            listGameState={listGameState}
                                            dispatchAction={dispatchAction}
                                        />
                                    )}
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// chú ý không dùng memo ở component này vì các tham số của nó không check được trường hợp trong phần học mình select vào các level để chuyển sang level đó => không activeAnim toả vòng đúng level mình chọn
const TopicLevelProgress = ({
    levels,
    currentTopic,
    place,
    listGameState,
    dispatchAction,
    topicUrl,
}: {
    levels: ITopic[];
    currentTopic: ITopic;
    place: string;
    listGameState: GameState[];
    dispatchAction: any;
    topicUrl: string;
}) => {
    console.log("xx2:", levels);

    let sequence = 3;
    let arr: Array<ITopic[]> = [];
    let idx = 0;
    for (let i = 0; i < levels.length; i++) {
        if (!arr[idx]) arr[idx] = [];
        arr[idx].push(levels[i]);
        if (arr[idx].length == sequence) idx++;
    }
    const strokeColor = "#E3A651";
    let highestLevel = getHighhestLevelOfTopicBePracticed(listGameState, currentTopic);
    return (
        <div className="v4-topic-level-container v4-border-radius">
            <div className="v4-topic-level">
                {arr.map((line, index) => {
                    return (
                        <div className="v4-topic-level-progress-0" key={index}>
                            {line.map((level, i) => {
                                let unlocked =
                                    index * sequence + i <= highestLevel ||
                                    (index == 0 && i == 0) ||
                                    level.tag == "mini-test" ||
                                    level.tag == "final-test"; // luôn mở level 0
                                let _href = `${topicUrl}#${level.tag}`;
                                let asPath = "";
                                if (typeof window !== "undefined") {
                                    asPath = window.location.href;
                                }
                                let activeAnim =
                                    place == "study" ? asPath.includes(_href) : highestLevel == index * sequence + i;
                                let isFinishThisLevel = -1;
                                let isPassThisLevel = false;
                                let currentLevelScore = 0;
                                let lvGame = listGameState.find((g) => g.id == level.id);
                                if (lvGame) {
                                    // nếu nó đã làm level này rồi
                                    isFinishThisLevel = lvGame.isFinishGame;
                                    let _ = getGameProgress(lvGame);
                                    let numOfCorrectAnswer = getNumOfCorrectAnswer(lvGame.questions);
                                    currentLevelScore = lvGame.questions.length
                                        ? Math.floor((numOfCorrectAnswer / lvGame.questions.length) * 100 + 0.5)
                                        : 0;
                                    if (isFinishThisLevel === 1) {
                                        isPassThisLevel = _.isPass;
                                    }
                                }
                                let thisFinalTestBePracticed = false;
                                if (level.tag == "final-test") {
                                    if (listGameState.find((g) => g.id + "" == level.id)) thisFinalTestBePracticed = true;
                                }

                                return (
                                    <a
                                        className="v4-level-item"
                                        key={i}
                                        href={_href}
                                        style={{
                                            marginLeft: i % sequence != 0 && index % 2 == 0 ? "40px" : "",
                                            marginRight: i % sequence != 0 && index % 2 == 1 ? "40px" : "",
                                            cursor: unlocked ? "pointer" : "not-allowed",
                                        }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (unlocked && !window.location.href.includes(_href)) {
                                                if (_href.includes(window.location.pathname)) {
                                                    let _action = "click_";
                                                    if (level.tag.includes("level")) _action += "level";
                                                    else _action = _action + level.tag.replace("-", "_") + "_round";
                                                    ga.event({
                                                        action: _action,
                                                        params: {
                                                            from: window.location.href,
                                                            to: level.tag,
                                                        },
                                                    });
                                                    // chọn level trong cùng 1 topic (không thay đổi path name nên không load lại trang) nên cần dispatch lại action này
                                                    dispatchAction({
                                                        fullSlug: _href.slice(1, _href.length), // bỏ dấu / vì trong này đang không xử lý dấu đó
                                                        type: SYNC_TYPE.TYPE_LEARN_TEST,
                                                        topicId: currentTopic.id,
                                                        gameType: Config.TOPIC_GAME,
                                                    });
                                                }
                                                // window.location.href = _href;
                                            }
                                        }}
                                    >
                                        {i % sequence != 0 && (
                                            <div
                                                className="v4-level-item-dashed"
                                                style={{
                                                    left: i % sequence != 0 && index % 2 == 0 ? "-40px" : "",
                                                    right: i % sequence != 0 && index % 2 == 1 ? "-40px" : "",
                                                }}
                                            >
                                                <svg width="40" height="1" viewBox="0 0 40 1" fill="none">
                                                    <line
                                                        y1="0.5"
                                                        x2="40"
                                                        y2="0.5"
                                                        stroke={strokeColor}
                                                        strokeDasharray="6 6"
                                                    />
                                                </svg>
                                            </div>
                                        )}
                                        {level.tag == "mini-test" ? (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    position: "relative",
                                                    height: "40px",
                                                }}
                                            >
                                                <svg
                                                    width="59"
                                                    height="54"
                                                    viewBox="0 0 59 54"
                                                    fill="none"
                                                    style={{
                                                        position: "absolute",
                                                        top: "-10px",
                                                        left: "50%",
                                                        transform: "translateX(-50%)",
                                                    }}
                                                >
                                                    <path
                                                        d="M49.6695 36.7343L35.1201 11.6958C32.6142 7.38341 26.3858 7.38341 23.8799 11.6958L9.33054 36.7343C6.81254 41.0676 9.93883 46.5 14.9506 46.5H44.0494C49.0612 46.5 52.1875 41.0676 49.6695 36.7343Z"
                                                        fill="white"
                                                        stroke={
                                                            !(isFinishThisLevel == 1)
                                                                ? strokeColor
                                                                : isPassThisLevel
                                                                ? "#00c17c"
                                                                : "#fb7072"
                                                        }
                                                        strokeWidth="5"
                                                    />
                                                    <path
                                                        d="M26.0415 12.9518C27.5836 10.2981 31.4164 10.2981 32.9585 12.9518L47.5079 37.9903C49.0574 40.657 47.1336 44 44.0494 44H14.9506C11.8664 44 9.94256 40.657 11.4921 37.9903L26.0415 12.9518Z"
                                                        fill="white"
                                                    />
                                                    {activeAnim && (
                                                        <path
                                                            d="M51.831 35.4782L37.2816 10.4398C33.812 4.46876 25.188 4.46876 21.7184 10.4398L7.16898 35.4782C3.68251 41.4782 8.01122 49 14.9506 49H44.0494C50.9888 49 55.3175 41.4782 51.831 35.4782Z"
                                                            stroke="#E3A651"
                                                            strokeOpacity="0.12"
                                                            strokeWidth="10"
                                                            className="anim-boundary anim-triangle"
                                                        />
                                                    )}
                                                </svg>
                                                <div className="v4-level-current">
                                                    {isFinishThisLevel == 1 ? (
                                                        <CheckedIcon color={isPassThisLevel ? "#00c17c" : "#fb7072"} />
                                                    ) : (
                                                        <span>
                                                            {currentLevelScore}
                                                            <small>%</small>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ) : level.tag == "final-test" ? (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    width: "fit-content",
                                                    borderRadius: "50%",
                                                    position: "relative",
                                                }}
                                                className={activeAnim ? "anim-boundary anim-circle" : ""}
                                            >
                                                <TargetIcon
                                                    color={
                                                        !(isFinishThisLevel == 1)
                                                            ? strokeColor
                                                            : isPassThisLevel
                                                            ? "#00c17c"
                                                            : "#fb7072"
                                                    }
                                                    showCenter={!thisFinalTestBePracticed}
                                                />
                                                {thisFinalTestBePracticed && (
                                                    <div className="v4-level-current">
                                                        {isFinishThisLevel == 1 ? (
                                                            <CheckedIcon color={isPassThisLevel ? "#00c17c" : "#fb7072"} />
                                                        ) : (
                                                            <span>
                                                                {currentLevelScore}
                                                                <small>%</small>
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div
                                                style={{
                                                    position: "relative",
                                                    zIndex: 1,
                                                }}
                                            >
                                                <div
                                                    className={
                                                        "v4-level-circle" + (activeAnim ? " anim-boundary anim-circle" : "")
                                                    }
                                                    style={{
                                                        backgroundColor: !(isFinishThisLevel == 1)
                                                            ? "#fff"
                                                            : isPassThisLevel
                                                            ? "#00c17c"
                                                            : "#fb7072",
                                                        borderColor: isFinishThisLevel == 1 ? "#fff" : "rgba(245, 245, 245, 1)",
                                                    }}
                                                >
                                                    {unlocked ? (
                                                        isFinishThisLevel == 1 ? (
                                                            <CheckedIcon />
                                                        ) : (
                                                            <span
                                                                style={{
                                                                    color: "rgba(33, 33, 33, 0.52)",
                                                                }}
                                                            >
                                                                {currentLevelScore}
                                                                <small>%</small>
                                                            </span>
                                                        )
                                                    ) : (
                                                        <img src="/images/lock.png" alt="" width={15} height={15} />
                                                    )}
                                                </div>
                                                <div className="shadow"></div>
                                            </div>
                                        )}
                                        <div className="v4-level-name">{level.name}</div>
                                    </a>
                                );
                            })}
                            {index % 2 == 0 && index < arr.length - 1 && (
                                <div className="v4-half-circle-right">
                                    <svg width="40" height="84" viewBox="0 0 38 74" fill="none">
                                        <path
                                            d="M0.220703 73C20.103 73 36.2207 56.8823 36.2207 37C36.2207 17.1177 20.103 1 0.220703 1"
                                            stroke={strokeColor}
                                            strokeDasharray="6 6"
                                        />
                                    </svg>
                                </div>
                            )}
                            {index % 2 == 1 && index < arr.length - 1 && (
                                <div className="v4-half-circle-left">
                                    <svg
                                        width="40"
                                        height="84"
                                        viewBox="0 0 38 74"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M37 73C17.1177 73 1 56.8823 1 37C1 17.1177 17.1177 1 37 1"
                                            stroke={strokeColor}
                                            strokeDasharray="6 6"
                                        />
                                    </svg>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const CheckedIcon = ({ color = "#fff" }: { color?: string }) => {
    return (
        <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M2.05078 5.92857L5.6067 9.48449C5.80926 9.68705 6.14027 9.67835 6.3319 9.46542L13.0508 2"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
            />
        </svg>
    );
};
export default memo(GridTopic, (prev, next) => {
    if (JSON.stringify(prev.listTopics).localeCompare(JSON.stringify(next.listTopics)) != 0) {
        return false;
    }
    if ((prev.highlightedTopicId ?? "-1").localeCompare(next.highlightedTopicId ?? "-1") != 0) {
        return false;
    }
    if (prev.appInfo.appId != next.appInfo.appId) {
        return false;
    }
    if (prev.priority != next.priority) {
        return false;
    }
    if ((prev.place ?? "").localeCompare(next.place ?? "") != 0) {
        return false;
    }
    if (prev.allowExpand != next.allowExpand) {
        return false;
    }
    return true;
});

let o = [
    "accuplacer",
    "ap-psychology",
    "apush",
    "ase-series-a",
    "asvab",
    "aws-cloud",
    "aws",
    "az-900",
    "capm",
    "cast",
    "cbest",
    "ccat",
    "ccna",
    "ccsp",
    "cdl",
    "ceh",
    "cfa",
    "cfa2",
    "chspe",
    "cissp",
    "cna",
    "comptiaa",
    "comptianetwork",
    "comptiasecurity",
    "cpa",
    "cpce",
    "cysa",
    "dat",
    "dmv",
    "driving-theory",
    "emt",
    "epa",
    "fsc",
    "ged",
    "gre",
    "hesi",
    "hiset",
    "hspt",
    "hvac",
    "journeyman-electrician",
    "mbe",
    "mblex",
    "naplex",
    "nasm",
    "nate",
    "nce",
    "nclexpn",
    "nclexrn",
    "nmls",
    "nswdkt",
    "ontariog1",
    "parapro",
    "part-107",
    "pccn",
    "pert",
    "phlebotomy",
    "phr",
    "pmp",
    "ptce",
    "real-estate",
    "series-7",
    "servsafe",
    "sie",
    "tabe",
    "tasc",
    "teas",
    "tsi",
    "vtne",
    "wonderlic",
];
