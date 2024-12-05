"use client";

import { RANDOM_COLORS } from "@/common/constants";
import { db } from "@/lib/db/db.model";
import { ITopic } from "@/lib/models/topics/topics";
import React, { useEffect, useState } from "react";
import AnswerSheet from "./answer/answerSheet";
import FinalTestBtn from "./finalTestBtn/finalTestBtn";
import GridTestsLeft from "./gridTests/gridTestsLeft";
import GridTopicLeft from "./gridTopics/gridTopicLeft";
import PassingProbability from "./passing/passingProbability";

const FN = () => {
  return (
    <div className="hidden sm:block w-full">
      <div className="flex flex-col gap-4">
        <PassingProbability />
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
