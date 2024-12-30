import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import RadioButtonCheckedRounded from "@mui/icons-material/RadioButtonCheckedRounded";
import React from "react";

const FN = ({
    statusChoice,
    isActions = false,
    isSelect,
    isReview,
    answerCorrect,
}: {
    isActions?: boolean;
    isSelect?: boolean;
    isReview?: boolean;
    answerCorrect?: boolean;
    statusChoice?: "miss" | "pass" | "other";
}) => {
    const _sx = { width: "20px", height: "20px" };
    if (isActions) {
        if (isSelect) {
            return <RadioButtonCheckedRounded htmlColor="#AEAEB2" sx={_sx} />;
        } else {
            return (
                <RadioButtonUncheckedRoundedIcon htmlColor="#AEAEB2" sx={_sx} />
            );
        }
    }

    if (isReview) {
        if (isSelect && !answerCorrect) {
            return <CancelRoundedIcon htmlColor="#fb7072" sx={_sx} />; // chọn sai
        } else if (answerCorrect) {
            return <CheckCircleRoundedIcon htmlColor="#00c17c" sx={_sx} />; // chọn đúng hoặc đáp án đúng
        } else {
            return (
                <RadioButtonUncheckedRoundedIcon htmlColor="#AEAEB2" sx={_sx} />
            );
        }
    }
    switch (statusChoice) {
        case "miss":
            return <CancelRoundedIcon htmlColor="#fb7072" sx={_sx} />; // chọn sai
        case "pass":
            return <CheckCircleRoundedIcon htmlColor="#00c17c" sx={_sx} />; // chọn đúng hoặc đáp án đúng
        default:
            return (
                <RadioButtonUncheckedRoundedIcon htmlColor="#AEAEB2" sx={_sx} />
            );
    }
};
const GetIconPrefix = React.memo(FN);
export default GetIconPrefix;
