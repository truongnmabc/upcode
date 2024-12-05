"use client";

import LazyLoadImage from "@/components/images";
import { appInfoState } from "@/lib/redux/features/appInfo";
import { useAppSelector } from "@/lib/redux/hooks";
import { getContactApp } from "@/utils/getContact";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { sendEmailSubscribe } from "@/lib/services/home.service";

const FN = () => {
  const [formData, setFormData] = useState({ email: "", message: "" });
  const [errors, setErrors] = useState({ email: "", message: "" });
  const { appInfo } = useAppSelector(appInfoState);
  const { email } = getContactApp(appInfo.appShortName);

  const [isPending, setIsPending] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear errors when the user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors: typeof errors = { email: "", message: "" };
    let isValid = true;

    // Validate email
    if (!formData.email) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email.";
      isValid = false;
    }

    // Validate message
    if (!formData.message) {
      newErrors.message = "Message is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (validate()) {
        setIsPending(true);
        await sendEmailSubscribe({
          email: formData.email.trim(),
          message: formData.message.trim(),
          appName: appInfo.appName,
        });
        setIsPending(false);
        setFormData({ email: "", message: "" });
      }
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error);
    }
  };

  const router = useRouter();

  return (
    <div className="flex flex-col gap-2 w-full">
      <p className="uppercase text-white text-base font-semibold pb-2">
        support
      </p>
      <div className="flex flex-col gap-2">
        {email && (
          <div
            className="flex gap-2 items-center cursor-pointer"
            onClick={() => {
              router.push(`mailto:${email}`);
            }}
          >
            <LazyLoadImage
              src="/images/contacts/sms.png"
              classNames="w-6 h-6"
              alt="support-mail"
              priority={false}
            />

            <div className="text-sm text-white font-medium">{email}</div>
          </div>
        )}

        <div
          className="flex gap-2 items-center cursor-pointer"
          onClick={() => {
            router.push("/");
          }}
        >
          <LazyLoadImage
            src="/images/contacts/location.png"
            classNames="w-6 h-6"
            alt="support-mail"
            priority={false}
          />
          <div className="text-sm text-white font-medium">
            209 S Rosemont Ave, Dallas, TX 75208
          </div>
        </div>

        <div className="text-white text-sm font-semibold">
          Any questions, comments or feedback? We’re here to help!
        </div>

        <FormControl
          component="form"
          autoComplete="off"
          fullWidth
          onSubmit={handleSubmit}
        >
          <TextField
            id="email"
            name="email"
            variant="outlined"
            type="email"
            margin="dense"
            placeholder="Enter your email"
            fullWidth
            size="small"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            onBlur={() => {
              validate();
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "white",
                  borderRadius: "8px",
                },
                "& input": {
                  color: "white",
                  fontSize: "14px",
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
              },
              "& .MuiFormHelperText-root": {
                color: "red",
              },
            }}
          />

          <TextField
            id="message"
            name="message"
            variant="outlined"
            margin="dense"
            size="small"
            placeholder="Enter your message"
            fullWidth
            onBlur={() => {
              validate();
            }}
            value={formData.message}
            onChange={handleChange}
            error={!!errors.message}
            helperText={errors.message}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "white",
                  borderRadius: "8px",
                },
                "& input": {
                  fontSize: "14px",
                  color: "white",
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
              },
              "& .MuiFormHelperText-root": {
                color: "red",
              },
            }}
          />

          <div className="flex justify-end mt-2 items-center w-full">
            <Button
              type="submit"
              variant="contained"
              sx={{
                color: "black",
                backgroundColor: "white",
                textTransform: "capitalize",
                borderRadius: "8px",
                borderColor: "white",
                "&:hover": {
                  borderColor: "white",
                  backgroundColor: "white",
                },
                "&.Mui-disabled": {
                  borderColor: "white",
                  color: "white",
                },
              }}
            >
              {isPending ? "Sending..." : "Send"}
            </Button>
          </div>
        </FormControl>
      </div>
    </div>
  );
};

const SupportFooter = React.memo(FN);
export default SupportFooter;
