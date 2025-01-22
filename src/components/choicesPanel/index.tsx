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
import { useCallback, useEffect, useState } from "react";
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
    const idTopic = useAppSelector(selectCurrentTopicId);
    const currentGame = useAppSelector(selectCurrentGame);
    const listQuestion = useAppSelector(selectListQuestion);
    const feedBack = useAppSelector(selectGameDifficultyLevel);
    const subTopicProgressId = useAppSelector(selectCurrentSubTopicProgressId);
    const indexCurrentQuestion = useAppSelector(selectCurrentQuestionIndex);
    const isListen = useAppSelector(selectEnableKeyboardShortcuts);
    const type = useSearchParams()?.get("type");
    const [listLength, setListLength] = useState(0);

    useEffect(() => {
        if (listQuestion.length) setListLength(listQuestion.length);
    }, [listQuestion.length]);

    const [listRandomQuestion, setListRandomQuestion] = useState(
        MOCK_TEMP_LIST_ANSWER
    );

    useEffect(() => {
        if (currentGame?.answers) {
            const listRandomQuestion = shuffleArray(currentGame?.answers);
            if (listRandomQuestion.length > 0)
                setListRandomQuestion(listRandomQuestion);
        }
    }, [currentGame?.answers]);

    const handleEnterLearning = useCallback(async () => {
        const isFinal = listQuestion.every(
            (item) => item.localStatus === "correct"
        );
        if (isFinal) {
            dispatch(
                finishQuestionThunk({
                    subTopicProgressId: subTopicProgressId,
                    topicId: idTopic,
                })
            );

            const _href = `/finish?subTopicProgressId=${subTopicProgressId}&topic=${params?.["slug"]}&partId=${idTopic}`;

            router.replace(_href, {
                scroll: true,
            });
            return;
        }
        dispatch(nextQuestionThunk());
    }, [dispatch, subTopicProgressId, params, listQuestion, router, idTopic]);

    const handleEnterPractice = useCallback(async () => {
        if (indexCurrentQuestion + 1 === listLength) {
            dispatch(finishPracticeThunk());

            router.replace(RouterApp.ResultTest, {
                scroll: true,
            });
        } else {
            dispatch(nextQuestionThunk());
        }
    }, [dispatch, indexCurrentQuestion, listLength, router]);

    const handleEnterDiagnostic = useCallback(async () => {
        if (indexCurrentQuestion + 1 === listLength) {
            dispatch(finishDiagnosticThunk());

            router.replace(RouterApp.ResultTest, {
                scroll: true,
            });
        } else {
            dispatch(nextQuestionDiagnosticThunk());
        }
    }, [dispatch, indexCurrentQuestion, listLength, router]);

    const handleEnterFinalTest = useCallback(() => {
        if (indexCurrentQuestion + 1 < listLength) {
            dispatch(viewTest(indexCurrentQuestion + 1));
        } else {
            dispatch(shouldOpenSubmitTest(true));
        }
    }, [dispatch, indexCurrentQuestion, listLength]);

    const handleEnterCustomTest = useCallback(async () => {
        if (feedBack === "newbie") {
            dispatch(nextQuestionDiagnosticThunk());
        }
        if (feedBack === "exam") {
            dispatch(viewTest(indexCurrentQuestion + 1));
        }
        if (feedBack === "expert") {
            dispatch(nextQuestionThunk());
        }
    }, [feedBack, indexCurrentQuestion, dispatch]);

    const handleEnterEvent = useCallback(
        (event: globalThis.KeyboardEvent) => {
            if (currentGame?.answers && !currentGame.selectedAnswer) {
                const key = event.key;
                const index = parseInt(key, 10);

                if (index >= 0 && index <= currentGame.answers.length) {
                    const btn = document.getElementById(index.toString());
                    btn?.click();
                }
            }

            if (event && event.code === "Enter" && currentGame.selectedAnswer) {
                if (type === "learn") handleEnterLearning();
                if (type === "test") handleEnterPractice();
                if (pathname?.includes("diagnostic_test")) {
                    handleEnterDiagnostic();
                }

                if (pathname?.includes("final_test")) handleEnterFinalTest();
                if (pathname?.includes("custom_test")) handleEnterCustomTest();
            }
        },
        [
            handleEnterLearning,
            handleEnterDiagnostic,
            handleEnterFinalTest,
            handleEnterCustomTest,
            handleEnterPractice,
            currentGame?.answers,
            currentGame?.selectedAnswer,
            type,
            pathname,
        ]
    );

    useEffect(() => {
        if (!isBlockEnter && isListen)
            document.addEventListener("keydown", handleEnterEvent, true);

        return () => {
            document.removeEventListener("keydown", handleEnterEvent, true);
        };
    }, [handleEnterEvent, isBlockEnter, isListen]);

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
