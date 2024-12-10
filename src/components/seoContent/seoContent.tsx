import React from "react";

const FN = ({ content }: { content: string }) => {
  return (
    <div
      className="html-content-revert"
      dangerouslySetInnerHTML={{
        __html: (content ?? "").replace(/\[/g, "<").replace(/\]/g, ">"),
      }}
    />
  );
};
const SeoContent = React.memo(FN);
export default SeoContent;
