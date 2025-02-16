import { ICurrentGame } from "@/models/game/game";
import { ITopicBase } from "@/models/topics/topicsProgress";
import { v4 as uuidv4 } from "uuid";
import { IQuestionOpt } from "@/models/question";
import { db } from "@/db/db.model";

export const groupTopics = (
    listTopic: ITopicBase[],
    sequence: number
): Array<{ id: number; value: ITopicBase[] }> => {
    const arr: Array<{ id: number; value: ITopicBase[] }> = [];
    let idx = 0;

    for (let i = 0; i < listTopic.length; i++) {
        if (!arr[idx]) arr[idx] = { id: idx + 1, value: [] };
        arr[idx].value.push(listTopic[i]);
        if (arr[idx].value.length === sequence) idx++;
    }

    return arr;
};

export const calculatorAverageLevel = (questions: ICurrentGame[]): number => {
    const listLevel = questions.map((ques) =>
        ques.level < 0 ? 50 : ques.level
    );

    const totalLevel = listLevel.reduce((acc, curr) => acc + curr, 0);

    return totalLevel / listLevel.length;
};

/**
 * Generates a random unique negative ID using UUID v4.
 *
 * @param {number} exclude - The ID to exclude from the result.
 * @return {number} A unique negative ID that is not equal to the excluded value.
 */

export function generateRandomNegativeId(exclude: number = -1): number {
    let randomId: number;
    do {
        // Generate a UUID, hash it, and convert it to a negative number
        randomId = -parseInt(uuidv4().replace(/-/g, "").slice(0, 6), 16);
    } while (randomId === exclude);
    return randomId;
}

export const fetchQuestionsDb = async ({
    ids,
    key,
}: {
    ids: number[];
    key: "partId" | "id";
}): Promise<IQuestionOpt[]> => {
    const allQuestions = await db?.questions?.where(key).anyOf(ids).toArray();
    return allQuestions || [];
};

export const fetchQuestionsForTopics = async ({
    selectListTopic,
    countQuestionTopic,
    remainderQuestionTopic,
    excludeListID = [],
    target,
}: {
    selectListTopic: ITopicBase[];
    countQuestionTopic: number;
    remainderQuestionTopic: number;
    excludeListID?: number[];
    target: number;
}) => {
    const listQuestion: IQuestionOpt[] = [];
    const selectedQuestionIds = new Set<number>();

    const allPartIds = selectListTopic.flatMap((topic) =>
        topic.topics.flatMap((subTopic) =>
            subTopic.topics.map((part) => part.id)
        )
    );

    if (!allPartIds.length) return [];

    let allQuestions = await fetchQuestionsDb({
        ids: allPartIds,
        key: "partId",
    });

    if (excludeListID.length) {
        allQuestions = allQuestions?.filter(
            (question) => !excludeListID.includes(question.id)
        );
    }

    const questionMap = new Map<number, IQuestionOpt[]>();

    allQuestions?.forEach((question) => {
        if (!questionMap.has(question.partId)) {
            questionMap.set(question.partId, []);
        }
        questionMap.get(question.partId)!.push(question);
    });

    for (const [topicIndex, topic] of selectListTopic.entries()) {
        const listPart = topic.topics.flatMap((subTopic) => subTopic.topics);
        if (!listPart.length) continue;

        const countQuestionPart = Math.floor(
            countQuestionTopic / listPart.length
        );
        const remainderQuestionPart = countQuestionTopic % listPart.length;

        for (const [partIndex, part] of listPart.entries()) {
            const topicData = questionMap.get(part.id) || [];
            if (!topicData.length) continue;

            const questionCount =
                partIndex === listPart.length - 1
                    ? countQuestionPart + remainderQuestionPart
                    : countQuestionPart;

            const randomQuestions = topicData
                .sort(() => Math.random() - 0.5)
                .filter((item) => !selectedQuestionIds.has(item.id))
                .slice(0, questionCount)
                .map((item) => {
                    selectedQuestionIds.add(item.id);
                    return {
                        ...item,
                        tag: topic.tag,
                        icon: topic.icon,
                        parentId: topic.id,
                    };
                });

            listQuestion.push(...randomQuestions);
        }

        if (
            topicIndex === selectListTopic.length - 1 &&
            remainderQuestionTopic > 0
        ) {
            const lastParts = listPart.slice(-5).map((part) => part.id);

            const extraQuestions = lastParts
                .flatMap((partId) => questionMap.get(partId) || [])
                .sort(() => Math.random() - 0.5)
                .filter((item) => !selectedQuestionIds.has(item.id))
                .slice(0, remainderQuestionTopic)
                .map((item) => {
                    selectedQuestionIds.add(item.id);
                    return {
                        ...item,
                        tag: topic.tag,
                        icon: topic.icon,
                        parentId: topic.id,
                    };
                });

            listQuestion.push(...extraQuestions);
        }
    }

    if (listQuestion.length < target) {
        const remainingCount = target - listQuestion.length;

        // Get all available questions that haven't been selected yet
        const remainingQuestions = allQuestions
            .filter((question) => !selectedQuestionIds.has(question.id))
            .sort(() => Math.random() - 0.5)
            .slice(0, remainingCount)
            .map((item) => {
                const topic = selectListTopic.find((t) =>
                    t.topics.some((st) =>
                        st.topics.some((p) => p.id === item.partId)
                    )
                );
                return {
                    ...item,
                    tag: topic?.tag || "",
                    icon: topic?.icon || "",
                    parentId: topic?.id || 0,
                };
            });

        listQuestion.push(...remainingQuestions);
    }

    return listQuestion;
};

