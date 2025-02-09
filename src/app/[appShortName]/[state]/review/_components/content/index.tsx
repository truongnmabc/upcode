import dynamic from "next/dynamic";
import React, { useContext } from "react";
import BottomLestTest from "../bottom";
import { ReviewContext } from "../context";
import SheetSelectQuestions from "../sheet";

const RandomQuestions = dynamic(() => import("./random"), {
    ssr: false,
});
const WeakQuestions = dynamic(() => import("./weak"), {
    ssr: false,
});
const HardQuestions = dynamic(() => import("./hard"), {
    ssr: false,
});
const SavedQuestions = dynamic(() => import("./saved"), {
    ssr: false,
});
const AllQuestions = dynamic(() => import("./all"), {
    ssr: false,
});
const RandomGameContent = dynamic(() => import("./random/randomGameContent"), {
    ssr: false,
});

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
        <div>
            {isStart ? <RandomGameContent /> : componentMapping[selectType]}
            <BottomLestTest />
            {isMobile && <SheetSelectQuestions />}
        </div>
    );
};

export default React.memo(ReviewContentGroup);
