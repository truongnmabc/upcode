import CloseIcon from "@/asset/icon/CloseIcon";
import { MtUiButton } from "@/components/button";
import DialogResponsive from "@/components/dialogResponsive";
import { db } from "@/db/db.model";
import { IGameMode, ITestBase } from "@/models/tests";
import { IGroupExam } from "@/models/tests/tests";
import { ITopicBase } from "@/models/topics/topicsProgress";
import { useAppDispatch } from "@/redux/hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { CardFeeBack } from "./cardFeedBack";
import CardProgress from "./cardProgress";
import CardTopic from "./cardTopic";
import {
    fetchQuestionsForTopics,
    generateRandomNegativeId,
} from "@/utils/math";
import { generateGroupExamData } from "@/redux/repository/game/initData/initDiagnosticTest";
import { startCustomTest } from "@/redux/features/game";

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

const handleSaveToDb = async (props: IPropsUpdateDb, isUpdate: boolean) => {
    const data = {
        totalDuration: props.totalDuration,
        passingThreshold: props.passingThreshold,
        isGamePaused: false,
        id: props.id,
        remainingTime: props.totalDuration * 60,
        startTime: new Date().getTime(),
        gameMode: "customTets" as IGameMode,
        gameDifficultyLevel: props.selectFeedback,
        topicIds: props.topicIds,
        status: 0,
        attemptNumber: 1,
        elapsedTime: 0,
        totalQuestion: props.totalQuestion,
        groupExamData: props.groupExamData,
    };

    if (isUpdate) {
        await db?.testQuestions.update(data.id, { ...data });
    } else {
        await db?.testQuestions.add(data);
    }
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

const schema = yup.object().shape({
    selectFeedback: yup.string().oneOf(["newbie", "expert", "exam"]).required(),
    count: yup.number().min(1, "Must be at least 1").max(100).required(),
    duration: yup.number().min(0).max(90).required(),
    passing: yup.number().min(0).max(100).required(),
    selectListTopic: yup.array().min(1, "Select at least one topic").required(),
});

type IFormState = {
    selectFeedback: IFeedBack;
    count: number;
    duration: number;
    passing: number;
    selectListTopic: ITopicBase[];
};
const ModalSettingCustomTest: React.FC<{
    open: boolean;
    onClose: () => void;
    item?: ITestBase | null;
    isShowBtnCancel: boolean;
    listTestLength: number;
}> = ({ open, onClose, item, isShowBtnCancel, listTestLength }) => {
    const [listTopic, setListTopic] = useState<ITopicBase[]>([]);
    const isUpdate = !!item;
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const data = await db?.topics.toArray();
            if (data) setListTopic(data);
        };
        fetchData();
    }, []);

    const {
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm<IFormState>({
        resolver: yupResolver(schema),
        defaultValues: {
            selectFeedback: item?.gameDifficultyLevel ?? "newbie",
            count: item?.totalQuestion ?? 34,
            duration: item?.totalDuration ?? 30,
            passing: item?.passingThreshold ?? 70,
            selectListTopic: [],
        },
    });
    const selectListTopic = watch("selectListTopic");

    useEffect(() => {
        if (item && listTopic.length > 0) {
            setValue(
                "selectListTopic",
                listTopic.filter((topic) =>
                    item.topicIds?.includes(topic.id)
                ) || []
            );
        }
    }, [item, listTopic, setValue]);

    const onSubmit = async (data: IFormState) => {
        try {
            setLoading(true);

            const countQuestionTopic = Math.floor(
                data.count / data.selectListTopic.length
            );

            const remainderQuestionTopic =
                data.count % data.selectListTopic.length;

            const listQuestion = await fetchQuestionsForTopics(
                data.selectListTopic,
                countQuestionTopic,
                remainderQuestionTopic
            );
            const id = isUpdate ? item!.id : generateRandomNegativeId();
            const groupExamData = await generateGroupExamData({
                questions: listQuestion,
                topics: data.selectListTopic,
            });

            await handleSaveToDb(
                {
                    id,
                    passingThreshold: data.passing,
                    topicIds: data.selectListTopic.map((t) => t.id),
                    selectFeedback: data.selectFeedback,
                    totalDuration: data.duration,
                    totalQuestion: data.count,
                    groupExamData,
                },
                isUpdate
            );

            dispatch(
                startCustomTest({
                    listQuestion,
                    remainingTime: data.duration * 60,
                    parentId: id,
                    passingThreshold: data.passing,
                    gameDifficultyLevel: data.selectFeedback,
                    currentSubTopicIndex: listTestLength + 1,
                })
            );
            onClose();
        } catch (err) {
            console.error("Error fetching questions:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAll = useCallback(() => {
        setValue(
            "selectListTopic",
            selectListTopic.length === listTopic.length ? [] : listTopic
        );
    }, [listTopic, selectListTopic, setValue]);

    return (
        <DialogResponsive
            open={open}
            close={() => isShowBtnCancel && onClose()}
            dialogRest={{
                sx: {
                    "& .MuiDialog-paper": {
                        width: "100%",
                        maxWidth: "900px",
                        maxHeight: "1080px",
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
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full flex flex-col transition-all justify-between max-w-[900px]  h-full p-4 sm:p-6 bg-theme-white"
            >
                <div className="flex-1 overflow-y-auto scrollbar-none">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <p className="text-2xl text-center w-full sm:text-start font-semibold">
                            Customize Your Test
                        </p>
                        {isShowBtnCancel && (
                            <button
                                aria-label="Close"
                                onClick={onClose}
                                type="button"
                                className="w-8 h-8 cursor-pointer rounded-full bg-white flex items-center justify-center"
                            >
                                <CloseIcon />
                            </button>
                        )}
                    </div>

                    {/* Feedback Modes */}
                    <section className="mt-6">
                        <p className="text-lg font-semibold">Feedback Modes</p>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {["newbie", "expert", "exam"].map((type) => (
                                <Controller
                                    key={type}
                                    name="selectFeedback"
                                    control={control}
                                    render={({ field }) => (
                                        <CardFeeBack
                                            text={`${
                                                type.charAt(0).toUpperCase() +
                                                type.slice(1)
                                            } Mode`}
                                            type={type as IFeedBack}
                                            select={field.value}
                                            onSelect={field.onChange}
                                            des={
                                                type === "newbie"
                                                    ? "Answers and explanations are displayed immediately after each question."
                                                    : type === "expert"
                                                    ? "Only answer accuracy is evaluated after each question. No explanation provided."
                                                    : "The final score is shown after answering all questions."
                                            }
                                        />
                                    )}
                                />
                            ))}
                        </div>
                    </section>

                    {/* Test Settings */}
                    <section className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Controller
                            name="count"
                            control={control}
                            render={({ field }) => (
                                <CardProgress
                                    title="Question Count:*"
                                    max={100}
                                    defaultValue={field.value}
                                    changeProgress={field.onChange}
                                    required
                                    errorMess={errors.count?.message}
                                />
                            )}
                        />
                        <Controller
                            name="duration"
                            control={control}
                            render={({ field }) => (
                                <CardProgress
                                    title="Duration:"
                                    suffix="minutes"
                                    max={90}
                                    defaultValue={field.value}
                                    changeProgress={field.onChange}
                                />
                            )}
                        />
                        <Controller
                            name="passing"
                            control={control}
                            render={({ field }) => (
                                <CardProgress
                                    title="Passing Score:"
                                    suffix="%"
                                    max={100}
                                    defaultValue={field.value}
                                    changeProgress={field.onChange}
                                />
                            )}
                        />
                    </section>

                    {/* Topics Selection */}
                    <section className="mt-6 pb-1">
                        <div className="flex items-center gap-3">
                            <p className="text-lg font-semibold">Subjects*</p>
                            <button
                                aria-label="Select All Topics"
                                type="button"
                                className="underline cursor-pointer text-sm font-normal"
                                onClick={handleSelectAll}
                            >
                                {selectListTopic.length === listTopic.length
                                    ? "Deselect All"
                                    : "Select All"}
                                s
                            </button>
                        </div>
                        <div className="grid mt-4 gap-4 grid-cols-1 sm:grid-cols-3">
                            {listTopic.map((item) => (
                                <CardTopic
                                    key={item.id}
                                    item={item}
                                    selectListTopic={selectListTopic}
                                    setSelectListTopic={(newList) =>
                                        setValue("selectListTopic", newList)
                                    }
                                />
                            ))}
                        </div>
                        {errors.selectListTopic && (
                            <p className="text-red-500 mt-2 text-sm">
                                {errors.selectListTopic.message}
                            </p>
                        )}
                    </section>
                </div>

                <div className="flex pb-6 sm:pb-0 w-full mt-2 items-center justify-end gap-4">
                    {isShowBtnCancel && (
                        <MtUiButton
                            className="sm:max-w-32"
                            block
                            size="large"
                            onClick={onClose}
                            htmlType="button"
                        >
                            Cancel
                        </MtUiButton>
                    )}

                    <MtUiButton
                        size="large"
                        type="primary"
                        block
                        htmlType="submit"
                        className="sm:max-w-32"
                        loading={loading}
                    >
                        {isUpdate ? "Update" : "Start"}
                    </MtUiButton>
                </div>
            </form>
        </DialogResponsive>
    );
};

export default ModalSettingCustomTest;
