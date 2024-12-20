"use client";
import BottomBtn from "@/components/study/contentGroup/mainStudyView/bottomBtn/bottomBtn";
import ChoicesPanel from "@/components/study/contentGroup/mainStudyView/choicesPanel/choicesPanel";
import ExplanationDetail from "@/components/study/contentGroup/mainStudyView/explanation/explanationDetail";
import ModalConfirm from "@/components/study/contentGroup/mainStudyView/modal/modalConfirm";
import ProgressQuestion from "@/components/study/contentGroup/mainStudyView/progress/progressQuestion";
import QuestionContent from "@/components/study/contentGroup/mainStudyView/question/questionContent";
import TitleQuestion from "@/components/study/contentGroup/mainStudyView/title/titleQuestion";
import { MathJaxContext } from "better-react-mathjax";
import EmotionComponent from "../emotion/emotionComponent";
import TimeTestGetLever from "../timeTest";

const ContentTestView = () => {
    return (
        <MathJaxContext>
            <div className=" sm:shadow-custom bg-transparent sm:bg-white  rounded-2xl dark:bg-black">
                <div className="sm:p-4 flex flex-col gap-3">
                    <TitleQuestion />
                    <ProgressQuestion />
                    <TimeTestGetLever />
                    <QuestionContent showStatus={false} />
                    <EmotionComponent />
                    <ChoicesPanel />
                    <ExplanationDetail />
                </div>

                <BottomBtn />
            </div>

            <ModalConfirm />
        </MathJaxContext>
    );
};

export default ContentTestView;
