import { viewTest } from "@/redux/features/game";
import {
    selectCurrentQuestionIndex,
    selectListQuestion,
} from "@/redux/features/game.reselect";
import { shouldOpenSubmitTest } from "@/redux/features/tests";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useCallback, useEffect, useState } from "react";
import { MtUiButton } from "../button";
const BtnMobile = () => {
    const dispatch = useAppDispatch();
    const indexCurrentQuestion = useAppSelector(selectCurrentQuestionIndex);
    const listQuestion = useAppSelector(selectListQuestion);

    const [listLength, setListLength] = useState(0);

    useEffect(() => {
        if (listQuestion.length) setListLength(listQuestion.length);
    }, [listQuestion.length]);

    const handlePrev = useCallback(() => {
        dispatch(viewTest(indexCurrentQuestion - 1));
    }, [dispatch, indexCurrentQuestion]);

    const handleNext = useCallback(() => {
        if (indexCurrentQuestion + 1 < listLength) {
            dispatch(viewTest(indexCurrentQuestion + 1));
        } else {
            dispatch(shouldOpenSubmitTest(true));
        }
    }, [dispatch, indexCurrentQuestion, listLength]);

    return (
        <div className=" w-full flex items-center gap-4 sm:p-4 sm:w-fit">
            <MtUiButton
                animated
                className="py-3 px-8 border-primary bg-white text-primary"
                block
                onClick={handlePrev}
                disabled={indexCurrentQuestion - 1 < 0}
            >
                Previous
            </MtUiButton>
            <MtUiButton
                animated
                className="py-3 px-8 border-primary text-primary"
                block
                onClick={handleNext}
                type="primary"
            >
                Next
            </MtUiButton>
        </div>
    );
};

export default React.memo(BtnMobile);
