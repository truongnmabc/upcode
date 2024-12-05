import React, { Fragment } from "react";
import LogoHeader from "./logo/logoHeader";
import MenuHeader from "./menu/menuHeader";
import { Grid2 } from "@mui/material";
import DownLoadApp from "./download/downloadApp";
import clsx from "clsx";

const FN = () => {
  return (
    <Fragment>
      <div className="w-full">
        <DownLoadApp />
        <div
          className={clsx(
            " h-fit w-full flex bg-white dark:bg-black border-b  border-[#e4e4e4] border-solid  justify-center "
          )}
          id="headerRootLayout"
        >
          <div className="px-6 py-2 w-full z-0 h-full max-w-page">
            <Grid2 container>
              <Grid2
                size={{
                  xs: 8,
                  sm: 4,
                  md: 4,
                }}
              >
                <LogoHeader />
              </Grid2>
              <Grid2
                size={{
                  xs: 4,
                  sm: 8,
                  md: 8,
                }}
              >
                <MenuHeader />
              </Grid2>
            </Grid2>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const HeaderApp = React.memo(FN);
export default HeaderApp;
