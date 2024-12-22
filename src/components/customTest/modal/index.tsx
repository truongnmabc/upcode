import Dialog from "@mui/material/Dialog";
import React, { useEffect, useState } from "react";

type IFeedBack = "newbie" | "expert" | "exam";

type IProps = {
    open: boolean;
    onClose: () => void;
};
const ModalSettingCustomTest: React.FC<IProps> = ({ open, onClose }) => {
    const [listTopic, setListTopic] = useState<ITopic[]>([]);
    const [count, setCount] = useState(0);
    const [duration, setDuration] = useState(0);
    const [passing, setPassing] = useState(0);

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
        console.log("Start time :", new Date().toISOString());

        if (duration > 0 && count > 0 && selectListTopic.length > 0) {
            let listQuestion: any[] = [];
            try {
                setLoading(true);

                const level =
                    selectFeedback === "newbie"
                        ? 1
                        : selectFeedback === "expert"
                        ? 2
                        : 3;

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
                                // console.log(
                                //     "🚀 ~ onStart ~ topicData:",
                                //     topicData
                                // );

                                if (topicData?.questions) {
                                    const questionCount =
                                        partIndex === listPart.length - 1
                                            ? countQuestionPart +
                                              remainderQuestionPart
                                            : countQuestionPart;

                                    const randomQuestions = topicData.questions
                                        // .filter((item) =>
                                        //     selectFeedback === "newbie"
                                        //         ? item.level < 50
                                        //         : selectFeedback === "expert"
                                        //         ? item.level === 50 ||
                                        //           item.level === -1
                                        //         : item.level > 50
                                        // )
                                        .sort(() => Math.random() - 0.5)
                                        .slice(0, questionCount);

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
                                            // .filter((item) =>
                                            //     selectFeedback === "newbie"
                                            //         ? item.level < 50
                                            //         : selectFeedback ===
                                            //           "expert"
                                            //         ? item.level === 50 ||
                                            //           item.level === -1
                                            //         : item.level > 50
                                            // )
                                            .sort(() => Math.random() - 0.5)
                                            .slice(0, remainderQuestionTopic);

                                    listQuestion = [
                                        ...listQuestion,
                                        ...extraRandomQuestions,
                                    ];
                                }
                            }
                        }
                    }
                }

                await db?.testQuestions.add({
                    duration: duration,
                    passing: passing,
                    isPaused: false,
                    parentId: -1,
                    question: listQuestion,
                    remainTime: duration * 60,
                    startTime: new Date().getTime(),
                    type: "customTets",
                    count: count,
                    feedBack: selectFeedback,
                    subject: selectListTopic?.map((item) => item.id),
                    status: 0,
                });

                dispatch(
                    startCustomTest({
                        listQuestion,
                        time: duration * 60,
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
        setSelectListTopic(listTopic);
    };
    return (
        <Dialog
            onClose={onCancel}
            open={open}
            sx={{
                "& .MuiDialog-paper": {
                    width: "100%",
                    maxWidth: "900px",
                    maxHeight: "780px",
                    height: "100%",
                },
            }}
        >
            <div className="w-full flex flex-col justify-between max-w-[900px] max-h-[780px] h-full p-6 bg-theme-white">
                <div className="flex items-center justify-between">
                    <p className="text-2xl font-semibold">
                        Customize Your Test
                    </p>
                    <div
                        onClick={onCancel}
                        className="w-8 h-8 cursor-pointer rounded-full bg-white flex items-center justify-center"
                    >
                        <CloseIcon />
                    </div>
                </div>

                <div className="mt-6 flex-1">
                    <p className="text-lg font-semibold">Feedback Modes</p>

                    <div className=" mt-4 grid grid-cols-3 gap-4">
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

                    <div className="mt-6 grid grid-cols-3 gap-4">
                        <CardProgress
                            title="Question Count:"
                            max={100}
                            changeProgress={setCount}
                        />{" "}
                        <CardProgress
                            title="Duration:"
                            suffix="minutes"
                            max={90}
                            changeProgress={setDuration}
                        />{" "}
                        <CardProgress
                            changeProgress={setPassing}
                            title="Passing Score:"
                            suffix="%"
                            max={100}
                        />
                    </div>
                </div>
                <div>
                    <div className="flex items-center gap-3">
                        <p className="text-lg font-semibold">Subjects</p>
                        <span
                            className=" underline cursor-pointer text-sm font-normal"
                            onClick={handleSelectAll}
                        >
                            Select All
                        </span>
                    </div>{" "}
                    <div className="grid mt-4 gap-4 grid-cols-3">
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
                <div className="flex mt-6 items-center justify-end gap-4">
                    <MtUiButton size="large" onClick={onCancel}>
                        Cancel
                    </MtUiButton>
                    <MtUiButton
                        size="large"
                        type="primary"
                        onClick={onStart}
                        loading={loading}
                    >
                        Start
                    </MtUiButton>
                </div>
            </div>
        </Dialog>
    );
};

export default ModalSettingCustomTest;

import CloseIcon from "@/asset/icon/CloseIcon";
import { MtUiButton } from "@/components/button";
import LazyLoadImage from "@/components/images";
import { db } from "@/db/db.model";
import useDebounce from "@/hooks/useDebounce";
import { ITopic } from "@/models/topics/topics";
import ctx from "@/utils/mergeClass";
import Slider from "@mui/material/Slider";
import clsx from "clsx";
import { useAppDispatch } from "@/redux/hooks";
import { startCustomTest } from "@/redux/features/game";
type ICardFeeBack = {
    text: string;
    des: string;
    onSelect: (e: IFeedBack) => void;
    type: IFeedBack;
    select: IFeedBack;
};

const CardFeeBack = ({ text, des, onSelect, type, select }: ICardFeeBack) => {
    const handleSelect = () => {
        onSelect(type);
    };
    return (
        <div
            className={clsx(
                "bg-white w-full h-full flex items-center justify-between gap-6 p-4 rounded-lg border border-solid",
                {
                    "border-primary": select === type,
                }
            )}
            onClick={handleSelect}
        >
            <div className="flex-1">
                <p className="text-base font-medium">{text}</p>
                <p className="text-[#21212185] text-xs font-normal">{des}</p>
            </div>
            <div
                className={clsx("w-5 h-5 rounded-full bg-white  border-solid", {
                    "border-primary border-[6px]": select === type,
                    border: select !== type,
                })}
            ></div>
        </div>
    );
};
type ICardProgress = {
    title: string;
    suffix?: string;
    max: number;
    changeProgress: (e: number) => void;
};

const CardProgress = ({
    title,
    suffix,
    max,
    changeProgress,
}: ICardProgress) => {
    const [value, setValue] = useState(0);

    const progress = useDebounce(value, 500);

    useEffect(() => {
        changeProgress(progress);
    }, [progress]);
    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number);
    };
    return (
        <div className="w-full h-fill ">
            <div className="w-full flex items-center justify-between">
                <p className="text-base font-medium">{title}</p>
                <div className="flex items-center gap-1">
                    <span className="text-base font-medium">{value}</span>
                    <span className="text-base font-medium">{suffix}</span>
                </div>
            </div>
            <div className="bg-white mt-2 w-full h-fill p-4 rounded-lg border border-solid">
                <Slider
                    defaultValue={30}
                    value={value}
                    onChange={handleSliderChange}
                    sx={{
                        height: "10px",
                        padding: "8px 0",
                        "& .MuiSlider-track": {
                            backgroundColor: "primary.main",
                            border: "none",
                            height: "10px",
                        },
                        "& .MuiSlider-thumb": {
                            backgroundColor: "white",
                            border: "1px solid var(--color-primary)",
                        },
                        "& .MuiSlider-rail": {
                            backgroundColor: "#ccc",
                            height: "10px",
                        },
                    }}
                />
                <div className="flex text-xs font-medium w-full items-center justify-between">
                    <span>0</span>
                    <span>{max}</span>
                </div>
            </div>
        </div>
    );
};
type ICardTopic = {
    item: ITopic;
    selectListTopic: ITopic[];
    setSelectListTopic: (e: ITopic[] | ((prev: ITopic[]) => ITopic[])) => void;
};
const CardTopic = ({
    item,
    selectListTopic,
    setSelectListTopic,
}: ICardTopic) => {
    const isCheck = selectListTopic.some((s) => s.id === item.id);
    const handleSelect = () => {
        setSelectListTopic((prev: ITopic[]) => {
            const isAlreadySelected = prev.some(
                (s: ITopic) => s.id === item.id
            );
            if (isAlreadySelected) {
                return prev.filter((s: ITopic) => s.id !== item.id);
            }
            return [...prev, item];
        });
    };
    return (
        <div
            onClick={handleSelect}
            className={clsx(
                " cursor-pointer w-full flex bg-white items-center justify-between gap-[10px] rounded-lg border border-solid p-4 ",
                {
                    "border-primary ": isCheck,
                    "border-[#21212152]  ": !isCheck,
                }
            )}
        >
            <div className="w-8 p-1 h-8 rounded-lg bg-[#7C6F5B]">
                <LazyLoadImage src={item.icon} />
            </div>
            <p className="text-sm font-medium">{item.name}</p>
            <div
                className={ctx(
                    "w-5 h-5 rounded-md border border-solid flex items-center overflow-hidden  justify-center ",
                    {
                        "border-primary bg-primary ": isCheck,
                        "border-[#21212152] ": !isCheck,
                    }
                )}
            >
                <IconCheck />
            </div>
        </div>
    );
};

