"use client";
import LazyLoadImage from "@/components/images";
import { useIsMobile } from "@/hooks/useIsMobile";
import React, { Fragment } from "react";

const FN = () => {
  const isMobile = useIsMobile();
  return (
    <Fragment>
      {!isMobile && (
        <LazyLoadImage
          src="/images/keyboard.png"
          alt="keyboard"
          priority={false}
          classNames="border border-solid w-fit h-fit rounded-md p-3"
          styles={{
            boxShadow: "0px 0px 10px 0px #21212129",
          }}
        />
      )}
    </Fragment>
  );
};
const Keyboard = React.memo(FN);
export default Keyboard;
