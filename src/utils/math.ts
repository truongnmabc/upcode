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

export const fetchQuestionsForTopics = async (
    selectListTopic: ITopicBase[],
    countQuestionTopic: number,
    remainderQuestionTopic: number,
    excludeListID: number[] = [] // Danh sách ID cần loại trừ
): Promise<IQuestionOpt[]> => {
    const listQuestion: IQuestionOpt[] = [];
    const selectedQuestionIds = new Set<number>(); // Set để lưu ID đã chọn

    // Lấy tất cả partId từ tất cả topics
    const allPartIds = selectListTopic.flatMap((topic) =>
        topic.topics.flatMap((subTopic) =>
            subTopic.topics.map((part) => part.id)
        )
    );

    if (!allPartIds.length) return [];

    // Truy vấn tất cả câu hỏi của các partId trong một lần truy vấn
    let allQuestions = await fetchQuestionsDb({
        ids: allPartIds,
        key: "partId",
    });

    // Loại bỏ các câu hỏi có trong excludeListID
    if (excludeListID.length) {
        allQuestions = allQuestions?.filter(
            (question) => !excludeListID.includes(question.id)
        );
    }

    // Tạo một Map để tra cứu nhanh câu hỏi theo partId
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
                .filter((item) => !selectedQuestionIds.has(item.id)) // Loại bỏ câu hỏi trùng
                .slice(0, questionCount)
                .map((item) => {
                    selectedQuestionIds.add(item.id); // Lưu ID đã chọn
                    return {
                        ...item,
                        tag: topic.tag,
                        icon: topic.icon,
                        parentId: topic.id,
                    };
                });

            listQuestion.push(...randomQuestions);
        }

        // Xử lý phần câu hỏi dư nếu có
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
                        .filter((item) => !selectedQuestionIds.has(item.id)) // Loại bỏ câu hỏi trùng
                        .slice(0, remainderQuestionTopic)
                        .map((item) => {
                            selectedQuestionIds.add(item.id); // Lưu ID đã chọn
                            return {
                                ...item,
                                tag: topic.tag,
                                icon: topic.icon,
                                parentId: topic.id,
                            };
                        });

                    listQuestion.push(...extraRandomQuestions);
                }
            }
        }
    }

    return listQuestion;
};

export const fetchQuestionsHardForTopics = async ({
    selectListTopic,
    countQuestionTopic,
    remainderQuestionTopic,
}: {
    selectListTopic: ITopicBase[];
    countQuestionTopic: number;
    remainderQuestionTopic: number;
}): Promise<IQuestionOpt[]> => {
    const listQuestion: IQuestionOpt[] = [];

    // Lấy tất cả partId từ tất cả topics
    const allPartIds = selectListTopic.flatMap((topic) =>
        topic.topics.flatMap((subTopic) =>
            subTopic.topics.map((part) => part.id)
        )
    );

    if (!allPartIds.length) return [];

    // Truy vấn tất cả câu hỏi của các partId trong một lần truy vấn

    let allQuestions = await fetchQuestionsDb({
        ids: allPartIds,
        key: "partId",
    });
    // Chỉ lấy các câu hỏi có level >= 50
    allQuestions = allQuestions?.filter(
        (question) => question.level >= 50 || question.level === -1
    );

    // Tạo một Map để tra cứu nhanh câu hỏi theo partId
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
                .slice(0, questionCount)
                .map((item) => ({
                    ...item,
                    tag: topic.tag,
                    icon: topic.icon,
                    parentId: topic.id,
                }));

            listQuestion.push(...randomQuestions);
        }

        // Xử lý phần câu hỏi dư nếu có
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

    return listQuestion;
};
