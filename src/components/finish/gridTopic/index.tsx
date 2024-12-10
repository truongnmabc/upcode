import AllowExpand from "@/components/home/gridTopic/allowExpand";
import AllowExpandProvider from "@/components/home/gridTopic/allowExpand/provider";
import React, { useState } from "react";

const GridTopicProgress = () => {
  const [topics] = useState([]);

  return (
    <div className="w-full h-full rounded-md p-4 bg-white">
      {topics.map((item) => (
        <AllowExpandProvider topic={item}>
          <AllowExpand />
        </AllowExpandProvider>
      ))}
    </div>
  );
};

export default GridTopicProgress;
