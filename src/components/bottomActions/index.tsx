import { useIsMobile } from "@/hooks/useIsMobile";
import React, { useMemo } from "react";
import Keyboard from "../keyboard";
import Reaction from "../reaction";
import BtnMobile from "./btnMobile";
import BtnSubmit from "./btnSubmit";
import NextQuestionCustomTest from "./next/custom";
import NextQuestionDiagnostic from "./next/diagnostic";
import NextQuestionFinalPage from "./next/final";
import BtnNextQuestion from "./next/learn";

export type IPropsType = "custom" | "learn" | "diagnostic" | "final" | "test";

type IPropsBottomAction = {
    isShow?: boolean;
    type: IPropsType;
};

const BottomActions: React.FC<IPropsBottomAction> = ({
    isShow = false,
    type = "learn",
}) => {
    const isMobile = useIsMobile();

    const TypeComponent = useMemo(() => {
        const components: Record<IPropsType, JSX.Element | null> = {
            learn: <BtnNextQuestion />,
            test: <BtnNextQuestion />,
            custom: <NextQuestionCustomTest />,
            diagnostic: <NextQuestionDiagnostic />,
            final: <NextQuestionFinalPage />,
        };

        return components[type] || null;
    }, [type]);

    return (
        <div className="flex fixed sm:static shadow-bottom sm:shadow-none bottom-0 left-0 right-0 z-50 bg-theme-dark sm:px-4 sm:bg-[#7C6F5B0F] flex-col sm:flex-row pb-8 pt-3 sm:py-3 justify-between gap-2 sm:gap-4 items-center">
            <div className="flex gap-2 sm:gap-8 items-center">
                <Keyboard />
                <Reaction />
            </div>

            <div className="px-4 w-full flex items-center gap-2 sm:p-4 sm:w-fit">
                {!isMobile && <BtnSubmit isShow={isShow} />}
                {isMobile && type !== "learn" && type !== "test" ? (
                    <BtnMobile />
                ) : (
                    TypeComponent
                )}
            </div>
        </div>
    );
};

export default React.memo(BottomActions);
