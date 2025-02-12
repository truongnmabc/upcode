import RouterApp from "@/constants/router.constant";
import { db } from "@/db/db.model";
import { ITopicBase } from "@/models/topics/topicsProgress";
import { setIndexSubTopic } from "@/redux/features/game";
import { selectSubTopics, selectTopics } from "@/redux/features/study";
import initLearnQuestionThunk from "@/redux/repository/game/initData/initLearningQuestion";
import { AppDispatch } from "@/redux/store";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "react-toastify";

export const handleGetNextPart = async ({
    topic,
}: {
    topic: ITopicBase;
}): Promise<{
    partId?: number;
    subTopicId: number;
    allCompleted?: boolean;
    currentIndex: number;
    turn?: number;
}> => {
    const currentTopic = await db?.topics.get(topic?.id);

    if (!currentTopic) {
        toast.error("Error: Can't get data");
        return {
            partId: undefined,
            subTopicId: -1,
            allCompleted: false,
            currentIndex: 0,
        };
    }
    //   trường hợp tất cả subtopic trong topic đã hoàn thành thì sẽ chuyển sang màn finish của subtopic cuối cùng
    if (currentTopic.status === 1) {
        const lastSubTopic =
            currentTopic?.topics?.[currentTopic.topics.length - 1];
        const lastPart = lastSubTopic?.topics?.[lastSubTopic.topics.length - 1];

        return {
            partId: lastPart?.id,
            subTopicId: lastSubTopic?.id,
            allCompleted: true,
            currentIndex: lastSubTopic?.topics?.findIndex(
                (item) => item.id === lastPart?.id
            ),
        };
    }

    const nextSubTopics = currentTopic.topics.find((item) => item.status === 0);
    if (!nextSubTopics)
        return {
            partId: undefined,
            subTopicId: -1,
            allCompleted: false,
            currentIndex: 0,
        };

    const nextPart = findNextPart(nextSubTopics);
    const currentIndex =
        nextSubTopics.topics.findIndex((item) => item.id === nextPart?.id) || 0;

    return {
        partId: nextPart?.id,
        subTopicId: nextPart?.parentId || -1,
        currentIndex,
        turn: nextPart?.turn,
    };
};

const findNextPart = (subTopic: ITopicBase) => {
    return subTopic.topics.find((item) => item.status === 0);
};

type IPropsHandleNavigateStudy = {
    topic: ITopicBase;
    dispatch: AppDispatch;
    router: AppRouterInstance;
    isReplace?: boolean;
};

export const handleNavigateStudy = async ({
    topic,
    dispatch,
    router,
    isReplace = false,
}: IPropsHandleNavigateStudy) => {
    const { partId, subTopicId, allCompleted, currentIndex, turn } =
        await handleGetNextPart({
            topic,
        });

    if (!partId) {
        toast.error("Error: Không tìm thấy partId hợp lệ");
        return;
    }
    if (allCompleted) {
        router.push(
            `${RouterApp.Finish}?partId=${partId}&subTopicId=${subTopicId}&topic=${topic.tag}`
        );
        return;
    }

    const _href = `/study/${topic.tag}-practice-test?type=learn&partId=${partId}&subTopicId=${subTopicId}`;

    dispatch(selectTopics(topic.id));
    dispatch(selectSubTopics(subTopicId));
    dispatch(setIndexSubTopic(currentIndex + 1));
    dispatch(
        initLearnQuestionThunk({
            partId: Number(partId),
            subTopicId: Number(subTopicId),
            attemptNumber: turn,
        })
    );

    if (isReplace) return router.push(_href);
    router.push(_href);
};
