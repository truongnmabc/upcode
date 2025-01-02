"use client";

import LazyLoadImage from "@/components/images";
import SubAction from "@/components/study/mainStudyView/bottomBtn/subAction";

import { ICurrentGame } from "@/models/game/game";
import { MathJax } from "better-react-mathjax";

const QuestionResult = ({ item }: { item: ICurrentGame }) => {
    if (item?.status > 0) {
        return (
            <div
                className="rounded-lg  w-full h-full flex flex-col flex-1"
                style={{
                    boxShadow: " 0px 2px 8px 0px #21212129",
                }}
            >
                <div className="w-full rounded-t-lg bg-[#FFFBE1] overflow-hidden flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-500 flex items-center justify-center rounded-md">
                            <LazyLoadImage
                                classNames="w-6 h-6"
                                src={item?.icon || ""}
                            />
                        </div>

                        <p className="text-base flex-1  font-medium capitalize ">
                            {item.tag?.replaceAll("-", " ")}
                        </p>
                    </div>
                    <div>
                        <SubAction />
                    </div>
                </div>
                <ContentAnswer item={item} />
            </div>
        );
    }
};

export default QuestionResult;

import GetIconPrefix from "@/components/study/mainStudyView/choicesPanel/getIcon";
import ctx from "@/utils/mergeClass";
import { MyCrypto } from "@/utils/myCrypto";
import { useAppSelector } from "@/redux/hooks";
import { selectAppInfo } from "@/redux/features/appInfo.reselect";

const ContentAnswer = ({ item }: { item: ICurrentGame }) => {
    const appInfo = useAppSelector(selectAppInfo);
    return (
        <div className="rounded-b-lg  bg-white flex flex-1 overflow-hidden  flex-col gap-2 p-4">
            <div className="w-full flex justify-between gap-2 ">
                {item?.text && (
                    <MathJax>
                        <span
                            dangerouslySetInnerHTML={{
                                __html: MyCrypto.decrypt(item?.text),
                            }}
                            className="text-sm font-normal sm:text-base"
                        />
                    </MathJax>
                )}
                {item?.image && (
                    <LazyLoadImage
                        src=""
                        alt={item.image}
                        classNames="w-16 sm:w-24 max-h-24 min-h-16"
                    />
                )}
            </div>
            <div className={"grid gap-2 grid-cols-1 sm:grid-cols-2"}>
                {item?.answers?.map((choice, index) => (
                    <div
                        className={ctx(
                            "flex gap-2 w-full h-full bg-white sm:bg-transparent items-center rounded-md border border-solid px-4 py-3 hover:bg-[#2121210a]",
                            {
                                "border-[#21212185]":
                                    item?.selectedAnswer?.id === choice?.id,
                                "border-[#07C58C]": choice.correct,
                            }
                        )}
                        key={index}
                        id={(index + 1).toString()}
                    >
                        <GetIconPrefix
                            isActions={false}
                            isSelect={item?.selectedAnswer?.id === choice?.id}
                            isReview={true}
                            answerCorrect={choice.correct}
                        />
                        {choice?.text && (
                            <MathJax
                                style={{
                                    fontSize: 12,
                                }}
                                dynamic
                                renderMode="post"
                            >
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: choice?.text,
                                    }}
                                />
                            </MathJax>
                        )}
                    </div>
                ))}
            </div>
            {item?.explanation && (
                <MathJax className="">
                    <span
                        dangerouslySetInnerHTML={{
                            __html: MyCrypto.decrypt(item?.explanation),
                        }}
                        className="text-sm font-normal line-clamp-3 h-full  sm:text-base"
                    />
                </MathJax>
            )}
        </div>
    );
};
