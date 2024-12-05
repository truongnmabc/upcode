import { MtUiButton } from "@/components/button";
import React from "react";

const FN = () => {
  return (
    <MtUiButton block type="primary">
      FinalTestBtn
    </MtUiButton>
  );
};
const FinalTestBtn = React.memo(FN);
export default FinalTestBtn;
