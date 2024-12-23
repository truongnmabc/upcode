import React, { Fragment } from "react";
import TabsReviewAnswer from "./tabsReviewAnswer";

const ReviewAnswerResult = () => {
    return (
        <Fragment>
            <p className="text-2xl font-semibold">Review your answers</p>
            <TabsReviewAnswer />
        </Fragment>
    );
};

export default ReviewAnswerResult;
