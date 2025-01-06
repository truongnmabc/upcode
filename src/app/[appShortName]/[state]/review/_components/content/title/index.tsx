"use client";
import React, { Fragment, useContext } from "react";
import { ReviewContext } from "../../context";
import { useAppSelector } from "@/redux/hooks";
import { selectListQuestion } from "@/redux/features/game.reselect";

const TitleReview = () => {
    const { selectType } = useContext(ReviewContext);
    const list = useAppSelector(selectListQuestion);
    return (
        <Fragment>
            {(selectType === "random" || selectType === "hard") &&
                list.length === 0 && (
                    <h2 className="text-2xl  text-center font-semibold">
                        How many questions do you want?
                    </h2>
                )}
            {selectType === "weak" && (
                <h2 className="text-2xl  text-center font-semibold">
                    Weak Questions
                </h2>
            )}
            {selectType === "saved" && (
                <h2 className="text-2xl  text-center font-semibold">
                    Saved Questions
                </h2>
            )}
            {selectType === "all" && (
                <h2 className="text-2xl  text-center font-semibold">
                    All Answered Questions
                </h2>
            )}
        </Fragment>
    );
};

export default TitleReview;
