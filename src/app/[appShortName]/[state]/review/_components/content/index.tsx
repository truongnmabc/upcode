import React, { Fragment, useContext } from "react";
import RandomQuestions from "./random";
import { ReviewContext } from "../context";
import WeakQuestions from "./weak";
import HardQuestions from "./hard";
import SavedQuestions from "./saved";
import AllQuestions from "./all";
import BottomLestTest from "../bottom";
import RandomGameContent from "./random/randomGameContent";
import SheetSelectQuestions from "../sheet";

const ReviewContentGroup = ({ isMobile }: { isMobile: boolean }) => {
    const { selectType, isStart } = useContext(ReviewContext);
    const componentMapping = {
        random: <RandomQuestions isMobile={isMobile} />,
        weak: <WeakQuestions />,
        hard: <HardQuestions isMobile={isMobile} />,
        saved: <SavedQuestions />,
        all: <AllQuestions />,
    };
    return (
        <Fragment>
            {isStart ? (
                <Fragment>
                    <RandomGameContent />
                </Fragment>
            ) : (
                <Fragment>{componentMapping[selectType]}</Fragment>
            )}
            <BottomLestTest />
            {isMobile && <SheetSelectQuestions />}
        </Fragment>
    );
};

export default React.memo(ReviewContentGroup);
