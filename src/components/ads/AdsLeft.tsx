import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";
import { useSelector } from "react-redux";
import AppState from "@/redux/appState";
import Config from "@/config";
import dynamic from "next/dynamic";
const LeftAdsHorizontal = dynamic(() => import("./ads-google/ads-google").then((mod) => mod.LeftAdsHorizontal));

const AdsLeft = () => {
    const isMobile = useMediaQuery("(max-width:768px)");
    const isFinish = useSelector((state: AppState) => state.gameReducer.game.isFinishGame === Config.STATUS_GAME_FINISH);

    if (isMobile || isFinish) {
        return null;
    } else
        return (
            <div
                className="ads-left"
                style={{
                    position: "fixed",
                    zIndex: 101,
                    top: 0,
                    height: "80vh",
                    margin: "12px 0px 0px 16px",
                }}
            >
                <LeftAdsHorizontal />
            </div>
        );
};

export default AdsLeft;