export const fetchQuestionsHardForTopics = async ({
    selectListTopic,
    countQuestionTopic,
    remainderQuestionTopic,
    target,
}: {
    selectListTopic: ITopicBase[];
    countQuestionTopic: number;
    remainderQuestionTopic: number;
    target: number;
}) => {
    const listQuestion: IQuestionOpt[] = [];
    const selectedQuestionIds = new Set<number>();

    const allPartIds = selectListTopic.flatMap((topic) =>
        topic.topics.flatMap((subTopic) =>
            subTopic.topics.map((part) => part.id)
        )
    );

    if (!allPartIds.length) return [];

    let allQuestions = await fetchQuestionsDb({
        ids: allPartIds,
        key: "partId",
    });

    allQuestions = allQuestions?.filter(
        (question) => question.level >= 50 || question.level === -1
    );

    const questionMap = new Map<number, IQuestionOpt[]>();

    allQuestions?.forEach((question) => {
        if (!questionMap.has(question.partId)) {
            questionMap.set(question.partId, []);
        }
        questionMap.get(question.partId)!.push(question);
    });

    for (const [topicIndex, topic] of selectListTopic.entries()) {
        const listPart = topic.topics.flatMap((subTopic) => subTopic.topics);
        if (!listPart.length) continue;

        const countQuestionPart = Math.floor(
            countQuestionTopic / listPart.length
        );
        const remainderQuestionPart = countQuestionTopic % listPart.length;

        for (const [partIndex, part] of listPart.entries()) {
            const topicData = questionMap.get(part.id) || [];
            if (!topicData.length) continue;

            const questionCount =
                partIndex === listPart.length - 1
                    ? countQuestionPart + remainderQuestionPart
                    : countQuestionPart;

            const randomQuestions = topicData
                .sort(() => Math.random() - 0.5)
                .filter((item) => !selectedQuestionIds.has(item.id))
                .slice(0, questionCount)
                .map((item) => {
                    selectedQuestionIds.add(item.id);
                    return {
                        ...item,
                        tag: topic.tag,
                        icon: topic.icon,
                        parentId: topic.id,
                    };
                });

            listQuestion.push(...randomQuestions);
        }

        if (
            topicIndex === selectListTopic.length - 1 &&
            remainderQuestionTopic > 0
        ) {
            const lastPartId = listPart[listPart.length - 1]?.id;
            if (lastPartId) {
                const extraQuestions = questionMap.get(lastPartId) || [];
                if (extraQuestions.length) {
                    const extraRandomQuestions = extraQuestions
                        .sort(() => Math.random() - 0.5)
                        .slice(0, remainderQuestionTopic)
                        .map((item) => ({
                            ...item,
                            tag: topic.tag,
                            icon: topic.icon,
                            parentId: topic.id,
                        }));

                    listQuestion.push(...extraRandomQuestions);
                }
            }
        }
    }

    if (listQuestion.length < target) {
        const remainingCount = target - listQuestion.length;

        const remainingQuestions = allQuestions
            .filter((question) => !selectedQuestionIds.has(question.id))
            .sort(() => Math.random() - 0.5)
            .slice(0, remainingCount)
            .map((item) => {
                const topic = selectListTopic.find((t) =>
                    t.topics.some((st) =>
                        st.topics.some((p) => p.id === item.partId)
                    )
                );
                return {
                    ...item,
                    tag: topic?.tag || "",
                    icon: topic?.icon || "",
                    parentId: topic?.id || 0,
                };
            });

        listQuestion.push(...remainingQuestions);
    }

    return listQuestion;
};

export const findDuplicates = (
    ids: number[],
    listQuestionIds: number[] = []
) => {
    const duplicates = ids.filter((id) => listQuestionIds.includes(id));
    if (duplicates.length > 0) {
        console.warn("Found duplicate question IDs:", duplicates);
        return true;
    }
    return false;
};
