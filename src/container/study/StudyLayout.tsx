import useMediaQuery from "@mui/material/useMediaQuery";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import StudyView from "../../components/study-v4/StudyView";
import { IAppInfo } from "../../models/AppInfo";
import { ITopic } from "../../models/Topic";
import { GameState, getStudyData } from "@/redux/features/game";
import AppState from "@/redux/appState";
import IWebData from "@/types/webData";
import { useEffect } from "react";

const HeaderV4 = dynamic(() => import("../../components/header/HeaderV4"));

const StudyLayout = ({
    appInfo,
    listTopics,
    contentData,
}: {
    appInfo: IAppInfo;
    listTopics: ITopic[];
    contentData: IWebData;
}) => {
    const gameState: GameState = useSelector((state: AppState) => state.gameReducer);
    const isDesktop = useMediaQuery("(min-width:769px)");
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getStudyData(contentData));
    }, [dispatch]);
    return (
        <div className="use-background">
            {isDesktop && <HeaderV4 appInfo={appInfo} topics={listTopics} />}
            <StudyView appInfo={appInfo} listTopics={listTopics} gameState={gameState} contentData={contentData} />
        </div>
    );
};

export default StudyLayout;
