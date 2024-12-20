import IconGridTest from "@/components/icon/iconGridTest";
import { ITest } from "@/models/tests/tests";
import { appInfoState } from "@/redux/features/appInfo";
import { gameState } from "@/redux/features/game";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import initTestQuestionThunk from "@/redux/repository/game/initTestQuestion";
import { revertPathName } from "@/utils/pathName";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const ItemTestLeft = ({ test, index }: { test: ITest; index: number }) => {
    const router = useRouter();
    const { appInfo } = useAppSelector(appInfoState);
    const dispatch = useAppDispatch();
    const testId = useSearchParams().get("testId");
    const { idTopic } = useAppSelector(gameState);

    const handleCLick = useCallback(() => {
        dispatch(
            initTestQuestionThunk({
                testId: test.id.toString(),
                duration: test.duration,
            })
        );
        const _href = revertPathName({
            href: `study/practice-test?type=test&testId=${test.id}`,
            appName: appInfo.appShortName,
        });

        router.replace(_href);
    }, [test.id, dispatch, appInfo.appShortName, router, idTopic]);
    return (
        <div
            className={clsx(
                "bg-white cursor-pointer hover:border-[#4797B1] rounded-md border border-solid w-full flex items-center",
                {
                    "border-[#4797B1]": testId === test.id.toString(),
                }
            )}
            onClick={handleCLick}
        >
            <div className="bg-[#4797B1] rounded-l-md p-2 w-11 h-11 flex items-center justify-center">
                <IconGridTest />
            </div>
            <h3
                className={clsx(
                    "text-xs  pl-3  pr-2 flex-1 truncate font-medium"
                )}
            >
                Practice Tests {index + 1}
            </h3>
        </div>
    );
};

export default ItemTestLeft;
