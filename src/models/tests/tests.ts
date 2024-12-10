export interface ITest {
  id: number;
  lastUpdate: number;
  createDate: number;
  title: string;
  databaseId: number;
  appId: number;
  stateId: number;
  examFormatId: number;
  passingPercent: number;
  duration: number;
  totalQuestion: number;
  thumbnail: string;
  type: number;
  dataType: number;
  status: number;
  topicIds: number[];
  groupExamData: IGroupExam[];
  testType?: string;
}

export interface IGroupExam {
  groupId: number;
  title: string;
  passingPercent: number;
  totalQuestion: number;
  duration: number;
  examData: IExamData[];
}

export interface IExamData {
  topicName: string;
  totalQuestion: number;
  required: boolean;
  topicId: number;
  questionIds: number[];
}
