import { appInfoState } from "@/redux/features/appInfo";
import { useAppSelector } from "@/redux/hooks";
import { revertPathName } from "@/utils/pathName";
import { Grid2 } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import { IPropsItemTest } from "../type";

const ItemGridTest: React.FC<IPropsItemTest> = ({ item }) => {
  const router = useRouter();

  const { appInfo } = useAppSelector(appInfoState);

  const handleClick = useCallback(() => {
    if (item.id === "CT") {
      const _href = revertPathName({
        href: "custom_test",
        appName: appInfo.appShortName,
      });
      router.push(_href);
      return;
    }

    if (item.id === "FT") {
      const _href = revertPathName({
        href: `/final_test/full-length-${appInfo?.appShortName}-practice-test`,
        appName: appInfo.appShortName,
      });
      router.push(_href);
      return;
    }

    const _href = revertPathName({
      href: `/study/${item.name}?type=test`,
      appName: appInfo.appShortName,
    });
    router.push(_href);
  }, [appInfo.appShortName]);

  return (
    <Grid2
      size={{
        xs: 12,
        sm: 6,
        md: 6,
        lg: 3,
      }}
    >
      <div
        className="flex border cursor-pointer w-full h-fit rounded-md"
        onMouseOver={(e) => {
          e.currentTarget.style.borderColor = item?.color || "";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "";
        }}
        onClick={handleClick}
      >
        <div
          style={{
            backgroundColor: item.color,
          }}
          className="p-5 rounded-bl-md flex item-center justify-center rounded-tl-md"
        >
          {item.icon}
        </div>
        <h3 className="pl-4 flex-1 text-base flex items-center justify-start font-medium ">
          {item.name}
        </h3>
      </div>
    </Grid2>
  );
};

export default ItemGridTest;
