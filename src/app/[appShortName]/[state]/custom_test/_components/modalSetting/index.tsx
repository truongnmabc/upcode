import DialogResponsive from "@/components/dialogResponsive";
import { db } from "@/db/db.model";
import { IQuestionOpt } from "@/models/question";
import { ITestBase } from "@/models/tests";
import { IGroupExam } from "@/models/tests/tests";
import { ITopicBase } from "@/models/topics/topicsProgress";
import { startCustomTest } from "@/redux/features/game";
import { useAppDispatch } from "@/redux/hooks";
import { generateGroupExamData } from "@/redux/repository/game/initData/initDiagnosticTest";
import { generateRandomNegativeId } from "@/utils/math";
import React, { useCallback, useEffect, useState } from "react";
import ContentSetting from "./contentSetting";

export type IFeedBack = "newbie" | "expert" | "exam";

type IPropsUpdateDb = {
    totalDuration: number;
    passingThreshold: number;
    id: number;
    selectFeedback: IFeedBack;
    topicIds: number[];
    totalQuestion: number;
    groupExamData: IGroupExam[];
};

const fetchQuestionsForTopics = async (
    selectListTopic: ITopicBase[],
    countQuestionTopic: number,
    remainderQuestionTopic: number
): Promise<IQuestionOpt[]> => {
    const listQuestion: IQuestionOpt[] = [];

    // Lấy tất cả partId từ tất cả topics
    const allPartIds = selectListTopic.flatMap((topic) =>
        topic.topics.flatMap((subTopic) =>
            subTopic.topics.map((part) => part.id)
        )
    );

    if (!allPartIds.length) return [];

    // Truy vấn tất cả câu hỏi của các partId trong một lần truy vấn
    const allQuestions = await db?.questions
        ?.where("partId")
        .anyOf(allPartIds)
        .toArray();

    // Tạo một Map để tra cứu nhanh câu hỏi theo partId
    const questionMap = new Map<number, IQuestionOpt[]>();

    allQuestions?.forEach((question) => {
        if (!questionMap.has(question.partId)) {
            questionMap.set(question.partId, []);
        }
        questionMap.get(question.partId)!.push(question);
    });

    for (const [topicIndex, topic] of selectListTopic.entries()) {
        const listPart = topic.topics.flatMap((subTopic) => subTopic.topics);
        if (!listPart.length) continue;

        const countQuestionPart = Math.floor(
            countQuestionTopic / listPart.length
        );
        const remainderQuestionPart = countQuestionTopic % listPart.length;

        for (const [partIndex, part] of listPart.entries()) {
            const topicData = questionMap.get(part.id) || [];
            if (!topicData.length) continue;

            const questionCount =
                partIndex === listPart.length - 1
                    ? countQuestionPart + remainderQuestionPart
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

            listQuestion.push(...randomQuestions);
        }

        // Xử lý phần câu hỏi dư nếu có
        if (
            topicIndex === selectListTopic.length - 1 &&
            remainderQuestionTopic > 0
        ) {
            const lastPartId = listPart[listPart.length - 1]?.id;
            if (lastPartId) {
                const extraQuestions = questionMap.get(lastPartId) || [];
                if (extraQuestions.length) {
                    const extraRandomQuestions = extraQuestions
                        .sort(() => Math.random() - 0.5)
                        .slice(0, remainderQuestionTopic)
                        .map((item) => ({
                            ...item,
                            tag: topic.tag,
                            icon: topic.icon,
                            parentId: topic.id,
                        }));

                    listQuestion.push(...extraRandomQuestions);
                }
            }
        }
    }

    return listQuestion;
};

export const handleAddNewDb = async ({
    totalDuration,
    id,
    passingThreshold,
    selectFeedback,
    topicIds,
    totalQuestion,
    groupExamData,
}: IPropsUpdateDb) => {
    await db?.testQuestions.add({
        totalDuration,
        passingThreshold,
        isGamePaused: false,
        id,
        remainingTime: totalDuration * 60,
        startTime: new Date().getTime(),
        gameMode: "customTets",
        gameDifficultyLevel: selectFeedback,
        topicIds: topicIds,
        status: 0,
        attemptNumber: 1,
        elapsedTime: 0,
        totalQuestion,
        groupExamData,
    });
};

