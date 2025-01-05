import CloseIcon from "@/asset/icon/CloseIcon";
import React, { Dispatch, SetStateAction } from "react";
import { CardFeeBack } from "./cardFeedBack";
import CardProgress from "./cardProgress";
import CardTopic from "./cardTopic";
import { MtUiButton } from "@/components/button";
import { ITopic } from "@/models/topics/topics";
import { IFeedBack } from ".";

type IProps = {
    isShowBtnCancel: boolean;
    onCancel: () => void;
    setSelectFeedback: Dispatch<SetStateAction<IFeedBack>>;
    selectFeedback: IFeedBack;
    count: number;
    setCount: Dispatch<SetStateAction<number>>;
    duration: number;
    setDuration: Dispatch<SetStateAction<number>>;
    setPassing: Dispatch<SetStateAction<number>>;
    passing: number;
    handleSelectAll: () => void;
    listTopic: ITopic[];
    selectListTopic: ITopic[];
    setSelectListTopic: Dispatch<SetStateAction<ITopic[]>>;
    onStart: () => Promise<void>;
    loading: boolean;
};
const ContentSetting = (props: IProps) => {
    const {
        isShowBtnCancel,
        onCancel,
        setSelectFeedback,
        selectFeedback,
        count,
        setCount,
        duration,
        setDuration,
        setPassing,
        passing,
        handleSelectAll,
        listTopic,
        selectListTopic,
        setSelectListTopic,
        onStart,
        loading,
    } = props;
    return (
        <div className="w-full  flex flex-col justify-between max-w-[900px] max-h-[780px]  h-full p-4  sm:p-6 bg-theme-white">
            <div className="flex-1 overflow-y-auto scrollbar-none">
                <div className="flex items-center justify-between">
                    <p className="text-2xl text-center w-full  sm:text-start font-semibold">
                        Customize Your Test
                    </p>
                    {isShowBtnCancel && (
                        <div
                            onClick={onCancel}
                            className="w-8 h-8 cursor-pointer rounded-full bg-white flex items-center justify-center"
                        >
                            <CloseIcon />
                        </div>
                    )}
                </div>

                <div className="mt-6 flex-1">
                    <p className="text-lg font-semibold">Feedback Modes</p>

                    <div className=" mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <CardFeeBack
                            text="Newbie Mode"
                            type="newbie"
                            onSelect={setSelectFeedback}
                            select={selectFeedback}
                            des="Answers and explanations are displayed immediately after each question."
                        />{" "}
                        <CardFeeBack
                            onSelect={setSelectFeedback}
                            text="Expert Mode"
                            select={selectFeedback}
                            type="expert"
                            des="Only answer accuracy is evaluated after each question. No explanation provided."
                        />{" "}
                        <CardFeeBack
                            onSelect={setSelectFeedback}
                            text="Exam Mode"
                            select={selectFeedback}
                            type="exam"
                            des="The final score is shown after answering all questions."
                        />
                    </div>

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <CardProgress
                            title="Question Count:"
                            max={100}
                            defaultValue={count}
                            changeProgress={setCount}
                        />{" "}
                        <CardProgress
                            title="Duration:"
                            suffix="minutes"
                            defaultValue={duration}
                            max={90}
                            changeProgress={setDuration}
                        />{" "}
                        <CardProgress
                            changeProgress={setPassing}
                            title="Passing Score:"
                            defaultValue={passing}
                            suffix="%"
                            max={100}
                        />
                    </div>
                </div>
                <div>
                    <div className="flex items-center gap-3 mt-4">
                        <p className="text-lg font-semibold">Subjects</p>
                        <span
                            className=" underline cursor-pointer text-sm font-normal"
                            onClick={handleSelectAll}
                        >
                            Select All
                        </span>
                    </div>{" "}
                    <div className="grid mt-4 gap-4 grid-cols-1 sm:grid-cols-3">
                        {listTopic?.map((item) => (
                            <CardTopic
                                item={item}
                                key={item.id}
                                selectListTopic={selectListTopic}
                                setSelectListTopic={setSelectListTopic}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex pb-6 sm:pb-0 w-full mt-6 items-center justify-end gap-4">
                {isShowBtnCancel && (
                    <MtUiButton
                        className="sm:max-w-32"
                        block
                        size="large"
                        onClick={onCancel}
                    >
                        Cancel
                    </MtUiButton>
                )}

                <MtUiButton
                    size="large"
                    type="primary"
                    block
                    onClick={onStart}
                    disabled={
                        duration === 0 ||
                        count === 0 ||
                        selectListTopic.length === 0
                    }
                    className="sm:max-w-32"
                    loading={loading}
                >
                    Start
                </MtUiButton>
            </div>
        </div>
    );
};

export default ContentSetting;
