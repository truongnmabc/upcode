import { db } from "@/db/db.model";
import { IPassingModel } from "@/models/passing/passingModel";
import { IUserQuestionProgress } from "@/models/progress/userQuestionProgress";

export const totalPassingPart = (
    userProgress: IUserQuestionProgress[],
    averageLevel: number
) => {
    const passing = userProgress.reduce((acc, cur) => {
        if (cur?.selectedAnswers?.length) {
            const lastThreeElements = cur?.selectedAnswers.slice(-3);

            const passAnswerCount = lastThreeElements.filter(
                (item) => item.correct
            ).length;

            const passingProbability = passAnswerCount / 3;

            const level = (cur.level === -1 ? 50 : cur.level) / averageLevel;

            const passing = passingProbability * level;

            return acc + passing;
        } else {
            return acc + 0;
        }
    }, 0);

    return passing;
};

export const totalPassingApp = (listPass: IPassingModel[]) => {
    const passing = listPass.reduce((acc, cur) => {
        return acc + cur.passing;
    }, 0);

    return passing;
};

export const totalQuestionApp = (listPass: IPassingModel[]) => {
    const passing = listPass.reduce((acc, cur) => {
        return acc + cur.totalQuestion;
    }, 0);

    return passing;
};

export const saveDataPassing = async ({
    id,
    data,
}: {
    id: number;
    data: IPassingModel;
}) => {
    await db?.passing.update(id, data);
};
