import React from "react";

const FN = ({ content }: { content: string }) => {
  if (!content) return <></>;
  return (
    <div
      className="p-4 sm:p-6 rounded-md  overflow-hidden bg-white dark:bg-black"
      dangerouslySetInnerHTML={{
        __html: (content ?? "").replace(/\[/g, "<").replace(/\]/g, ">"),
      }}
    />
  );
};
const SeoContent = React.memo(FN);
export default SeoContent;
