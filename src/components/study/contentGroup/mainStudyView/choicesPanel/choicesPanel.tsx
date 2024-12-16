"use client";
import { IAnswer } from "@/models/question/questions";
import { gameState } from "@/redux/features/game";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import nextQuestionThunk from "@/redux/repository/game/nextQuestion";
import { useEffect, useState } from "react";
import AnswerButton from "../answer";

const TEMP_LIST_ANSWER: IAnswer[] = [
    {
        id: -1,
        text: "",
        index: 0,
        correct: false,
        explanation: "",
    },
    {
        id: -2,
        text: "",
        index: 0,
        correct: false,
        explanation: "",
    },
    {
        id: -3,
        text: "",
        index: 0,
        correct: false,
        explanation: "",
    },
    {
        id: -4,
        text: "",
        index: 0,
        correct: false,
        explanation: "",
    },
];

function shuffleArray<T>(array: T[]): T[] {
    if (array && array.length) {
        const copy = [...array];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]]; // Hoán đổi vị trí
        }
        return copy;
    }
    return [];
}
const ChoicesPanel = () => {
    const dispatch = useAppDispatch();

    const { currentGame, idTopic } = useAppSelector(gameState);

    const [listRandomQuestion, setListRandomQuestion] =
        useState(TEMP_LIST_ANSWER);

    useEffect(() => {
        if (currentGame?.answers) {
            const listRandomQuestion = shuffleArray(currentGame?.answers);
            if (listRandomQuestion.length > 0)
                setListRandomQuestion(listRandomQuestion);
        }
    }, [currentGame?.answers]);

    useEffect(() => {
        const handleEnterEvent = (event: globalThis.KeyboardEvent) => {
            if (currentGame?.answers && !currentGame.selectedAnswer) {
                const key = event.key;
                const index = parseInt(key, 10);

                if (index >= 0 && index <= currentGame.answers.length) {
                    const btn = document.getElementById(index.toString());
                    btn?.click();
                }
            }

            if (event && event.code === "Enter" && currentGame.selectedAnswer) {
                dispatch(nextQuestionThunk());
            }
        };

        document.addEventListener("keydown", handleEnterEvent, true);

        return () => {
            document.removeEventListener("keydown", handleEnterEvent, true);
        };
    }, [currentGame.answers, currentGame.selectedAnswer, idTopic, dispatch]);

    return (
        <div className={"grid gap-2 grid-cols-1 sm:grid-cols-2"}>
            {listRandomQuestion?.map((choice, index) => (
                <AnswerButton choice={choice} index={index} key={choice?.id} />
            ))}
        </div>
    );
};

export default ChoicesPanel;