const IconCheck = () => {
    return (
        <svg
            width="11"
            height="8"
            viewBox="0 0 11 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M9.14356 0.473692C9.20327 0.412763 9.27454 0.364359 9.3532 0.331315C9.43185 0.29827 9.5163 0.28125 9.60162 0.28125C9.68693 0.28125 9.77139 0.29827 9.85004 0.331315C9.92869 0.364359 9.99997 0.412763 10.0597 0.473692C10.3099 0.726567 10.3134 1.13519 10.0684 1.39244L4.89456 7.50869C4.83581 7.5732 4.76453 7.62504 4.68506 7.66105C4.60559 7.69706 4.51962 7.71648 4.43239 7.71811C4.34516 7.71975 4.25851 7.70358 4.17775 7.67058C4.09698 7.63758 4.0238 7.58845 3.96268 7.52619L0.81443 4.33594C0.693013 4.21212 0.625 4.04561 0.625 3.87219C0.625 3.69877 0.693013 3.53227 0.81443 3.40844C0.874146 3.34751 0.945417 3.29911 1.02407 3.26606C1.10272 3.23302 1.18718 3.216 1.27249 3.216C1.35781 3.216 1.44226 3.23302 1.52092 3.26606C1.59957 3.29911 1.67084 3.34751 1.73056 3.40844L4.40106 6.11482L9.12606 0.492942C9.1315 0.48618 9.13734 0.479752 9.14356 0.473692Z"
                fill="white"
            />
        </svg>
    );
};
