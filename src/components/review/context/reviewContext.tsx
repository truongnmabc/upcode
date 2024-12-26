"use client";
import { ITopic } from "@/models/topics/topics";
import React, { ReactNode } from "react";

export interface IContextReview {
    selectType?: string;
    setSelectType: (e: string) => void;
}

export const ReviewContext = React.createContext<IContextReview>({
    selectType: "random",
    setSelectType: () => {},
});

const ReviewProvider = ({ children }: { children: ReactNode }) => {
    const [selectType, setSelectType] = React.useState<string>("random");

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
