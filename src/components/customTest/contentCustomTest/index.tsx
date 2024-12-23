import BottomBtn from "@/components/study/contentGroup/mainStudyView/bottomBtn/bottomBtn";
import ChoicesPanel from "@/components/study/contentGroup/mainStudyView/choicesPanel/choicesPanel";
import ProgressQuestion from "@/components/study/contentGroup/mainStudyView/progress/progressQuestion";
import QuestionContent from "@/components/study/contentGroup/mainStudyView/question/questionContent";
import TitleQuestion from "@/components/study/contentGroup/mainStudyView/title/titleQuestion";
import { gameState } from "@/redux/features/game";
import { useAppSelector } from "@/redux/hooks";
import { MathJaxContext } from "better-react-mathjax";

import React, { Fragment } from "react";

const ContentCustomTest = () => {
    const { listQuestion } = useAppSelector(gameState);

    return (
        <MathJaxContext>
            <div className=" sm:shadow-custom bg-transparent sm:bg-white  rounded-2xl dark:bg-black">
                {listQuestion.length > 0 ? (
                    <Fragment>
                        <div className="sm:p-4 flex flex-col gap-3">
                            <TitleQuestion />
                            <ProgressQuestion />
                            <QuestionContent showStatus={false} />
                            <ChoicesPanel />
                        </div>
                        <BottomBtn />
                    </Fragment>
                ) : (
                    <div className="p-4">Empty</div>
                )}
            </div>
        </MathJaxContext>
    );
};

export default React.memo(ContentCustomTest);
