import React from "react";
import BtnNextQuestion from "./next/learn";
import BtnSubmit from "./btnSubmit";
import Keyboard from "../keyboard";
import Reaction from "../reaction";
import NextQuestionCustomTest from "./next/custom";
import NextQuestionDiagnostic from "./next/diagnostic";
import NextQuestionFinalPage from "./next/final";
type IProps = {
    isShow?: boolean;
    type: "custom" | "learn" | "diagnostic" | "final";
};
const BottomActions: React.FC<IProps> = ({
    isShow = false,
    type = "learn",
}) => {
    return (
        <div className="flex fixed sm:static shadow-bottom sm:shadow-none  bottom-0 left-0 right-0 z-50 bg-theme-dark sm:px-4 sm:bg-[#7C6F5B0F] flex-col sm:flex-row pb-8 pt-3 sm:py-3 justify-between gap-2 sm:gap-4 items-center ">
            <div className="flex  gap-2 sm:gap-8 items-center">
                <Keyboard />
                <Reaction />
            </div>
            <div className="px-4 w-full flex items-center gap-2 sm:p-4 sm:w-fit">
                <BtnSubmit isShow={isShow} />
                {type === "learn" && <BtnNextQuestion />}
                {type === "custom" && <NextQuestionCustomTest />}
                {type === "diagnostic" && <NextQuestionDiagnostic />}
                {type === "final" && <NextQuestionFinalPage />}
            </div>
        </div>
    );
};

export default React.memo(BottomActions);
