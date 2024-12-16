"use client";
import { Grid2 } from "@mui/material";
import React, { Fragment } from "react";
import CompanyFooter from "./company";
import InfoFooter from "./info";
import LegalFooter from "./legal";
import clsx from "clsx";
import SupportFooter from "./support";
import SocialsIcon from "./socials";
import CopyrightNote from "./copyright";
import { usePathname } from "next/navigation";
import { convertPathName } from "@/utils/pathName";
import { useIsMobile } from "@/hooks/useIsMobile";

const FN = () => {
  const pathname = usePathname();
  const path = convertPathName(pathname);
  const isMobile = useIsMobile();
  if (isMobile && path?.includes("/study")) return <></>;

  return (
    <Fragment>
      <div className=" h-fit w-full flex  justify-center bg-[#7c6f5b] ">
        <div
          className={clsx(" py-6 w-full max-w-page px-4 sm:px-6  lg:pt-[50px]")}
        >
          <Grid2 container spacing={2}>
            <Grid2
              size={{
                xs: 12,
                sm: 12,
                md: 3,
                lg: 3,
              }}
            >
              <InfoFooter />
            </Grid2>
            <Grid2
              size={{
                xs: 6,
                sm: 6,
                md: 3,
                lg: 3,
              }}
            >
              <CompanyFooter />
            </Grid2>
            <Grid2
              size={{
                xs: 6,
                sm: 6,
                md: 3,
                lg: 3,
              }}
            >
              <LegalFooter />
            </Grid2>
            <Grid2
              size={{
                xs: 12,
                sm: 12,
                md: 3,
                lg: 3,
              }}
            >
              <SupportFooter />
            </Grid2>
          </Grid2>
        </div>
      </div>
      <div className=" h-fit w-full flex  justify-center bg-[#443c2f]  ">
        <div
          className={clsx(
            "flex w-full items-center flex-col-reverse sm:flex-row sm:justify-between px-4  md:px-6 gap-2  max-w-page py-4 lg:pt-9 "
          )}
        >
          <CopyrightNote />
          <SocialsIcon />
        </div>
      </div>
    </Fragment>
  );
};

const FooterApp = React.memo(FN);
export default FooterApp;
