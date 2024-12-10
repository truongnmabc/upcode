"use client";
import { useMediaQuery } from "@mui/material";

export const useIsMobile = () => {
  return useMediaQuery("(max-width:768px)");
};
