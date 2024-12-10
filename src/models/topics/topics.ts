export interface ITopic {
  id: number;
  parentId: number;
  name: string;
  icon: string;
  tag: string;
  type: number;
  contentType: number;
  orderIndex: number;

  // NOTE: api khong tra ve
  topics?: ITopic[];
  description?: string;
  status?: number;
  slug?: string;
  totalQuestion?: number;

  // Optional
  color?: string;
}
export default class Topic implements ITopic {
  icon: string;
  id: number;
  name: string;
  type: number;
  contentType: number;
  orderIndex: number;
  parentId: number;
  status: number;
  description: string;
  tag: string;
  slug: string;
  totalQuestion: number;
  topics?: ITopic[];

  constructor(object: Partial<ITopic> = {}) {
    this.description = object.description ?? "";
    this.icon = object.icon ?? "";
    this.id = object.id ?? -1;
    this.name = object.name ?? "";
    this.type = object.type ?? 0;
    this.contentType = object.contentType ?? 0;
    this.orderIndex = object.orderIndex ?? 0;
    this.parentId = object.parentId ?? -1;
    this.status = object.status ?? 0;
    this.tag = object.tag ?? "";
    this.slug = `${object.tag}-practice-test`;
    this.totalQuestion = object.totalQuestion ?? 0;
    this.topics = object.topics ?? [];
  }
}

export interface IProgress {
  familiar: number;
  mastered: number;
  notSeen: number;
}

// Update the function with proper types
export const calculateTopicProgress = (progress: IProgress): number => {
  const familiar = progress?.familiar ?? 0;
  const mastered = progress?.mastered ?? 0;
  const notSeen = progress?.notSeen ?? 0;
  const total = familiar + mastered + notSeen;

  if (total === 0) {
    return 0;
  }

  const p = (familiar * 0.5 + mastered * 1) / total;
  return Math.round(p * 100);
};
