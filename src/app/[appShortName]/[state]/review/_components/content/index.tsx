import React, { Fragment, useContext } from "react";
import RandomQuestions from "./random";
import { ReviewContext } from "../../_components/context/reviewContext";
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
    return <Fragment>{componentMapping[selectType]}</Fragment>;
};

export default React.memo(ReviewContentGroup);
