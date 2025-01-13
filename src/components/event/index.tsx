"use client";
import { resetState } from "@/redux/features/game";
import { useAppDispatch } from "@/redux/hooks";
// import initCustomTestThunk from "@/redux/repository/game/initData/initCustomTest";
// import initDiagnosticTestQuestionThunk from "@/redux/repository/game/initData/initDiagnosticTest";
// import initFinalTestThunk from "@/redux/repository/game/initData/initFinalTest";
// import initQuestionThunk from "@/redux/repository/game/initData/initLearningQuestion";
// import initPracticeThunk from "@/redux/repository/game/initData/initPracticeTest";
import pauseTestThunk from "@/redux/repository/game/pauseAndResumed/pauseTest";
import beforeUnLoadThunk from // reloadStateThunk,
"@/redux/repository/utils/reload";
// import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";

const EventListener = () => {
    const dispatch = useAppDispatch();
    // const subTopicTag = useSearchParams().get("subTopic");
    // const partTag = useSearchParams().get("tag");
    // const type = useSearchParams().get("type");
    // const testId = useSearchParams().get("testId");
    // const pathname = usePathname();

    // const handlePageReload = useCallback(() => {
    //     const data = localStorage.getItem("optQuery");
    //     if (data) {
    //         // if (partTag && subTopicTag && type === "learn") {
    //         //     dispatch(
    //         //         initQuestionThunk({
    //         //             partTag: partTag,
    //         //             subTopicTag: subTopicTag,
    //         //         })
    //         //     );
    //         // }
    //         // practice test
    //         if (type === "test") {
    //             dispatch(initPracticeThunk({}));
    //         }

    //         if (pathname?.includes("diagnostic_test")) {
    //             dispatch(initDiagnosticTestQuestionThunk());
    //         }
    //         if (pathname?.includes("custom_test")) {
    //             dispatch(initCustomTestThunk());
    //         }
    //         if (pathname?.includes("final_test")) {
    //             dispatch(initFinalTestThunk());
    //         }
    //         dispatch(reloadStateThunk());
    //         setTimeout(() => localStorage.removeItem("optQuery"), 100);
    //     }
    // }, [dispatch, subTopicTag, partTag, type, pathname]);

    // useEffect(() => {
    //     handlePageReload();
    // }, [handlePageReload, subTopicTag, partTag, type]);

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

    const handleBackPage = useCallback(() => {
        dispatch(resetState());
    }, [dispatch]);

    useEffect(() => {
        window.addEventListener("popstate", handleBackPage);

        return () => {
            window.removeEventListener("popstate", handleBackPage);
        };
    }, [handleBackPage]);

    return null;
};

export default EventListener;
