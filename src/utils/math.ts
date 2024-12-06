import { IQuestion } from "@/lib/models/question/questions";
import { ITopic } from "@/lib/models/topics/topics";

export const groupTopics = (
  listTopic: ITopic[],
  sequence: number
): Array<{ id: number; value: ITopic[] }> => {
  const arr: Array<{ id: number; value: ITopic[] }> = [];
  let idx = 0;

  for (let i = 0; i < listTopic.length; i++) {
    if (!arr[idx]) arr[idx] = { id: idx + 1, value: [] };
    arr[idx].value.push(listTopic[i]);
    if (arr[idx].value.length === sequence) idx++;
  }

  return arr;
};

export const calculatorAverageLevel = (questions: IQuestion[]): number => {
  const listLevel = questions.map((ques) => (ques.level < 0 ? 50 : ques.level));

  const totalLevel = listLevel.reduce((acc, curr) => acc + curr, 0);

  return totalLevel / listLevel.length;
};
