"use client";
import { useAppDispatch } from "@/redux/hooks";
import initCustomTestThunk from "@/redux/repository/game/initData/initCustomTest";
import initDiagnosticTestQuestionThunk from "@/redux/repository/game/initData/initDiagnosticTest";
import initFinalTestThunk from "@/redux/repository/game/initData/initFinalTest";
import initQuestionThunk from "@/redux/repository/game/initData/initLearningQuestion";
import pauseTestThunk from "@/redux/repository/game/pauseAndResumed/pauseTest";
import beforeUnLoadThunk, {
    reloadStateThunk,
} from "@/redux/repository/utils/reload";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect } from "react";

const EventListener = () => {
    const dispatch = useAppDispatch();
    const subTopicTag = useSearchParams().get("subTopic");
    const partTag = useSearchParams().get("tag");
    const type = useSearchParams().get("type");
    const testId = useSearchParams().get("testId");
    const pathname = usePathname();
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
            // practice test
            if (type === "test") {
                dispatch(initDiagnosticTestQuestionThunk());
            }

            if (pathname?.includes("diagnostic_test")) {
                dispatch(initDiagnosticTestQuestionThunk());
            }
            if (pathname?.includes("custom_test")) {
                dispatch(initCustomTestThunk());
            }
            if (pathname?.includes("final_test")) {
                dispatch(initFinalTestThunk());
            }
            dispatch(reloadStateThunk());
            setTimeout(() => localStorage.removeItem("optQuery"), 100);
        }
    }, [dispatch, subTopicTag, partTag, type, testId, pathname]);

    useLayoutEffect(() => {
        handlePageReload();
    }, [handlePageReload, subTopicTag, partTag, type]);

    const handleBeforeUnload = useCallback(() => {
        dispatch(beforeUnLoadThunk());
        dispatch(pauseTestThunk({}));
    }, [dispatch]);

    useEffect(() => {
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [handleBeforeUnload]);

    return <></>;
};

export default EventListener;
