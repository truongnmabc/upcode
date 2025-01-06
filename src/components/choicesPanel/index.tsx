"use client";
import RouterApp from "@/router/router.constant";
import { IAnswer } from "@/models/question/questions";
import { selectAppInfo } from "@/redux/features/appInfo.reselect";
import { viewTest } from "@/redux/features/game";
import {
    selectCurrentGame,
    selectFeedBack,
    selectIdTopic,
    selectIndexCurrentQuestion,
    selectListQuestion,
    selectSubTopicProgressId,
} from "@/redux/features/game.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import finishDiagnosticThunk from "@/redux/repository/game/finish/finishDiagnostic";
import finishPracticeThunk from "@/redux/repository/game/finish/finishPracticeTest";
import finishQuestionThunk from "@/redux/repository/game/finish/finishQuestion";
import nextQuestionThunk from "@/redux/repository/game/nextQuestion/nextQuestion";
import nextQuestionDiagnosticThunk from "@/redux/repository/game/nextQuestion/nextQuestionDiagnosticTest";
import { revertPathName } from "@/utils/pathName";
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";
import { useCallback, useEffect, useState } from "react";
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
    const idTopic = useAppSelector(selectIdTopic);
    const currentGame = useAppSelector(selectCurrentGame);
    const listQuestion = useAppSelector(selectListQuestion);
    const feedBack = useAppSelector(selectFeedBack);
    const subTopicProgressId = useAppSelector(selectSubTopicProgressId);
    const indexCurrentQuestion = useAppSelector(selectIndexCurrentQuestion);
    const appInfo = useAppSelector(selectAppInfo);
    const type = useSearchParams().get("type");

    const [listRandomQuestion, setListRandomQuestion] =
        useState(TEMP_LIST_ANSWER);

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

            const _href = revertPathName({
                href: `/finish?subTopicProgressId=${subTopicProgressId}&topic=${params?.slug}&partId=${idTopic}`,
                appName: appInfo.appShortName,
            });

            router.replace(_href, {
                scroll: true,
            });
            return;
        }
        dispatch(nextQuestionThunk());
    }, [
        dispatch,
        subTopicProgressId,
        params?.slug,
        listQuestion,
        appInfo.appShortName,
        router,
        idTopic,
    ]);

    const handleEnterPractice = useCallback(async () => {
        if (indexCurrentQuestion + 1 === listQuestion?.length) {
            dispatch(finishPracticeThunk());

            const _href = revertPathName({
                href: RouterApp.ResultTest,
                appName: appInfo.appShortName,
            });

            router.replace(_href, {
                scroll: true,
            });
            return;
        }
        dispatch(nextQuestionThunk());
    }, [
        dispatch,
        indexCurrentQuestion,
        appInfo.appShortName,
        listQuestion,
        router,
    ]);

    const handleEnterDiagnostic = useCallback(async () => {
        if (indexCurrentQuestion + 1 === listQuestion?.length) {
            dispatch(finishDiagnosticThunk());

            const _href = revertPathName({
                href: RouterApp.ResultTest,
                appName: appInfo.appShortName,
            });

            router.replace(_href, {
                scroll: true,
            });
            return;
        }
        dispatch(nextQuestionDiagnosticThunk());
    }, [
        dispatch,
        indexCurrentQuestion,
        appInfo.appShortName,
        listQuestion,
        router,
    ]);

    const handleEnterFinalTest = useCallback(async () => {
        dispatch(viewTest(indexCurrentQuestion + 1));
    }, [dispatch, indexCurrentQuestion]);

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
                if (type === "learn") handleEnterLearning();
                if (type === "test") handleEnterPractice();
                if (pathname?.includes("diagnostic_test")) {
                    handleEnterDiagnostic();
                }

                if (pathname?.includes("final_test")) handleEnterFinalTest();
                if (pathname?.includes("custom_test")) handleEnterCustomTest();
            }
        };
        if (!isBlockEnter)
            document.addEventListener("keydown", handleEnterEvent, true);

        return () => {
            document.removeEventListener("keydown", handleEnterEvent, true);
        };
    }, [
        handleEnterLearning,
        handleEnterDiagnostic,
        handleEnterFinalTest,
        handleEnterCustomTest,
        handleEnterPractice,
        currentGame?.answers,
        currentGame?.selectedAnswer,
        type,
        pathname,
        isBlockEnter,
    ]);

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
