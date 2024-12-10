import React from "react";
import AnswerSheet from "./answer/answerSheet";
import FinalTestBtn from "./finalTestBtn/finalTestBtn";
import GridTestsLeft from "./gridTests/gridTestsLeft";
import GridTopicLeft from "./gridTopics/gridTopicLeft";

const FN = () => {
  return (
    <div className="hidden sm:block w-full">
      <div className="flex flex-col gap-4">
        <AnswerSheet />
        <GridTopicLeft />
        <GridTestsLeft />
        <FinalTestBtn />
      </div>
    </div>
  );
};
const QuestionGroup = React.memo(FN);
export default QuestionGroup;
