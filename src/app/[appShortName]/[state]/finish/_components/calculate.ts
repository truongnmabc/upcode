import { db } from "@/db/db.model";
import { IPassingModel } from "@/models/passing/passingModel";
import { IUserQuestionProgress } from "@/models/progress/userQuestionProgress";

export const totalPassingPart = ({
    progress,
    averageLevel,
    turn,
}: {
    progress: IUserQuestionProgress[];
    averageLevel: number;
    turn: number;
}) => {
    const passing = progress.reduce((acc, cur) => {
        if (!cur?.selectedAnswers?.length) return acc;

        // Lấy 3 câu trả lời cuối cùng
        const lastThreeElements = cur.selectedAnswers.slice(-3);

        // Phần trăm đúng của 3 câu trả lời cuối cùng
        const passAnswerCount = lastThreeElements.filter(
            (item) => item.correct && item.turn === turn
        ).length;

        const passingProbability = passAnswerCount / 3;

        const levelRatio = cur.level / (averageLevel || 1);

        return acc + passingProbability * levelRatio;
    }, 0);

    return passing;
};

export const totalQuestionApp = (listPass: IPassingModel[]) => {
    const passing = listPass.reduce((acc, cur) => {
        return acc + cur.totalQuestion;
    }, 0);

    return passing;
};

export const calculatePassingApp = async () => {
    const [users, app] = await Promise.all([
        db?.userProgress.toArray(),
        db?.passingApp.get(-1),
    ]);

    if (!app || !users?.length) return 0;

    const { totalQuestion, averageLevel } = app;

    const totalPassing = users.reduce((acc, cur) => {
        if (!cur?.selectedAnswers?.length) return acc;

        const lastThreeAnswers = cur.selectedAnswers.slice(-3);

        const correctAnswers = lastThreeAnswers.filter(
            (ans) => ans.correct
        ).length;

        const passingProbability = correctAnswers / 3;
        const levelRatio = cur.level / (averageLevel || 1);

        return acc + passingProbability * levelRatio;
    }, 0);

    const passingApp = (totalPassing / (totalQuestion || 1)) * 100;

    return passingApp > 96 ? 96 : passingApp;
};
