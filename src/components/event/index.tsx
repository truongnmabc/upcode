"use client";
import { shouldOpenSubmitTest } from "@/redux/features/tests";
import { useAppDispatch } from "@/redux/hooks";
import initQuestionThunk from "@/redux/repository/game/initQuestion";
import initTestQuestionThunk from "@/redux/repository/game/initTestQuestion";
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

    // const handlePopState = useCallback(() => {
    //     const { pathname, search } = window.location;
    //     console.log("🚀 ~ handlePopState ~ search:", search);
    //     console.log("🚀 ~ handlePopState ~ pathname:", pathname);

    //     // if (pathname.includes("/study") && search.includes("type=test")) {
    //     console.log("🚀 ~ Handle popstate triggered on /study with ?type=test");

    //     dispatch(shouldOpenSubmitTest(true));

    //     window.history.pushState(
    //         null,
    //         "",
    //         "http://localhost:3030/asvab/study/Practice%20Tests?type=test&testId=4668183050977280"
    //     );
    //     // }
    // }, [dispatch]);
    // useEffect(() => {
    //     console.log("Adding popstate event listener to window");

    //     window.addEventListener("popstate", handlePopState);

    //     return () => {
    //         console.log("Removing popstate event listener from window");
    //         window.removeEventListener("popstate", handlePopState);
    //     };
    // }, []);

    return <></>;
};

export default EventListener;
