import React, { useContext } from "react";
import ChoiceRangeQuestion from "./choiceRangeQuestion";
import { ReviewContext } from "../../context/reviewContext";

const ReviewContentGroup = () => {
    const { setSelectType, selectType } = useContext(ReviewContext);

    return (
        <div>
            <ChoiceRangeQuestion />
        </div>
    );
};

export default React.memo(ReviewContentGroup);
