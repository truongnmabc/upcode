import { ITopic } from "@/lib/models/topics/topics";
import { selectSubTopics, studyState } from "@/lib/redux/features/study";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { ExpandMore } from "@mui/icons-material";
import clsx from "clsx";
import Image from "next/image";
import React, { useContext } from "react";
import { AllowExpandContext, IContextAllowExpand } from "./provider";
import TopicLevelProgress from "./topicLevelProgress";
import ctx from "@/utils/mergeClass";
const FN = ({ subTopic }: { subTopic: ITopic }) => {
  const { color } = useContext<IContextAllowExpand>(AllowExpandContext);
  const { selectedSubTopics } = useAppSelector(studyState);
  const isExpand = selectedSubTopics === subTopic.id;
  const dispatch = useAppDispatch();

  return (
    <div>
      <div
        className={ctx(
          "w-full bg-[#F3F5F6] p-3  cursor-pointer flex gap-2 items-center justify-between",
          {
            "rounded-t-md": isExpand,
            "rounded-md": !isExpand,
          }
        )}
        onClick={() => {
          if (isExpand) {
            dispatch(selectSubTopics(-1));
          } else {
            dispatch(selectSubTopics(subTopic.id));
          }
        }}
      >
        <div className="flex flex-1 overflow-hidden gap-2 items-center">
          <div
            style={{
              backgroundColor: color,
            }}
            className="p-1 w-fit h-fit flex items-center justify-center rounded-md"
          >
            <Image
              src={subTopic.icon}
              width={24}
              height={24}
              alt={subTopic.name}
            />
          </div>
          <h4 className="text-xs flex-1 truncate overflow-hidden font-medium">
            {subTopic.name}
          </h4>
        </div>
        <div
          className={clsx("transition-all", {
            "rotate-180": isExpand,
          })}
        >
          <ExpandMore />{" "}
        </div>
      </div>
      {isExpand && <TopicLevelProgress subTopic={subTopic} />}
    </div>
  );
};

const TitleCollapse = React.memo(FN);

export default TitleCollapse;
