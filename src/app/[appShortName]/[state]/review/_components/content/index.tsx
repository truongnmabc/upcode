import React, { Fragment, useContext } from "react";
import RandomQuestions from "./random";
import { ReviewContext } from "../context";
import WeakQuestions from "./weak";
import HardQuestions from "./hard";
import SavedQuestions from "./saved";
import AllQuestions from "./all";
import BottomLestTest from "../bottom";

const ReviewContentGroup = () => {
    const { selectType } = useContext(ReviewContext);
    const componentMapping = {
        random: <RandomQuestions />,
        weak: <WeakQuestions />,
        hard: <HardQuestions />,
        saved: <SavedQuestions />,
        all: <AllQuestions />,
    };
    return (
        <Fragment>
            {componentMapping[selectType]}
            <BottomLestTest />
        </Fragment>
    );
};

export default React.memo(ReviewContentGroup);
