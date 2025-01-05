"use client";

import React, { useState } from "react";
import ChoiceQuestionBeforeStart from "./choiceQuestionBeforeStart";
import RandomGameContent from "./randomGameContent";

const RandomQuestions = () => {
    const [isStart, setIsStart] = useState(false);
    return (
        <div
            className="w-full rounded-lg bg-white "
            style={{
                boxShadow: "0px 2px 4px 0px #2121211F",
            }}
        >
            {isStart ? (
                <RandomGameContent setIsStart={setIsStart} />
            ) : (
                <ChoiceQuestionBeforeStart setIsStart={setIsStart} />
            )}
        </div>
    );
};

export default React.memo(RandomQuestions);
