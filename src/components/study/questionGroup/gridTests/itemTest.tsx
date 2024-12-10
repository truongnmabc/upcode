import IconGridTest from "@/components/icon/iconGridTest";
import { ITest } from "@/models/tests/tests";
import { appInfoState } from "@/redux/features/appInfo";
import { useAppSelector } from "@/redux/hooks";
import { revertPathName } from "@/utils/pathName";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";

const ItemTestLeft = ({ test, index }: { test: ITest; index: number }) => {
  const router = useRouter();
  const { appInfo } = useAppSelector(appInfoState);

  const testId = useSearchParams().get("testId");
  const handleCLick = () => {
    const _href = revertPathName({
      href: `study/practice-test?type=test&testId=${test.id}`,

      appName: appInfo.appShortName,
    });

    router.replace(_href);
  };
  return (
    <div
      className={clsx(
        "bg-white cursor-pointer hover:border-[#4797B1] rounded-md border border-solid w-full flex items-center",
        {
          "border-[#4797B1]": testId === String(test.id),
        }
      )}
      onClick={handleCLick}
    >
      <div className="bg-[#4797B1] rounded-l-md p-2 w-11 h-11 flex items-center justify-center">
        <IconGridTest />
      </div>
      <h3 className={clsx("text-xs  pl-3  pr-2 flex-1 truncate font-medium")}>
        Practice Tests {index + 1}
      </h3>
    </div>
  );
};

export default ItemTestLeft;
