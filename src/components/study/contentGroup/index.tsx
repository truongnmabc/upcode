import React from "react";
import BannerDownloadApp from "./bannerDownload/bannerDownloadApp";
import SeoContent from "../../seoContent/seoContent";
import MainStudyView from "./mainStudyView";

const FN = ({ contentSeo }: { contentSeo: string }) => {
  return (
    <div className="w-full flex flex-1 flex-col gap-4 sm:gap-6  p-4 sm:p-0  h-full">
      <MainStudyView />
      <BannerDownloadApp />
      {contentSeo && (
        <div className="p-4 mb-28 sm:mb-0 sm:p-6 rounded-md  overflow-hidden bg-white dark:bg-black">
          <SeoContent content={contentSeo} />
        </div>
      )}
    </div>
  );
};
const ContentGroup = React.memo(FN);
export default ContentGroup;
