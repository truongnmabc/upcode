import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";
import { useSelector } from "react-redux";
import AppState from "@/redux/appState";
import Config from "@/config";
import dynamic from "next/dynamic";
const RightAdsHorizontal = dynamic(() => import("./ads-google/ads-google").then((mod) => mod.RightAdsHorizontal));

const AdsRight = () => {
    const isFinish = useSelector((state: AppState) => state.gameReducer.game.isFinishGame === Config.STATUS_GAME_FINISH);
    const isMobile = useMediaQuery("(max-width:768px)");
    if (isMobile || isFinish) {
        return null;
    } else
        return (
            <div
                className="ads-right"
                style={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    zIndex: 101,
                    height: "80vh",
                    margin: "12px 16px 0 0px",
                }}
            >
                <RightAdsHorizontal />
            </div>
        );
};

export default AdsRight;
