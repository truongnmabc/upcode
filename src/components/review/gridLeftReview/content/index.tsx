import React from "react";
import ChoiceRangeQuestion from "./choiceRangeQuestion";

const ReviewContentGroup = () => {
    return (
        <div>
            <ChoiceRangeQuestion />
        </div>
    );
};

export default React.memo(ReviewContentGroup);
