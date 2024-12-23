"use client";
import CountTimeRemain from "@/components/diagnostic_test/countTimeRemain";
import ClockIcon from "@/components/icon/ClockIcon";
import BottomBtn from "@/components/study/contentGroup/mainStudyView/bottomBtn/bottomBtn";
import ChoicesPanel from "@/components/study/contentGroup/mainStudyView/choicesPanel/choicesPanel";
import ProgressQuestion from "@/components/study/contentGroup/mainStudyView/progress/progressQuestion";
import QuestionContent from "@/components/study/contentGroup/mainStudyView/question/questionContent";
import TitleQuestion from "@/components/study/contentGroup/mainStudyView/title/titleQuestion";
import { MathJaxContext } from "better-react-mathjax";

const MainViewFinalTest = () => {
    return (
        <MathJaxContext>
            <div className=" sm:shadow-custom bg-transparent sm:bg-white  rounded-2xl dark:bg-black">
                <div className="sm:p-4 flex flex-col gap-3">
                    <TitleQuestion />
                    <ProgressQuestion isActions />
                    <div className="w-full flex items-center justify-center">
                        <div className="flex items-center justify-center w-fit gap-2">
                            <ClockIcon />
                            <CountTimeRemain />
                        </div>
                    </div>
                    <QuestionContent showStatus={false} />
                    <ChoicesPanel isActions />
                </div>

                <BottomBtn isShow />
            </div>
        </MathJaxContext>
    );
};

export default MainViewFinalTest;
