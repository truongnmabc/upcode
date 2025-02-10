"use client";
import { ITopicEndTest } from "@/app/[appShortName]/[state]/result_test/_components";
import { IQuestionOpt } from "@/models/question";
import { createContext, ReactNode, useContext } from "react";

interface ResultContextType {
    result: {
        listTopic: ITopicEndTest[];
        all: number;
        correct: number;
        passing: number;
    };
    correctIds: number[];
    tableData: {
        all: IQuestionOpt[];
        correct: IQuestionOpt[];
        incorrect: IQuestionOpt[];
    };
    setTableData: (data: {
        all: IQuestionOpt[];
        default: IQuestionOpt[];
        correct: IQuestionOpt[];
        incorrect: IQuestionOpt[];
    }) => void;
    correct: number;
    total: number;
    isPass: boolean;
    passing: number;
    listTopic: ITopicEndTest[];
}

// Tạo Context
const ResultContext = createContext<ResultContextType | undefined>(undefined);

// Custom Hook để sử dụng Context
export const useResultContext = () => {
    const context = useContext(ResultContext);
    if (!context) {
        throw new Error(
            "useResultContext must be used within a ResultProvider"
        );
    }
    return context;
};

// Provider
export const ResultProvider = ({
    children,
    value,
}: {
    children: ReactNode;
    value: ResultContextType;
}) => {
    return (
        <ResultContext.Provider value={value}>
            {children}
        </ResultContext.Provider>
    );
};
