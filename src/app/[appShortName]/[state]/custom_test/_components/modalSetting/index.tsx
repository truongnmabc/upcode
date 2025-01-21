import { db } from "@/db/db.model";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ICurrentGame } from "@/models/game/game";
import { IQuestion } from "@/models/question/questions";
import { ITestQuestion } from "@/models/tests/testQuestions";
import { ITopic } from "@/models/topics/topics";
import { startCustomTest } from "@/redux/features/game";
import { useAppDispatch } from "@/redux/hooks";
import { generateRandomNegativeId } from "@/utils/math";
import Dialog from "@mui/material/Dialog";
import React, { useEffect, useState } from "react";
import ContentSetting from "./contentSetting";
import dynamic from "next/dynamic";
const Sheet = dynamic(() => import("@/components/sheet"), {
    ssr: false,
});
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
    const [listTopic, setListTopic] = useState<ITopic[]>([]);
    const [count, setCount] = useState(0);
    const [duration, setDuration] = useState(0);
    const [passing, setPassing] = useState(0);
    const isMobile = useIsMobile();
    const [selectFeedback, setSelectFeedback] = useState<IFeedBack>("newbie");
    const [selectListTopic, setSelectListTopic] = useState<ITopic[]>([]);

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
            setCount(item.count || 0);
            setDuration(item.duration);
            setPassing(item.passing ?? 0);
            setSelectFeedback(item.feedBack ?? "newbie");
            setSelectListTopic(
                item.subject
                    ? item.subject.map(
                          (id): ITopic => ({
                              id,
                              parentId: -1,
                              name: "Default Topic Name",
                              icon: "default-icon",
                              tag: "default-tag",
                              type: 0,
                              contentType: 0,
                              orderIndex: 0,
                              topics: [],
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
            let listQuestion: ICurrentGame[] = [];
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
                                const topicData = await db?.topicQuestion
                                    ?.where("id")
                                    .equals(part.id)
                                    .first();

                                if (topicData?.questions) {
                                    const questionCount =
                                        partIndex === listPart.length - 1
                                            ? countQuestionPart +
                                              remainderQuestionPart
                                            : countQuestionPart;

                                    const randomQuestions = topicData.questions
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
                                const extraQuestions = await db?.topicQuestion
                                    ?.where("id")
                                    .equals(id)
                                    .first();

                                if (extraQuestions?.questions) {
                                    const extraRandomQuestions =
                                        extraQuestions.questions

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

                await db?.testQuestions.add({
                    duration: duration,
                    passing: passing,
                    isPaused: false,
                    parentId: parentId,
                    question: listQuestion as IQuestion[],
                    remainTime: duration * 60,
                    startTime: new Date().getTime(),
                    type: "customTets",
                    count: count,
                    feedBack: selectFeedback,
                    subject: selectListTopic?.map((item) => item.id),
                    status: 0,
                    turn: 1,
                    elapsedTime: 0,
                });

                dispatch(
                    startCustomTest({
                        listQuestion,
                        time: duration * 60,
                        parentId: parentId,
                        passing: passing,
                        feedBack: selectFeedback,
                        indexSubTopic: listTestLength + 1,
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
    if (isMobile) {
        return (
            <Sheet
                visible={open}
                height={600}
                mask
                handler
                // autoHeight
                swipeToClose={false}
                // snapPoints={[100]}
                // defaultSnapPoint={600}
                className="custom-sheet-handler"
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
            </Sheet>
        );
    }
    return (
        <Dialog
            open={open}
            onClose={() => {
                if (isShowBtnCancel) onClose();
            }}
            sx={{
                "& .MuiDialog-paper": {
                    width: "100%",
                    maxWidth: "900px",
                    maxHeight: "780px",
                    height: "100%",
                },
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
        </Dialog>
    );
};

export default ModalSettingCustomTest;
