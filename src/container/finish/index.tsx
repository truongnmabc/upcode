import React from "react";
import TitleFinishPage from "./title";
import ProgressFinishPage from "./progress";
import PassingFinishPage from "./passing";
import GridTopicProgress from "./gridTopic";

const FinishLayout = () => {
  return (
    <div className="w-full py-6 h-full gap-8 flex flex-col">
      <TitleFinishPage />
      <ProgressFinishPage />
      <PassingFinishPage />
      <GridTopicProgress />
    </div>
  );
};

export default FinishLayout;
