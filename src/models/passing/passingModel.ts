export interface IPassingModel {
    parentId: number;
    id: number;
    averageLevel: number;
    totalQuestion: number;
    topics?: IPassingModel[];
    passing: number;
}
