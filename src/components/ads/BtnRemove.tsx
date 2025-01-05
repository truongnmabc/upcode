import RouterApp from "@/router/router.constant";
import { revertPathName } from "@/utils/pathName";
import ForwardedLinkBlank from "../nextLink/forwardedLinkBlank";
import "./index.css";
import { useAppSelector } from "@/redux/hooks";
import { selectAppInfo } from "@/redux/features/appInfo.reselect";
import LazyLoadImage from "../images";

const BtnRemove = () => {
    const appInfo = useAppSelector(selectAppInfo);

    return (
        <div className="btn-remove">
            <ForwardedLinkBlank
                href={revertPathName({
                    appName: appInfo.appShortName,
                    href: RouterApp.Get_pro,
                })}
            >
                <span>Remove ads</span>
                <div className="icon-remove">
                    <LazyLoadImage
                        classNames="w-6 h-6"
                        src="/images/icon-next-remove.svg"
                        alt=""
                    />
                </div>
            </ForwardedLinkBlank>
        </div>
    );
};

export default BtnRemove;
