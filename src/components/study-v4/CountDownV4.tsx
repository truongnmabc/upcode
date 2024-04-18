import { useEffect } from "react";
import { convertTime } from "../../utils";
import ClockIcon from "../icon/ClockIcon";
import "./CountDownV4.scss";
import { useDispatch, useSelector } from "react-redux";
import { GameState } from "@/redux/features/game";
import AppState from "@/redux/appState";
import { setTimeTest } from "@/redux/features/timeLeft";
import { onGameSubmitted } from "@/redux/reporsitory/game.repository";
// import { getSession } from "../../config_web";
// const tester = getSession(Config.TESTER_KEY);
const CountDownV4 = ({ gameState }: { gameState: GameState }) => {
    const dispatch = useDispatch();
    const timeLeft: number = useSelector(
        (state: AppState) => state.timeLeftReducer.data[gameState.id + ""]?.timeTest ?? gameState.timeTest
    );
    useEffect(() => {
        if (timeLeft == 0) {
            //submit game
            dispatch(onGameSubmitted());
        } else {
            let timer = setTimeout(() => {
                // let _timeLeft = timeLeft;
                // if (tester) {
                //     if (_timeLeft > 135) _timeLeft = 135;
                // }
                dispatch(setTimeTest({ timeTest: timeLeft - 1, id: gameState.id }));
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);
    return (
        <div className="v4-count-down-time-test-0 v4-flex">
            <ClockIcon /> <span>{convertTime(timeLeft)}</span>
        </div>
    );
};

export default CountDownV4;
