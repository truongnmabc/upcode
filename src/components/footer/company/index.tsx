import React from "react";
import { TitleDesFooter } from "../titleDesFooter";
import RouterApp from "@/common/router/router.constant";

const FN = () => {
  return (
    <div className="flex flex-col gap-2 w-full  ">
      <p className=" uppercase text-white text-base font-semibold pb-2">
        Company
      </p>

      <TitleDesFooter title="About Us" link={RouterApp.About} />

      <TitleDesFooter title="Contact Us" link={RouterApp.Contacts} />
    </div>
  );
};
const CompanyFooter = React.memo(FN);
export default CompanyFooter;
