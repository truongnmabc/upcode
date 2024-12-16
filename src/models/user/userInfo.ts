export interface IUserInfo {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: number;
  phoneNumber: number;
}
export class UserInfo implements IUserInfo {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: number;
  phoneNumber: number;

  constructor(object: Partial<IUserInfo> = {}) {
    this.id = object.id ?? "";
    this.name = object.name ?? "";
    this.email = object.email ?? "";
    this.phoneNumber = object.phoneNumber ?? 0;
    this.status = object.status ?? 0;
    this.avatar = !!object?.avatar ? object?.avatar : "/images/avatar.png";
  }
}
