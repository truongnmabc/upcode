import IconGridTest from "@/components/icon/iconGridTest";
import { TypeParam } from "@/constants";
import { useAppDispatch } from "@/redux/hooks";
import initTestQuestionThunk from "@/redux/repository/game/initData/initPracticeTest";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
type IListTest = {
    parentId: number;
    duration: number;
};
const ItemTestLeft = ({ test, index }: { test: IListTest; index: number }) => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const testId = useSearchParams().get("testId");

    const handleCLick = useCallback(() => {
        dispatch(
            initTestQuestionThunk({
                testId: test.parentId,
                duration: test.duration,
            })
        );

        router.replace(
            `${TypeParam.practiceTest}?type=test&testId=${test.parentId}`
        );
    }, [test.parentId, test.duration, dispatch, router]);

    return (
        <div
            className={clsx(
                "bg-white cursor-pointer p-2 hover:border-primary rounded-md border border-solid w-full flex items-center",
                {
                    "border-primary": testId === test.parentId.toString(),
                }
            )}
            onClick={handleCLick}
        >
            <div className=" bg-primary-16 rounded-md p-[6px] h-full aspect-square flex items-center justify-center">
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
