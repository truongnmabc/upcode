"use client";
import { viewTest } from "@/redux/features/game";
import {
    selectCurrentGame,
    selectGameDifficultyLevel,
    selectCurrentTopicId,
    selectCurrentQuestionIndex,
    selectEnableKeyboardShortcuts,
    selectListQuestion,
    selectCurrentSubTopicProgressId,
} from "@/redux/features/game.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import finishDiagnosticThunk from "@/redux/repository/game/finish/finishDiagnostic";
import finishPracticeThunk from "@/redux/repository/game/finish/finishPracticeTest";
import finishQuestionThunk from "@/redux/repository/game/finish/finishQuestion";
import nextQuestionThunk from "@/redux/repository/game/nextQuestion/nextQuestion";
import nextQuestionDiagnosticThunk from "@/redux/repository/game/nextQuestion/nextQuestionDiagnosticTest";
import RouterApp from "@/constants/router.constant";
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import AnswerButton from "../answer";
import { MOCK_TEMP_LIST_ANSWER } from "./mock";
import { shouldOpenSubmitTest } from "@/redux/features/tests";

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

type IProps = {
    isActions?: boolean;
    isBlockEnter?: boolean;
};
const ChoicesPanel: React.FC<IProps> = ({
    isActions = false,
    isBlockEnter = false,
}) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const params = useParams();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const type = searchParams?.get("type");

    const idTopic = useAppSelector(selectCurrentTopicId);
    const currentGame = useAppSelector(selectCurrentGame);
    const listQuestion = useAppSelector(selectListQuestion);
    const feedBack = useAppSelector(selectGameDifficultyLevel);
    const subTopicProgressId = useAppSelector(selectCurrentSubTopicProgressId);
    const indexCurrentQuestion = useAppSelector(selectCurrentQuestionIndex);
    const isListen = useAppSelector(selectEnableKeyboardShortcuts);
    const listLength = listQuestion.length;

    const listRandomQuestion = useMemo(
        () =>
            currentGame?.answers
                ? shuffleArray(currentGame.answers)
                : MOCK_TEMP_LIST_ANSWER,
        [currentGame?.answers]
    );

    const handleEnter = useCallback(async () => {
        if (type === "learn") {
            const isFinal = listQuestion.every(
                (item) => item.localStatus === "correct"
            );
            if (isFinal) {
                dispatch(
                    finishQuestionThunk({
                        subTopicProgressId,
                        topicId: idTopic,
                    })
                );
                router.replace(
                    `/finish?subTopicId=${subTopicProgressId}&topic=${params?.["slug"]}&partId=${idTopic}`,
                    { scroll: true }
                );
            } else {
                dispatch(nextQuestionThunk());
            }
            return;
        }
        // xử lý với trường hợp làm bài practice test
        if (type === "test") {
            if (indexCurrentQuestion + 1 === listLength) {
                dispatch(finishPracticeThunk());

                router.push(RouterApp.ResultTest, {
                    scroll: true,
                });
            } else {
                dispatch(nextQuestionThunk());
            }
            return;
        }

        if (pathname?.includes("diagnostic_test")) {
            if (indexCurrentQuestion + 1 === listLength) {
                dispatch(finishDiagnosticThunk());

                router.push(RouterApp.ResultTest, {
                    scroll: true,
                });
            } else {
                dispatch(nextQuestionDiagnosticThunk());
            }
            return;
        }

        if (pathname?.includes("final_test")) {
            if (indexCurrentQuestion + 1 < listLength) {
                dispatch(viewTest(indexCurrentQuestion + 1));
            } else {
                dispatch(shouldOpenSubmitTest(true));
            }
            return;
        }

        if (pathname?.includes("custom_test")) {
            if (feedBack === "newbie") dispatch(nextQuestionDiagnosticThunk());
            else if (feedBack === "exam")
                dispatch(viewTest(indexCurrentQuestion + 1));
            else if (feedBack === "expert") dispatch(nextQuestionThunk());
        }
    }, [
        dispatch,
        listQuestion,
        idTopic,
        subTopicProgressId,
        indexCurrentQuestion,
        listLength,
        type,
        pathname,
        router,
        params,
        feedBack,
    ]);

    const handleKeyboardEvent = useCallback(
        (event: globalThis.KeyboardEvent) => {
            if (currentGame?.answers && !currentGame.selectedAnswer) {
                const index = parseInt(event.key, 10);
                if (index >= 0 && index <= currentGame.answers.length) {
                    document.getElementById(index.toString())?.click();
                }
            }

            if (event.code === "Enter" && currentGame.selectedAnswer) {
                handleEnter();
            }
        },
        [handleEnter, currentGame?.answers, currentGame?.selectedAnswer]
    );

    useEffect(() => {
        if (!isBlockEnter && isListen)
            document.addEventListener("keydown", handleKeyboardEvent, true);
        return () =>
            document.removeEventListener("keydown", handleKeyboardEvent, true);
    }, [handleKeyboardEvent, isBlockEnter, isListen]);

    return (
        <div className={"grid gap-2 grid-cols-1 sm:grid-cols-2"}>
            {listRandomQuestion?.map((choice, index) => (
                <AnswerButton
                    choice={choice}
                    index={index}
                    key={choice?.id}
                    isActions={isActions}
                    currentGame={currentGame}
                />
            ))}
        </div>
    );
};

export default ChoicesPanel;
