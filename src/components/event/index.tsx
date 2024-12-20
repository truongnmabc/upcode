"use client";
import { useAppDispatch } from "@/redux/hooks";
import initQuestionThunk from "@/redux/repository/game/initQuestion";
import initTestQuestionThunk from "@/redux/repository/game/initTestQuestion";
import pauseTestThunk from "@/redux/repository/game/pauseTest";
import beforeUnLoadThunk, {
    reloadStateThunk,
} from "@/redux/repository/utils/reload";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect } from "react";

const EventListener = () => {
    const dispatch = useAppDispatch();
    const subTopicTag = useSearchParams().get("subTopic");
    const partTag = useSearchParams().get("tag");
    const type = useSearchParams().get("type");
    const testId = useSearchParams().get("testId");

    const handlePageReload = useCallback(() => {
        const data = localStorage.getItem("optQuery");
        if (data) {
            if (partTag && subTopicTag && type === "learn") {
                dispatch(
                    initQuestionThunk({
                        partTag: partTag,
                        subTopicTag: subTopicTag,
                    })
                );
            }

            if (type === "test") {
                dispatch(initTestQuestionThunk({}));
            }
            dispatch(reloadStateThunk());
            setTimeout(() => localStorage.removeItem("optQuery"), 100);
        }
    }, [dispatch, subTopicTag, partTag, type, testId]);

    useLayoutEffect(() => {
        handlePageReload();
    }, [handlePageReload, subTopicTag, partTag, type]);

    const handleBeforeUnload = useCallback(
        () => dispatch(beforeUnLoadThunk()),
        [dispatch]
    );

    useEffect(() => {
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [handleBeforeUnload]);

    const handlePopState = useCallback(() => {
        // dispatch(pauseTestThunk());
        console.log("event listener popstate");
    }, [dispatch]);
    useEffect(() => {
        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    return <></>;
};

export default EventListener;
