"use client";
import React from "react";
import "./passing.css";
const FN = () => {
  return (
    <div className="p-4 rounded-md bg-white dark:bg-black">
      <h3 className="font-semibold truncate text-xl">PassingProbability</h3>
      <div className="mt-3 h-6 w-full custom-progress relative">
        <progress value={41} max={100} className="w-full " />
        <div className="absolute top-0 left-0 w-full text-sm h-full flex items-center justify-center">
          <span>{41} %</span>
        </div>
      </div>
    </div>
  );
};
const PassingProbability = React.memo(FN);
export default PassingProbability;
