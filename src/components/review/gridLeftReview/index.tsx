import React from "react";
import AnswerReview from "./answer";
import ListReview from "./listReview";

const GridLeftReview = () => {
    return (
        <div className="hidden sm:flex flex-col gap-3">
            <AnswerReview />
            <p className="text-xl font-semibold">Review</p>
            <ListReview />
        </div>
    );
};

export default React.memo(GridLeftReview);
