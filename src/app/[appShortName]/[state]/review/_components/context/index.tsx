"use client";
import React, { ReactNode } from "react";

export type ISelectReview = "random" | "weak" | "hard" | "saved" | "all";
export interface IContextReview {
    selectType: ISelectReview;
    setSelectType: (e: ISelectReview) => void;
}

export const ReviewContext = React.createContext<IContextReview>({
    selectType: "random" as ISelectReview,
    setSelectType: () => {},
});

const ReviewProvider = ({ children }: { children: ReactNode }) => {
    const [selectType, setSelectType] = React.useState<ISelectReview>("random");

    return (
        <ReviewContext.Provider
            value={{
                selectType,
                setSelectType,
            }}
        >
            {children}
        </ReviewContext.Provider>
    );
};
export default ReviewProvider;
