"use client";
import React, { ReactNode } from "react";

export type ISelectReview = "random" | "weak" | "hard" | "saved" | "all";
export interface IContextReview {
    selectType: ISelectReview;
    setSelectType: (e: ISelectReview) => void;
    isStart: boolean;
    setIsStart: (e: boolean) => void;
}

export const ReviewContext = React.createContext<IContextReview>({
    selectType: "random" as ISelectReview,
    setSelectType: () => {},
    isStart: false,
    setIsStart: () => {},
});

const ReviewProvider = ({ children }: { children: ReactNode }) => {
    const [selectType, setSelectType] = React.useState<ISelectReview>("random");
    const [isStart, setIsStart] = React.useState<boolean>(false);

    return (
        <ReviewContext.Provider
            value={{
                selectType,
                setSelectType,
                isStart,
                setIsStart,
            }}
        >
            {children}
        </ReviewContext.Provider>
    );
};
export default ReviewProvider;
