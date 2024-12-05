import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import React from "react";

const FN = ({ statusChoice }: { statusChoice: "miss" | "pass" | "other" }) => {
  let _sx = { width: "20px", height: "20px" };
  switch (statusChoice) {
    case "miss":
      return <CancelRoundedIcon htmlColor="#fb7072" sx={_sx} />; // chọn sai
    case "pass":
      return <CheckCircleRoundedIcon htmlColor="#00c17c" sx={_sx} />; // chọn đúng hoặc đáp án đúng
    default:
      return <RadioButtonUncheckedRoundedIcon htmlColor="#AEAEB2" sx={_sx} />;
  }
};
const GetIconPrefix = React.memo(FN);
export default GetIconPrefix;
