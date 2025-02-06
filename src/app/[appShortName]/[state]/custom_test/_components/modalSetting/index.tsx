import DialogResponsive from "@/components/dialogResponsive";
import { db } from "@/db/db.model";
import { ITestBase } from "@/models/tests";
import { ITopicBase } from "@/models/topics/topicsProgress";
import { startCustomTest } from "@/redux/features/game";
import { useAppDispatch } from "@/redux/hooks";
import { generateRandomNegativeId } from "@/utils/math";
import React, { useEffect, useState } from "react";
import ContentSetting from "./contentSetting";
import { IQuestionOpt } from "@/models/question";
import { IGroupExam } from "@/models/tests/tests";
import { generateGroupExamData } from "@/redux/repository/game/initData/initDiagnosticTest";

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

const handleUpdateDb = async ({
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

type IProps = {
    open: boolean;
    onClose: () => void;
    item?: ITestBase | null;
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
    const [listTopic, setListTopic] = useState<ITopicBase[]>([]);
    const [count, setCount] = useState(0);
    const [duration, setDuration] = useState(0);
    const [passing, setPassing] = useState(0);
    const [selectFeedback, setSelectFeedback] = useState<IFeedBack>("newbie");
    const [selectListTopic, setSelectListTopic] = useState<ITopicBase[]>([]);

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
            // setSelectListTopic(
            //     item.topicIds
            //         ? item.topicIds.map(
            //               (id): ITopicBase => ({
            //                   id,
            //                   parentId: -1,
            //                   name: "Default Topic Name",
            //                   icon: "default-icon",
            //                   tag: "default-tag",
            //                   contentType: 0,
            //                   topics: [],
            //                   averageLevel: 0,
            //                   status: 0,
            //                   totalQuestion: 0,
            //                   turn: 0,
            //               })
            //           )
            //         : []
            // );
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
            try {
                setLoading(true);

                const countQuestionTopic = Math.floor(
                    count / selectListTopic.length
                );

                const remainderQuestionTopic = count % selectListTopic.length;

                const listQuestion = await fetchQuestionsForTopics(
                    selectListTopic,
                    countQuestionTopic,
                    remainderQuestionTopic
                );
                const id = generateRandomNegativeId();
                const groupExamData = await generateGroupExamData({
                    questions: listQuestion,
                    topics: selectListTopic,
                });
                await handleUpdateDb({
                    id,
                    passingThreshold: passing,
                    topicIds: selectListTopic?.map((item) => item.id),
                    selectFeedback: selectFeedback,
                    totalDuration: duration,
                    totalQuestion: count,
                    groupExamData,
                });
                dispatch(
                    startCustomTest({
                        listQuestion,
                        remainingTime: duration * 60,
                        parentId: id,
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
