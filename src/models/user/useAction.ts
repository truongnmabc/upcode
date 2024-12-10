export type IUserActionStatus = "like" | "dislike" | "save";
export interface IUserActions {
  userId: number;
  status: IUserActionStatus;
  questionId: number;
}
export class UserActions implements IUserActions {
  userId: number;
  status: IUserActionStatus;
  questionId: number;
  constructor(object: Partial<IUserActions> = {}) {
    this.userId = object.userId ?? -1;
    this.questionId = object.questionId ?? -1;
    this.status = object.status as IUserActionStatus;
  }
}
