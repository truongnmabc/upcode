import { IAnswer, IQuestion } from "../question/questions";

export interface IUserQuestionProgress extends IQuestion {
  selectedAnswers?: IAnswer;
  correct: boolean;
}

export default class UserQuestionProgress implements IUserQuestionProgress {
  answers: IAnswer[] = [];
  appId: number = 0;
  contentType: number = 0;
  correct: boolean = false;
  // createDate: number = Date.now();
  // databaseId: number = 0;
  explanation: string = "";
  // hasChild: boolean = false;
  // hint: string = "";
  id: number = 0;
  // image: string = "";
  // index: number = 0;
  // lastUpdate: number = Date.now();
  level: number = 0;
  // oldId: number = 0;
  // paragraphId: number = 0;
  parentId: number = 0;
  selectedAnswers?: IAnswer;
  status: number = 0;
  syncStatus: number = 0;
  text: string = "";

  constructor(obt: Partial<IUserQuestionProgress> = {}) {
    this.answers = obt.answers ?? this.answers;
    this.appId = obt.appId ?? this.appId;
    this.contentType = obt.contentType ?? this.contentType;
    this.correct = obt.correct ?? this.correct;
    // this.createDate = obt.createDate ?? this.createDate;
    // this.databaseId = obt.databaseId ?? this.databaseId;
    this.explanation = obt.explanation ?? this.explanation;
    // this.hasChild = obt.hasChild ?? this.hasChild;
    // this.hint = obt.hint ?? this.hint;
    this.id = obt.id ?? this.id;
    // this.image = obt.image ?? this.image;
    // this.index = obt.index ?? this.index;
    // this.lastUpdate = obt.lastUpdate ?? this.lastUpdate;
    this.level = obt.level ?? this.level;
    // this.oldId = obt.oldId ?? this.oldId;
    // this.paragraphId = obt.paragraphId ?? this.paragraphId;
    this.parentId = obt.parentId ?? this.parentId;
    this.selectedAnswers = obt.selectedAnswers;
    this.status = obt.status ?? this.status;
    this.syncStatus = obt.syncStatus ?? this.syncStatus;
    this.text = obt.text ?? this.text;
  }
}
