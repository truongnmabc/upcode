export interface IPart {
  id: number;
  parentId: number;
  name: string;
  icon: string;
  tag: string;
  type: number;
  contentType: number;
  orderIndex: number;

  // NOTE: api khong tra ve
  description?: string;
  status?: number;
  thumbnail?: string;
  slug?: string;
  totalQuestion?: number;
}
export default class Part implements IPart {
  icon: string;
  id: number; // part ???
  name: string;
  type: number;
  contentType: number;
  orderIndex: number;
  parentId: number;
  status: number;
  description: string;
  tag: string;
  thumbnail: string;
  slug: string;
  totalQuestion: number;

  constructor(object: Partial<IPart> = {}) {
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
    this.thumbnail = object.thumbnail ?? "";
    this.slug = object.slug ?? "/";
    this.totalQuestion = object.totalQuestion ?? 0;
  }
}
