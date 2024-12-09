import React from "react";

const FN = ({ content }: { content: string }) => {
  if (!content) return <></>;
  return (
    <div className="p-4 mb-28 sm:mb-0 sm:p-6 rounded-md  overflow-hidden bg-white dark:bg-black">
      <div
        className="html-content-revert"
        dangerouslySetInnerHTML={{
          __html: (content ?? "").replace(/\[/g, "<").replace(/\]/g, ">"),
        }}
      />
    </div>
  );
};
const SeoContent = React.memo(FN);
export default SeoContent;
