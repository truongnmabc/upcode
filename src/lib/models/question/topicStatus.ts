export interface ITopicStatus {
  parentId: number;
  id: number;
}

export default class TopicStatus implements ITopicStatus {
  parentId: number;
  id: number;
  constructor(object: Partial<ITopicStatus> = {}) {
    this.parentId = object.parentId || 0;
    this.id = object.id || 0;
  }
}
