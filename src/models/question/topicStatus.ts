export interface ITopicStatus {
  id: number;
}

export default class TopicStatus implements ITopicStatus {
  id: number;
  constructor(object: Partial<ITopicStatus> = {}) {
    this.id = object.id || 0;
  }
}
