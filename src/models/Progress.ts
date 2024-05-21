export interface IProgress {
    correct: number; // tất cả số câu trả lời đúng sau cùng
    mistake: number;
    skipped: number;
    total: number; // tổng số câu
}
export default class Progress implements IProgress {
    correct: number;
    mistake: number;
    skipped: number;
    total: number;
    constructor(progress?: any) {
        this.mistake = progress.mistake ?? 0;
        this.skipped = progress.skipped ?? 0;
        this.correct = progress.correct ?? 0;
        this.total = progress.total ?? 0;
    }

    static init() {
        return new Progress({
            correct: 0,
            mistake: 0,
            skipped: 0,
            total: 0,
        });
    }
}
