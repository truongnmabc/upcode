"use client";
import useDebounce from "@/lib/hooks/useDebounce";
import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

const FN = ({
    onEnter,
    onChangeValue,
}: {
    onEnter: () => void;
    onChangeValue: (e: string) => void;
}) => {
    const [email, setEmail] = useState("");

    const value = useDebounce(email, 200);
    useEffect(() => {
        if (value && !validate()) return;
        onChangeValue(value);
    }, [value]);
    const [errors, setErrors] = useState("");

    const validate = () => {
        let newErrors = "";
        let isValid = true;

        // Validate email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors = "Please enter a valid email.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    return (
        <TextField
            placeholder="yourname@gmail.com"
            onChange={(e) => {
                setEmail(e.target.value);
            }}
            onBlur={validate}
            onKeyDown={(e) => {
                if (
                    e.key === "Enter" ||
                    (e.key === "NumpadEnter" && validate())
                ) {
                    onEnter();
                }
            }}
            size="small"
            error={!!errors}
            helperText={errors}
            value={email}
            sx={{
                "& .MuiOutlinedInput-root": {
                    "& input": {
                        fontSize: "14px",
                    },
                    "&:hover fieldset": {
                        borderColor: "var(--text-color-primary)",
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: "var(--text-color-primary)",
                    },
                },
                "& .MuiFormHelperText-root": {
                    color: "red",
                },
            }}
        />
    );
};

const InputEmailAddress = React.memo(FN);

export default InputEmailAddress;