export const handleUpdateCustomTestDb = async ({
    totalDuration,
    id,
    passingThreshold,
    selectFeedback,
    topicIds,
    totalQuestion,
    groupExamData,
}: IPropsUpdateDb) => {
    await db?.testQuestions.add({
        totalDuration,
        passingThreshold,
        isGamePaused: false,
        id,
        remainingTime: totalDuration * 60,
        startTime: new Date().getTime(),
        gameMode: "customTets",
        gameDifficultyLevel: selectFeedback,
        topicIds: topicIds,
        status: 0,
        attemptNumber: 1,
        elapsedTime: 0,
        totalQuestion,
        groupExamData,
    });
};
const ModalSettingCustomTest: React.FC<{
    open: boolean;
    onClose: () => void;
    item?: ITestBase | null;
    isShowBtnCancel: boolean;
    listTestLength: number;
}> = ({ open, onClose, item, isShowBtnCancel, listTestLength }) => {
    const [state, setState] = useState({
        listTopic: [] as ITopicBase[],
        count: 0,
        duration: 0,
        passing: 0,
        selectFeedback: "newbie" as IFeedBack,
        selectListTopic: [] as ITopicBase[],
    });

    useEffect(() => {
        const fetchData = async () => {
            const data = await db?.topics.toArray();
            if (data) setState((prev) => ({ ...prev, listTopic: data }));
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (item && state.listTopic.length) {
            setState((prev) => ({
                ...prev,
                count: item.totalQuestion || 0,
                duration: item.totalDuration,
                passing: item.passingThreshold ?? 0,
                selectFeedback: item.gameDifficultyLevel ?? "newbie",
                selectListTopic: prev.listTopic.filter((topic) =>
                    item.topicIds?.includes(topic.id)
                ),
            }));
        }
    }, [item, state.listTopic.length]);

    const resetState = useCallback(() => {
        setState({
            listTopic: [],
            count: 0,
            duration: 0,
            passing: 0,
            selectFeedback: "newbie",
            selectListTopic: [],
        });
    }, []);

    const onCancel = useCallback(() => {
        resetState();
        onClose();
    }, [onClose, resetState]);

    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);

    const onStart = useCallback(async () => {
        if (state.count > 0 && state.selectListTopic.length > 0) {
            try {
                setLoading(true);

                const countQuestionTopic = Math.floor(
                    state.count / state.selectListTopic.length
                );

                const remainderQuestionTopic =
                    state.count % state.selectListTopic.length;
                const listQuestion = await fetchQuestionsForTopics(
                    state.selectListTopic,
                    countQuestionTopic,
                    remainderQuestionTopic
                );
                const id = generateRandomNegativeId();
                const groupExamData = await generateGroupExamData({
                    questions: listQuestion,
                    topics: state.selectListTopic,
                });

                await handleAddNewDb({
                    id,
                    passingThreshold: state.passing,
                    topicIds: state.selectListTopic.map((t) => t.id),
                    selectFeedback: state.selectFeedback,
                    totalDuration: state.duration,
                    totalQuestion: state.count,
                    groupExamData,
                });

                dispatch(
                    startCustomTest({
                        listQuestion,
                        remainingTime: state.duration * 60,
                        parentId: id,
                        passingThreshold: state.passing,
                        gameDifficultyLevel: state.selectFeedback,
                        currentSubTopicIndex: listTestLength + 1,
                    })
                );
                onCancel();
            } catch (err) {
                console.error("Error fetching questions:", err);
            } finally {
                setLoading(false);
            }
        } else {
            alert(
                "Please ensure that duration > 0, question count > 0, and at least one topic is selected."
            );
        }
    }, [state, listTestLength, dispatch, onCancel]);

    const onUpdate = useCallback(async () => {
        try {
            setLoading(true);

            const countQuestionTopic = Math.floor(
                state.count / state.selectListTopic.length
            );

            const remainderQuestionTopic =
                state.count % state.selectListTopic.length;
            const listQuestion = await fetchQuestionsForTopics(
                state.selectListTopic,
                countQuestionTopic,
                remainderQuestionTopic
            );
            const id = generateRandomNegativeId();
            const groupExamData = await generateGroupExamData({
                questions: listQuestion,
                topics: state.selectListTopic,
            });

            await handleAddNewDb({
                id,
                passingThreshold: state.passing,
                topicIds: state.selectListTopic.map((t) => t.id),
                selectFeedback: state.selectFeedback,
                totalDuration: state.duration,
                totalQuestion: state.count,
                groupExamData,
            });

            dispatch(
                startCustomTest({
                    listQuestion,
                    remainingTime: state.duration * 60,
                    parentId: id,
                    passingThreshold: state.passing,
                    gameDifficultyLevel: state.selectFeedback,
                    currentSubTopicIndex: listTestLength + 1,
                })
            );
            onCancel();
        } catch (err) {
            console.error("Error fetching questions:", err);
        } finally {
            setLoading(false);
        }
    }, [state, dispatch, onCancel, listTestLength]);

    const handleSelectAll = useCallback(() => {
        setState((prev) => ({
            ...prev,
            selectListTopic:
                prev.selectListTopic.length < prev.listTopic.length
                    ? prev.listTopic
                    : [],
        }));
    }, []);

    return (
        <DialogResponsive
            open={open}
            close={() => isShowBtnCancel && onClose()}
            dialogRest={{
                sx: {
                    "& .MuiDialog-paper": {
                        width: "100%",
                        maxWidth: "900px",
                        maxHeight: "790px",
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
                state={state}
                setState={setState}
                handleSelectAll={handleSelectAll}
                isShowBtnCancel={isShowBtnCancel}
                loading={loading}
                onCancel={onCancel}
                onStart={onStart}
                onUpdate={onUpdate}
                isUpdate={!!item}
            />
        </DialogResponsive>
    );
};

export default ModalSettingCustomTest;
