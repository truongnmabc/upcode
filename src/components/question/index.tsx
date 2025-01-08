"use client";
import MtUiSkeleton from "@/components/loading-skeleton";
import { useAppSelector } from "@/redux/hooks";
import { MyCrypto } from "@/utils/myCrypto";
import React, { Fragment, useEffect, useState } from "react";
import { MathJax } from "better-react-mathjax";
import StatusAnswer from "../statusAnswer";
import LazyLoadImage from "@/components/images";
import { selectCurrentGame } from "@/redux/features/game.reselect";
import { baseImageUrl } from "@/constants";
import { selectAppInfo } from "@/redux/features/appInfo.reselect";

const FN = ({ showStatus = true }: { showStatus?: boolean }) => {
    const currentGame = useAppSelector(selectCurrentGame);
    const appInfo = useAppSelector(selectAppInfo);
    const [text, setText] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentGame?.text && currentGame?.id) {
            try {
                const content = MyCrypto.decrypt(currentGame?.text);
                setText(content);
            } catch (err) {
                console.log("🚀 ~ useEffect ~ err:", err);
            } finally {
                setLoading(false);
            }
        }
    }, [currentGame?.id, currentGame?.text]);

    return (
        <div className="w-full rounded-md p-3 flex flex-col gap-2 bg-white sm:bg-transparent  shadow-custom sm:shadow-none relative py-2">
            {loading && !text ? (
                <MtUiSkeleton className="min-h-8" />
            ) : (
                <Fragment>
                    <div className="w-full flex items-center justify-between">
                        <MathJax renderMode="post">
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: text,
                                }}
                                className="text-sm  font-normal sm:text-base"
                            />
                        </MathJax>
                        {currentGame?.image && (
                            <LazyLoadImage
                                key={currentGame?.image}
                                isPreview
                                src={`${baseImageUrl}${appInfo.appShortName}/images/${currentGame?.image}`}
                                alt={currentGame?.image}
                                classNames="w-16 sm:w-24 cursor-pointer aspect-video min-h-16 max-h-24"
                            />
                        )}
                    </div>
                    {currentGame.parentId !== -1 && (
                        <p className="text-sm  font-normal sm:text-base">
                            {currentGame.paragraph?.text}
                        </p>
                    )}
                </Fragment>
            )}
            {showStatus && <StatusAnswer />}
        </div>
    );
};

const QuestionContent = React.memo(FN);
export default QuestionContent;
