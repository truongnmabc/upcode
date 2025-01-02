import { IAppInfo } from "@/models/app/appInfo";

export interface IItemTest {
    id: string;
    name: string;
    icon: React.ReactNode;
    color: string;
}

export interface IPropsItemTest {
    item: IItemTest;
    appInfo: IAppInfo;
}
