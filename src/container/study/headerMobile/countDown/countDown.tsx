import { useEffect } from "react";
import "./CountDownV4.scss";
import { convertTime } from "@/utils/time";
import { gameState } from "@/lib/redux/features/game";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import ClockIcon from "@/components/icon/ClockIcon";

const CountDownV4 = () => {
  // *NOTE : Cần sửa lại, không dispatch time
  const dispatch = useAppDispatch();
  const { currentGame } = useAppSelector(gameState);
  let _key = currentGame.id;
  //   const timeLeft: number = useAppSelector((state: AppState) =>
  //     state.timeLeftReducer.data[_key]?.timeTest >= 0
  //       ? state.timeLeftReducer.data[_key]?.timeTest
  //       : currentTopic.defaultTimeTest
  //   );

  //   useEffect(() => {
  //     if (timeLeft == 0) {
  //       //submit game
  //       dispatch(onGameSubmitted());
  //     } else {
  //       let timer = setTimeout(() => {
  //         // let _timeLeft = timeLeft;
  //         // if (tester) {
  //         //     if (_timeLeft > 135) _timeLeft = 135;
  //         // }
  //         dispatch(
  //           setTimeTest({
  //             timeTest: timeLeft - 1,
  //             id: currentTopic.id,
  //           })
  //         );
  //         // dispatch(
  //         //     updateToListGameState({
  //         //         ...gameState,
  //         //         timeTest: timeLeft - 1,
  //         //     })
  //         // );
  //       }, 1000);
  //       return () => clearTimeout(timer);
  //     }
  //   }, [timeLeft]);

  return (
    <div className="v0-count-down-time-test-0 gap-1 items-center flex">
      {/* <ClockIcon width={24} height={24} /> <span>{convertTime(timeLeft)}</span> */}
    </div>
  );
};

export default CountDownV4;
