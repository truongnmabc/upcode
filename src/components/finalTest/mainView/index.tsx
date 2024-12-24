"use client";
import ClockIcon from "@/components/icon/ClockIcon";
import BottomBtn from "@/components/study/contentGroup/mainStudyView/bottomBtn/bottomBtn";
import ChoicesPanel from "@/components/study/contentGroup/mainStudyView/choicesPanel/choicesPanel";
import ProgressQuestion from "@/components/study/contentGroup/mainStudyView/progress/progressQuestion";
import QuestionContent from "@/components/study/contentGroup/mainStudyView/question/questionContent";
import TitleQuestion from "@/components/study/contentGroup/mainStudyView/title/titleQuestion";
import { MathJaxContext } from "better-react-mathjax";
import CountTimeFinalTest from "../countTimeFinal";
import Keyboard from "@/components/study/contentGroup/mainStudyView/bottomBtn/keyboard";
import SubAction from "@/components/study/contentGroup/mainStudyView/bottomBtn/subAction";
import BtnSubmit from "@/components/study/contentGroup/mainStudyView/bottomBtn/btnSubmit";
import NextQuestionFinalPage from "../nextQuestionFinal";

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
                            <CountTimeFinalTest />
                        </div>
                    </div>
                    <QuestionContent showStatus={false} />
                    <ChoicesPanel isActions />
                </div>

                <div className="flex fixed sm:static shadow-bottom sm:shadow-none  bottom-0 left-0 right-0 z-50 bg-theme-dark sm:px-4 sm:bg-[#7C6F5B0F] flex-col sm:flex-row pb-8 pt-3 sm:py-3 justify-between gap-2 sm:gap-4 items-center ">
                    <div className="flex  gap-2 sm:gap-8 items-center">
                        <Keyboard />
                        <SubAction />
                    </div>
                    <div className="px-4 w-full flex items-center gap-2 sm:p-4 sm:w-fit">
                        <BtnSubmit isShow={true} />
                        <NextQuestionFinalPage />
                    </div>
                </div>
            </div>
        </MathJaxContext>
    );
};

export default MainViewFinalTest;
