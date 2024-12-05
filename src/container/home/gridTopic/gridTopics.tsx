import { IAppInfo } from "@/lib/models/appInfo";
import { ITopic } from "@/lib/models/topics/topics";
import clsx from "clsx";
import TitleTopic from "./item/titleTopic";
import Wrapper from "./item/wrapper";

const GridTopics = ({
  topics,
  appInfo,
  isAll,
}: {
  appInfo: IAppInfo;
  isAll: boolean;
  topics: ITopic[];
}) => {
  return (
    <div className="w-full h-full">
      <h3 className="sm:text-4xl text-center text-xl font-semibold">
        Practice {appInfo.appName} Test By Topics
      </h3>
      <h3 className="text-xs sm:text-base my-3 sm:my-6 text-center">
        {isAll
          ? `Our free ${appInfo?.appName} practice tests feature all ${appInfo?.appName} test subjects. We recommend taking at least one practice exam from every subject to guarantee your success at your local testing location. To get started, choose a category from the list below and practice them!`
          : `Our free ${appInfo?.appName} practice tests feature all ${appInfo?.appName} test subjects. We recommend taking all practice questions to guarantee your success at your local testing location.`}
      </h3>
      <div
        className={clsx(
          "grid gap-3 sm:grid-cols-1 sm:gap-3 md:grid-cols-2 lg:grid-cols-3 lg:gap-4 md:gap-4"
        )}
      >
        {topics?.map((topic, index) => (
          <div
            key={index}
            className={clsx("w-full h-full flex flex-col  sm:block")}
          >
            <TitleTopic topic={topic} priority={3} />
            <Wrapper topic={topic} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridTopics;
