export interface IUserInfo {
    id: string;
    name: string;
    email: string;
    avatar: string;
}
export class UserInfo implements IUserInfo {
    id: string;
    name: string;
    email: string;
    avatar: string;

    constructor(object: Partial<IUserInfo> = {}) {
        this.id = object.id ?? "";
        this.name = object.name ?? "";
        this.email = object.email ?? "";
        this.avatar = !!object?.avatar ? object?.avatar : "/images/avatar.png";
    }
}
