import CloseIcon from "@/asset/icon/CloseIcon";
import { MtUiButton } from "@/components/button";
import { ITopicBase } from "@/models/topics/topicsProgress";
import { useMemo } from "react";
import { IFeedBack } from ".";
import { CardFeeBack } from "./cardFeedBack";
import CardProgress from "./cardProgress";
import CardTopic from "./cardTopic";

type IState = {
    selectFeedback: IFeedBack;
    count: number;
    duration: number;
    passing: number;
    listTopic: ITopicBase[];
    selectListTopic: ITopicBase[];
};

type IProps = {
    isShowBtnCancel: boolean;
    onCancel: () => void;
    state: IState;
    setState: React.Dispatch<React.SetStateAction<IState>>;
    onUpdate: () => Promise<void>;
    handleSelectAll: () => void;
    onStart: () => Promise<void>;
    loading: boolean;
    isUpdate: boolean;
};

const ContentSetting: React.FC<IProps> = ({
    isShowBtnCancel,
    onCancel,
    state,
    setState,
    onUpdate,
    handleSelectAll,
    onStart,
    loading,
    isUpdate,
}) => {
    const {
        selectFeedback,
        count,
        duration,
        passing,
        listTopic,
        selectListTopic,
    } = state;

    const isDisabled = useMemo(
        () => count === 0 || selectListTopic.length === 0,
        [count, selectListTopic.length]
    );

    return (
        <div className="w-full flex flex-col justify-between max-w-[900px] max-h-[790px]  h-full p-4 sm:p-6 bg-theme-white">
            <div className="flex-1 overflow-y-auto scrollbar-none">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <p className="text-2xl text-center w-full sm:text-start font-semibold">
                        Customize Your Test
                    </p>
                    {isShowBtnCancel && (
                        <button
                            aria-label="Close"
                            onClick={onCancel}
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
                        {[
                            {
                                type: "newbie",
                                text: "Newbie Mode",
                                des: "Answers and explanations are displayed immediately after each question.",
                            },
                            {
                                type: "expert",
                                text: "Expert Mode",
                                des: "Only answer accuracy is evaluated after each question. No explanation provided.",
                            },
                            {
                                type: "exam",
                                text: "Exam Mode",
                                des: "The final score is shown after answering all questions.",
                            },
                        ].map(({ type, text, des }) => (
                            <CardFeeBack
                                key={type}
                                text={text}
                                type={type as IFeedBack}
                                onSelect={(value) =>
                                    setState((prev) => ({
                                        ...prev,
                                        selectFeedback: value,
                                    }))
                                }
                                select={selectFeedback}
                                des={des}
                            />
                        ))}
                    </div>
                </section>

                {/* Test Settings */}
                <section className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <CardProgress
                        title="Question Count:*"
                        max={100}
                        defaultValue={count}
                        changeProgress={(value) =>
                            setState((prev) => ({ ...prev, count: value }))
                        }
                    />
                    <CardProgress
                        title="Duration:"
                        suffix="minutes"
                        max={90}
                        defaultValue={duration}
                        changeProgress={(value) =>
                            setState((prev) => ({ ...prev, duration: value }))
                        }
                    />
                    <CardProgress
                        title="Passing Score:"
                        suffix="%"
                        max={100}
                        defaultValue={passing}
                        changeProgress={(value) =>
                            setState((prev) => ({ ...prev, passing: value }))
                        }
                    />
                </section>

                {/* Topics Selection */}
                <section className="mt-6 pb-1">
                    <div className="flex items-center gap-3">
                        <p className="text-lg font-semibold">Subjects</p>
                        <button
                            aria-label="Select All Topics"
                            className="underline cursor-pointer text-sm font-normal"
                            onClick={handleSelectAll}
                        >
                            Select All
                        </button>
                    </div>
                    <div className="grid mt-4 gap-4 grid-cols-1 sm:grid-cols-3">
                        {listTopic.map((item) => (
                            <CardTopic
                                key={item.id}
                                item={item}
                                selectListTopic={selectListTopic}
                                setSelectListTopic={(newList) =>
                                    setState((prev) => ({
                                        ...prev,
                                        selectListTopic:
                                            typeof newList === "function"
                                                ? (
                                                      newList as (
                                                          prev: ITopicBase[]
                                                      ) => ITopicBase[]
                                                  )(prev.selectListTopic)
                                                : newList,
                                    }))
                                }
                            />
                        ))}
                    </div>
                </section>
            </div>

            {/* Footer Buttons */}
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
                    onClick={isUpdate ? onUpdate : onStart}
                    disabled={isDisabled}
                    className="sm:max-w-32"
                    loading={loading}
                >
                    {isUpdate ? "Update" : "Start"}
                </MtUiButton>
            </div>
        </div>
    );
};

export default ContentSetting;
