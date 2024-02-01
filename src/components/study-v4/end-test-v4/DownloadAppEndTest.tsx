import { GameState } from "@/redux/features/game";
import { IAppInfo } from "../../../models/AppInfo";
import DownloadAppV4 from "../../homepage/DownloadAppV4";
import "./DownloadAppEndTest.scss";

const DownloadAppEndTest = ({
    appInfo,
    isDesktop,
    gameState,
}: {
    gameState: GameState;
    appInfo: IAppInfo;
    isDesktop: boolean;
}) => {
    return (
        <div className="v4-download-end-test v4-border-radius">
            <div className="v4-download-end-test-left">
                <div className="text">Download App for more {gameState.gameTitle} questions</div>
                <DownloadAppV4 appInfo={appInfo} direction="row" size={isDesktop ? "m" : "s"} place="end_test" />
            </div>
            <div
                className="v4-download-end-test-right"
                style={{
                    backgroundImage: `url(/images/${appInfo.bucket}/study-banner-download-app.png)`,
                }}
            ></div>
        </div>
    );
};

export default DownloadAppEndTest;
