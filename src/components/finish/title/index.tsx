import CloseIcon from "@/asset/icon/CloseIcon";
import RouterApp from "@/common/router/router.constant";
import { appInfoState } from "@/redux/features/appInfo";
import { useAppSelector } from "@/redux/hooks";
import { revertPathName } from "@/utils/pathName";
import { useRouter, useSearchParams } from "next/navigation";

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
    <div className="w-full flex flex-col gap-6">
      <div className="text-center mx-6 py-2 relative bg-white rounded-full">
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

      <div>
        <h2 className="text-3xl text-center font-semibold">
          Core {currentPart} Completed!
        </h2>
        <h3 className="text-center pt-4 text-base font-normal">
          Time for a dance break! (Disclaimer: App is not responsible for any
          injuries sustained during spontaneous dance celebrations.)
        </h3>
      </div>
    </div>
  );
};

export default TitleFinishPage;
