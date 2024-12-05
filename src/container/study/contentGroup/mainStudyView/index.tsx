import React from "react";
import BottomBtn from "./bottomBtn/bottomBtn";
import ChoicesPanel from "./choicesPanel/choicesPanel";
import ExplanationDetail from "./explanation/explanationDetail";
import ProgressQuestion from "./progress/progressQuestion";
import QuestionContent from "./question/questionContent";
import TitleQuestion from "./title/titleQuestion";

const FN = () => {
  return (
    <div className=" sm:shadow-custom bg-transparent sm:bg-white  rounded-2xl dark:bg-black">
      <div className="sm:p-4 flex flex-col gap-3">
        <TitleQuestion />
        <ProgressQuestion />
        <QuestionContent />
        <ChoicesPanel />
        <ExplanationDetail />
      </div>
      <BottomBtn />
    </div>
  );
};
const MainStudyView = React.memo(FN);
export default MainStudyView;
