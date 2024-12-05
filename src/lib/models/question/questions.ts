export interface IAnswer {
  correct: boolean;
  explanation: string;
  id: number;
  index: number;
  text: string;
}

export interface IQuestion {
  answers: IAnswer[];
  appId: number;
  contentType?: number;
  createDate?: number;
  databaseId?: number;
  explanation: string;
  hasChild?: boolean;
  hint: string;
  id: number;
  image: string;
  index: number;
  lastUpdate?: number;
  level: number;
  oldId?: number;
  paragraphId?: number;
  parentId: number;
  status: number;
  syncStatus: number;
  text: string;
}
