"use client";

import LazyLoadImage from "@/components/images";
import SubAction from "@/components/study/contentGroup/mainStudyView/bottomBtn/subAction";

import React, { useEffect, useState } from "react";
import { MathJax } from "better-react-mathjax";
import { ICurrentGame } from "@/models/game/game";

const QuestionResult = ({ item }: { item: ICurrentGame }) => {
    if (item?.status > 0) {
        return (
            <div
                className="rounded-lg"
                style={{
                    boxShadow: " 0px 2px 8px 0px #21212129",
                }}
            >
                <div className="w-full rounded-t-lg bg-[#FFFBE1] flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        {/* <LazyLoadImage classNames="w-8 h-8" src="/" /> */}
                        <p className="text-base font-medium capitalize ">
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

import { MyCrypto } from "@/utils/myCrypto";
import GetIconPrefix from "@/components/study/contentGroup/mainStudyView/choicesPanel/getIcon";
import ctx from "@/utils/mergeClass";

const ContentAnswer = ({ item }: { item: ICurrentGame }) => {
    const [text, setText] = useState<string>("");
    const [explanationDetail, setExplanationDetail] = useState<string>("");
    useEffect(() => {
        if (item.text) {
            try {
                const content = MyCrypto.decrypt(item.text);
                const explanation = MyCrypto.decrypt(item.explanation);
                setText(content);
                setExplanationDetail(explanation);
            } catch (err) {
                console.log("🚀 ~ useEffect ~ err:", err);
            } finally {
            }
        }
    }, [item.text, item.explanation]);

    return (
        <div className="rounded-b-lg bg-white flex flex-col gap-2 p-4">
            <MathJax>
                <span
                    dangerouslySetInnerHTML={{
                        __html: text,
                    }}
                    className="text-sm font-normal sm:text-base"
                />
            </MathJax>
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
                            statusChoice={
                                item?.selectedAnswer &&
                                ((item?.selectedAnswer?.id === item?.id &&
                                    choice?.correct) ||
                                    choice.correct)
                                    ? "pass"
                                    : item?.selectedAnswer?.id === choice?.id &&
                                      !choice?.correct
                                    ? "miss"
                                    : "other"
                            }
                        />

                        {/* <MathJax
                            style={{
                                fontSize: 12,
                            }}
                            // dynamic
                            // renderMode="post"
                        > */}
                        <span
                            dangerouslySetInnerHTML={{
                                __html: choice.text,
                            }}
                        />
                        {/* </MathJax> */}
                    </div>
                ))}
            </div>
            {/* <MathJax> */}
            <span
                dangerouslySetInnerHTML={{
                    __html: explanationDetail,
                }}
                className="text-sm font-normal sm:text-base"
            />
            {/* </MathJax> */}
        </div>
    );
};
