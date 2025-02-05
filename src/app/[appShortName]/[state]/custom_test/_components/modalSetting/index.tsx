import DialogResponsive from "@/components/dialogResponsive";
import { db } from "@/db/db.model";
import { ITopicQuestion } from "@/models/question/topicQuestion";
import { ITestQuestion } from "@/models/tests/testQuestions";
import { ITopicProgress } from "@/models/topics/topicsProgress";
import { startCustomTest } from "@/redux/features/game";
import { useAppDispatch } from "@/redux/hooks";
import { generateRandomNegativeId } from "@/utils/math";
import React, { useEffect, useState } from "react";
import ContentSetting from "./contentSetting";

export type IFeedBack = "newbie" | "expert" | "exam";

type IProps = {
    open: boolean;
    onClose: () => void;
    item?: ITestQuestion | null;
    isShowBtnCancel: boolean;
    listTestLength: number;
};
const ModalSettingCustomTest: React.FC<IProps> = ({
    open,
    onClose,
    item,
    isShowBtnCancel,
    listTestLength,
}) => {
    const [listTopic, setListTopic] = useState<ITopicProgress[]>([]);
    const [count, setCount] = useState(0);
    const [duration, setDuration] = useState(0);
    const [passing, setPassing] = useState(0);
    const [selectFeedback, setSelectFeedback] = useState<IFeedBack>("newbie");
    const [selectListTopic, setSelectListTopic] = useState<ITopicProgress[]>(
        []
    );

    useEffect(() => {
        const handleGetData = async () => {
            const data = await db?.topics.toArray();
            if (data) {
                setListTopic(data);
            }
        };
        handleGetData();
    }, []);

    useEffect(() => {
        if (item) {
            setCount(item.totalQuestion || 0);
            setDuration(item.totalDuration);
            setPassing(item.passingThreshold ?? 0);
            setSelectFeedback(item.gameDifficultyLevel ?? "newbie");
            setSelectListTopic(
                item.topicIds
                    ? item.topicIds.map(
                          (id): ITopicProgress => ({
                              id,
                              parentId: -1,
                              name: "Default Topic Name",
                              icon: "default-icon",
                              tag: "default-tag",
                              contentType: 0,
                              topics: [],
                              averageLevel: 0,
                              status: 0,
                              totalQuestion: 0,
                              turn: 0,
                          })
                      )
                    : []
            );
        }
    }, [item]);

    const resetState = () => {
        setCount(0);
        setDuration(0);
        setPassing(0);
        setSelectFeedback("newbie");
        setSelectListTopic([]);
    };
    const onCancel = () => {
        resetState();
        onClose();
    };
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const onStart = async () => {
        if (count > 0 && selectListTopic.length > 0) {
            let listQuestion: ITopicQuestion[] = [];
            try {
                setLoading(true);

                const countQuestionTopic = Math.floor(
                    count / selectListTopic.length
                );

                const remainderQuestionTopic = count % selectListTopic.length;

                for (const [topicIndex, topic] of selectListTopic.entries()) {
                    const listPart = topic?.topics?.flatMap(
                        (item) => item.topics
                    );
                    if (listPart) {
                        const countQuestionPart = Math.floor(
                            countQuestionTopic / listPart.length
                        );
                        const remainderQuestionPart =
                            countQuestionTopic % listPart.length;

                        for (const [partIndex, part] of listPart.entries()) {
                            if (part?.id) {
                                const topicData = await db?.questions
                                    ?.where("partId")
                                    .equals(part.id)
                                    .toArray();

                                if (topicData?.length) {
                                    const questionCount =
                                        partIndex === listPart.length - 1
                                            ? countQuestionPart +
                                              remainderQuestionPart
                                            : countQuestionPart;

                                    const randomQuestions = topicData
                                        .sort(() => Math.random() - 0.5)
                                        .slice(0, questionCount)
                                        .map((item) => ({
                                            ...item,
                                            tag: topic.tag,
                                            icon: topic.icon,
                                            parentId: topic.id,
                                        }));

                                    listQuestion = [
                                        ...listQuestion,
                                        ...randomQuestions,
                                    ];
                                }
                            }
                        }

                        if (
                            topicIndex === selectListTopic.length - 1 &&
                            remainderQuestionTopic > 0
                        ) {
                            const id = listPart[listPart.length - 1]?.id;
                            if (id) {
                                const extraQuestions = await db?.questions
                                    ?.where("partId")
                                    .equals(id)
                                    .toArray();

                                if (extraQuestions?.length) {
                                    const extraRandomQuestions = extraQuestions
                                        .sort(() => Math.random() - 0.5)
                                        .slice(0, remainderQuestionTopic)
                                        .map((item) => ({
                                            ...item,
                                            tag: topic.tag,
                                            icon: topic.icon,
                                            parentId: topic.id,
                                        }));

                                    listQuestion = [
                                        ...listQuestion,
                                        ...extraRandomQuestions,
                                    ];
                                }
                            }
                        }
                    }
                }
                const parentId = generateRandomNegativeId();
                console.log("🚀 ~ onStart ~ parentId:", parentId);

                await db?.testQuestions.add({
                    totalDuration: duration,
                    passingThreshold: passing,
                    isGamePaused: false,
                    id: parentId,
                    question: listQuestion as ITopicQuestion[],
                    remainingTime: duration * 60,
                    startTime: new Date().getTime(),
                    gameMode: "customTets",
                    gameDifficultyLevel: selectFeedback,
                    topicIds: selectListTopic?.map((item) => item.id),
                    status: 0,
                    attemptNumber: 1,
                    elapsedTime: 0,
                    totalQuestion: count,
                });
                console.log("🚀 ~ onStart ~ listQuestion:", listQuestion);

                dispatch(
                    startCustomTest({
                        listQuestion,
                        remainingTime: duration * 60,
                        parentId: parentId,
                        passingThreshold: passing,
                        gameDifficultyLevel: selectFeedback,
                        currentSubTopicIndex: listTestLength + 1,
                    })
                );
                onCancel();
            } catch (err) {
                console.error("Error while fetching questions:", err);
            } finally {
                setLoading(false);
                console.log("End time:", new Date().toISOString());
            }
        } else {
            alert(
                "Please ensure that duration > 0, question count > 0, and at least one topic is selected."
            );
        }
    };

    const handleSelectAll = () => {
        if (selectListTopic.length < listTopic.length)
            setSelectListTopic(listTopic);
        if (selectListTopic.length === listTopic.length) setSelectListTopic([]);
    };

    return (
        <DialogResponsive
            open={open}
            close={() => {
                if (isShowBtnCancel) onClose();
            }}
            dialogRest={{
                sx: {
                    "& .MuiDialog-paper": {
                        width: "100%",
                        maxWidth: "900px",
                        maxHeight: "780px",
                        height: "100%",
                    },
                },
            }}
            sheetRest={{
                mask: true,
                height: 600,
                handler: true,
                swipeToClose: false,
                className: "custom-sheet-handler",
            }}
        >
            <ContentSetting
                count={count}
                duration={duration}
                handleSelectAll={handleSelectAll}
                isShowBtnCancel={isShowBtnCancel}
                listTopic={listTopic}
                loading={loading}
                onCancel={onCancel}
                onStart={onStart}
                passing={passing}
                selectFeedback={selectFeedback}
                selectListTopic={selectListTopic}
                setCount={setCount}
                setDuration={setDuration}
                setPassing={setPassing}
                setSelectFeedback={setSelectFeedback}
                setSelectListTopic={setSelectListTopic}
            />
        </DialogResponsive>
    );
};

export default ModalSettingCustomTest;
