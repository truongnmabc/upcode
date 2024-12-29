import React, { useContext } from "react";
import RandomQuestions from "./random";
import { ReviewContext } from "../../context/reviewContext";
import WeakQuestions from "./weak";
import HardQuestions from "./hard";
import SavedQuestions from "./saved";
import AllQuestions from "./all";

const ReviewContentGroup = () => {
    const { selectType } = useContext(ReviewContext);
    const componentMapping = {
        random: <RandomQuestions />,
        weak: <WeakQuestions />,
        hard: <HardQuestions />,
        saved: <SavedQuestions />,
        all: <AllQuestions />,
    };
    return <div>{componentMapping[selectType]}</div>;
};

export default React.memo(ReviewContentGroup);
