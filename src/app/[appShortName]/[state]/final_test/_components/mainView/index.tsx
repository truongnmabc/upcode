"use client";
import BottomActions from "@/components/bottomActions";
import ChoicesPanel from "@/components/choicesPanel";
import ClockIcon from "@/components/icon/ClockIcon";
import QuestionContent from "@/components/question";
import { MathJaxContext } from "better-react-mathjax";
import CountTimeFinalTest from "../countTimeFinal";
import ProgressQuestion from "@/components/progressQuestion";
import TitleQuestion from "@/components/titleQuestion";

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
                    <QuestionContent showStatus={false} showQuestionsCount />
                    <ChoicesPanel isActions />
                </div>

                <BottomActions isShow={true} type="final" />
            </div>
        </MathJaxContext>
    );
};

export default MainViewFinalTest;
