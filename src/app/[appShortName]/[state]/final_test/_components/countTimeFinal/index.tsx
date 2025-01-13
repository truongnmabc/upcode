import CountTime from "@/components/countTime";
import { selectRemainTime } from "@/redux/features/game.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import finishFinalThunk from "@/redux/repository/game/finish/finishFinal";
import RouterApp from "@/router/router.constant";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const CountTimeFinalTest = () => {
    const dispatch = useAppDispatch();

    const remainTime = useAppSelector(selectRemainTime);
    const router = useRouter();

    const handleEndTime = useCallback(() => {
        dispatch(finishFinalThunk());

        router.replace(RouterApp.ResultTest, {
            scroll: true,
        });
    }, [dispatch, router]);

    return <CountTime duration={remainTime} onEndTime={handleEndTime} />;
};

export default CountTimeFinalTest;
