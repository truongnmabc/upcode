export interface IUserInfo {
    id: string;
    name: string;
    email: string;
    password: string;
    avatar: string;
}
export class UserInfo implements IUserInfo {
    id: string;
    name: string;
    email: string;
    password: string;
    avatar: string;

    constructor(object: any = {}) {
        this.id = object?.id ?? undefined;
        this.name = object?.name ?? "";
        this.email = object?.email ?? "";
        this.password = object?.password ?? "";
        this.avatar = !!object?.avatar ? object?.avatar : "/images/avatar.png";
        if (!this.name && !!this.email) this.name = this.email.split("@")[0];
    }
}
