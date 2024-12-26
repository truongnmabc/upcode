import AnswerSheet from "@/components/study/questionGroup/answer/answerSheet";
import React, { useContext } from "react";
import ListReview from "./listReview";

const GridLeftReview = () => {
    return (
        <div className="hidden sm:flex flex-col gap-3">
            <AnswerSheet />
            <p className="text-xl font-semibold">Review</p>
            <ListReview />
        </div>
    );
};

export default React.memo(GridLeftReview);
