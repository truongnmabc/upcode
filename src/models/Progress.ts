import Question from "./Question";

export interface IProgress {
    correct: number; // tất cả số câu trả lời đúng sau cùng
    done: number;
    familiar: number; // số câu sai ở lần trả lời đầu cuối cùng
    mastered: number; // số câu đúng ở lần trả lời đầu cuối cùng
    mistake: number;
    notDone: number;
    passingPoint: number; // sẽ là giá trị đại số khi STATE_VERSION = 1, không phải là tỷ lệ nữa ***
    skipped: number;
    total: number; // tổng số câu
}
export default class Progress implements IProgress {
    correct: number;
    done: number;
    familiar: number;
    mastered: number;
    mistake: number;
    notDone: number;
    passingPoint: number;
    skipped: number;
    total: number;
    constructor(progress?: any) {
        this.done = progress.done ?? 0;
        this.notDone = progress.notDone ?? 0;
        this.mistake = progress.mistake ?? 0;
        this.skipped = progress.skipped ?? 0;
        this.correct = progress.correct ?? 0;
        this.total = progress.total ?? 0;
        this.mastered = progress.mastered ?? 0;
        this.familiar = progress.familiar ?? 0;
        this.passingPoint = progress.passingPoint ?? 0;
    }

    static init() {
        return new Progress({
            done: 0,
            notDone: 0,
            correct: 0,
            mistake: 0,
            skipped: 0,
            total: 0,
            mastered: 0,
            familiar: 0,
            passingPoint: 0,
        });
    }
    static calcProgress(questions: Question[]) {
        let total = questions.length;
        let done = 0,
            notDone = 0,
            mistake = 0,
            skipped = 0,
            correct = 0,
            mastered = 0,
            familiar = 0,
            passingPoint = 0;
        return new Progress({
            done,
            notDone,
            correct,
            mistake,
            skipped,
            mastered,
            total,
            familiar,
            passingPoint,
        });
    }
    getNotSeenNumber() {
        return this.total - this.familiar - this.mastered;
    }

    getFamiliarNumber() {
        return this.familiar;
    }

    getMasteredNumber() {
        return this.mastered;
    }

    getPercentComplete() {
        return this.passingPoint;
    }
    /**
     *
     * @param progress Danh sách của các câu trả lời từng chọn cho câu hỏi này
     * @returns điêm trung bình cho 1 câu theo công thức như bên app
     */
    static calculatePassingPointByNewFomular = (progress: number[]) => {
        let convertPoint = { 0: 0.5, 1: 1 };
        let point = 0;
        let count = 0;
        if (progress.length) {
            for (let i = progress.length - 1; i >= progress.length - 3; i--) {
                if (i >= 0) {
                    count++;
                    point += convertPoint[progress[i]];
                }
            }
        } else count = 1;
        return point / count;
    };
}
