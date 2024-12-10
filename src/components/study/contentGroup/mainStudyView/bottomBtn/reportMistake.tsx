import { MtUiButton } from "@/components/button";
import { gameState } from "@/redux/features/game";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import useActionsThunk from "@/redux/repository/user/actions";
import {
  Box,
  Checkbox,
  FormControl,
  FormGroup,
  TextField,
} from "@mui/material";
import React, { useState } from "react";

const listReport = [
  { label: "Incorrect Answer", value: "1" },
  { label: "Wrong Explanation", value: "2" },
  { label: "Wrong Category", value: "3" },
  { label: "Grammatical Error", value: "4" },
  { label: "Missing Content", value: "5" },
  { label: "Type", value: "6" },
  { label: "Bad Image Quality", value: "7" },
];

const ReportMistake = ({ onClose }: { onClose: () => void }) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [otherReason, setOtherReason] = useState<string>("");
  const dispatch = useAppDispatch();
  const { currentGame } = useAppSelector(gameState);

  const handleCheckboxChange = (value: string) => {
    setSelectedValues((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Selected values:", selectedValues);
    console.log("Other reason:", otherReason);

    dispatch(
      useActionsThunk({
        status: "dislike",
        questionId: currentGame.id,
      })
    );
    onClose();
  };

  return (
    <form
      className="h-full py-4 px-6 bg-white w-[600px] rounded-md flex flex-col gap-4"
      onSubmit={handleSubmit}
    >
      <h3 className="font-poppins text-2xl font-semibold text-center">
        Report a Mistake
      </h3>

      <FormControl component="fieldset" fullWidth>
        <FormGroup>
          {listReport.map((item) => (
            <Box
              key={item.value}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <div className="text-lg font-poppins font-medium">
                {item.label}
              </div>
              <Checkbox
                sx={{
                  color: "#7C6F5B",
                }}
                checked={selectedValues.includes(item.value)}
                onChange={() => handleCheckboxChange(item.value)}
              />
            </Box>
          ))}
        </FormGroup>
      </FormControl>

      <TextField
        placeholder="Other reasons"
        value={otherReason}
        onChange={(e) => setOtherReason(e.target.value)}
        sx={{
          "& .MuiInput-underline:before": {
            borderBottomColor: "#21212185",
            borderBottomWidth: "2px",
          },
          "& .MuiInput-underline:hover:before": {
            borderBottomColor: "#7C6F5B",
          },
          "& .MuiInput-underline:after": {
            borderBottomColor: "#7C6F5B",
          },
          "& input": {
            color: "#7C6F5B",
          },
        }}
        fullWidth
        variant="standard"
      />

      <MtUiButton
        block
        type="primary"
        htmlType="submit"
        disabled={selectedValues.length === 0 && !otherReason}
      >
        Report
      </MtUiButton>
    </form>
  );
};

export default ReportMistake;
