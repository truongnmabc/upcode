import CloseIcon from "@/asset/icon/CloseIcon";
import RouterApp from "@/common/router/router.constant";
import { appInfoState } from "@/redux/features/appInfo";
import { useAppSelector } from "@/redux/hooks";
import { revertPathName } from "@/utils/pathName";
import { ArrowBack } from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const replaceName = (path?: string) => {
    const key = path?.replace("-practice-test", "");
    return key?.replaceAll("-", " ");
};

const TitleFinishPage = ({ currentPart }: { currentPart: number }) => {
    const topicName = useSearchParams().get("topic");
    const topic = replaceName(topicName || "");
    const router = useRouter();
    const { appInfo } = useAppSelector(appInfoState);
    const mainHref = revertPathName({
        href: RouterApp.Home,
        appName: appInfo?.appShortName,
    });
    const handleBack = () => router.push(mainHref);

    return (
        <div className="w-full flex flex-col gap-4 sm:gap-6">
            <div className="text-center hidden sm:block mx-6 py-2 relative bg-white rounded-full">
                <div
                    onClick={handleBack}
                    className="top-0  hover:bg-[#2121210A] cursor-pointer flex items-center justify-center h-full  w-12 rounded-full bg-white shadow-close absolute left-0"
                >
                    <CloseIcon />
                </div>
                <h3 className="text-2xl font-semibold capitalize font-poppins">
                    {topic}
                </h3>
            </div>

            <div className="flex items-center  justify-between sm:hidden">
                <div onClick={handleBack}>
                    <ArrowBack />
                </div>
                <h3 className="text-lg font-medium capitalize font-poppins">
                    {topic}
                </h3>
                <div></div>
            </div>

            <div>
                <h2 className="text-2xl sm:text-3xl text-center font-semibold">
                    Core {currentPart} Completed!
                </h2>
                <h3 className="text-center pt-2 sm:pt-4 text-sm  sm:text-base font-normal">
                    Time for a dance break! (Disclaimer: App is not responsible
                    for any injuries sustained during spontaneous dance
                    celebrations.)
                </h3>
            </div>
        </div>
    );
};

export default React.memo(TitleFinishPage);
