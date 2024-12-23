"use client";
import { MtUiButton } from "@/components/button";
import Slider from "@mui/material/Slider";
import React, { useState } from "react";

const ChoiceRangeQuestion = () => {
    const [value, setValue] = useState(0);
    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number);
    };
    return (
        <div
            className="w-full rounded-lg bg-white "
            style={{
                boxShadow: "0px 2px 4px 0px #2121211F",
            }}
        >
            <div className="flex items-center justify-between gap-4 px-6 py-6">
                <p className="text-base font-medium">0</p>
                <Slider
                    defaultValue={30}
                    value={value}
                    valueLabelDisplay="auto"
                    onChange={handleSliderChange}
                    sx={{
                        height: "10px",
                        padding: "8px 0",
                        "& .MuiSlider-track": {
                            backgroundColor: "primary.main",
                            border: "none",
                            height: "10px",
                        },
                        "& .MuiSlider-thumb": {
                            backgroundColor: "white",
                            border: "1px solid var(--color-primary)",
                        },
                        "& .MuiSlider-rail": {
                            backgroundColor: "#ccc",
                            height: "10px",
                        },
                        "& .MuiSlider-valueLabel": {
                            backgroundColor: "red",
                            // MuiSlider-valueLabelLabel
                        },
                    }}
                />
                <p className="text-base font-medium">100</p>
            </div>
            <div className="w-full rounded-b-lg bg-[#7C6F5B0F] px-6 py-4 flex items-center justify-between">
                <p className="text-xl font-semibold">Questions: {value}</p>
                <MtUiButton type="primary" size="large" className="text-white">
                    Practice Now
                </MtUiButton>
            </div>
        </div>
    );
};

export default ChoiceRangeQuestion;
