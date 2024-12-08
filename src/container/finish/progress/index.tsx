import React from "react";
import "./styles.css";
const ProgressFinishPage = () => {
  return (
    <div className="w-full h-full flex items-center flex-col justify-center">
      <div className="w-[160px] relative h-[160px]">
        <svg
          width="160px"
          height="160px"
          viewBox="0 0 160px 160px"
          className="circular-progress"
        >
          <circle className="bg"></circle>
          <circle className="fg"></circle>
        </svg>
        <div className="absolute z-10 bottom-0 right-0 top-0 left-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-[#7C6F5B] text-2xl font-semibold">9/10</p>
            <p className="text-base font-normal text-[#7C6F5B]">questions</p>
          </div>
        </div>
      </div>

      <div className="text-base pt-8 font-semibold">
        <h4>You correctly answered 9/10 questions on the first turn.</h4>
      </div>
    </div>
  );
};

export default ProgressFinishPage;
