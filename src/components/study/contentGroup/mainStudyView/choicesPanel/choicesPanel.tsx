"use client";
import { IAnswer } from "@/models/question/questions";
import { gameState } from "@/redux/features/game";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useCallback, useEffect, useState } from "react";
import AnswerButton from "../answer";
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";
import { revertPathName } from "@/utils/pathName";
import { appInfoState } from "@/redux/features/appInfo";
import finishQuestionThunk from "@/redux/repository/game/finish/finishQuestion";
import RouterApp from "@/common/router/router.constant";
import nextQuestionThunk from "@/redux/repository/game/nextQuestion/nextQuestion";
import nextQuestionDiagnosticThunk from "@/redux/repository/game/nextQuestion/nextQuestionDiagnosticTest";
import finishDiagnosticThunk from "@/redux/repository/game/finish/finishDiagnostic";

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
};
const ChoicesPanel: React.FC<IProps> = ({ isActions = false }) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const params = useParams();
    const pathname = usePathname();
    const {
        currentGame,
        idTopic,
        listQuestion,
        subTopicProgressId,
        indexCurrentQuestion,
    } = useAppSelector(gameState);

    const { appInfo } = useAppSelector(appInfoState);
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
        idTopic,
        listQuestion,
        appInfo.appShortName,
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
        subTopicProgressId,
        params?.slug,
        idTopic,
        indexCurrentQuestion,
        appInfo.appShortName,
        listQuestion,
    ]);

    const handleEnterFinalTest = useCallback(async () => {
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
        subTopicProgressId,
        params?.slug,
        idTopic,
        indexCurrentQuestion,
        appInfo.appShortName,
        listQuestion,
    ]);

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
                if (type) handleEnterLearning();
                if (pathname?.includes("diagnostic_test"))
                    handleEnterDiagnostic();

                if (pathname?.includes("final_test")) handleEnterFinalTest();
            }
        };
        document.addEventListener("keydown", handleEnterEvent, true);

        return () => {
            document.removeEventListener("keydown", handleEnterEvent, true);
        };
    }, [
        handleEnterLearning,
        currentGame.answers,
        currentGame.selectedAnswer,
        type,
        pathname,
    ]);

    return (
        <div className={"grid gap-2 grid-cols-1 sm:grid-cols-2"}>
            {listRandomQuestion?.map((choice, index) => (
                <AnswerButton
                    choice={choice}
                    index={index}
                    key={choice?.id}
                    isActions={isActions}
                />
            ))}
        </div>
    );
};

export default ChoicesPanel;
