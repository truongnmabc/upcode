import { MtUiButton } from "@/components/button";
import Sheet from "@/components/sheet";
import clsx from "clsx";
import React, { useCallback, useState } from "react";

const list = [10, 20, 30, 40, 50, 60];
const SheetSelectQuestions = () => {
    const [value, setValue] = useState(40);
    const handleSelect = useCallback((value: number) => {
        setValue(value);
    }, []);
    return (
        <Sheet visible autoHeight>
            <div className="px-6 pb-6 flex flex-col gap-6">
                <p className="text-center text-xl px-6 font-semibold">
                    How many questions do you want?
                </p>
                <div className="w-full flex items-center justify-between">
                    {list.map((item) => (
                        <div
                            className={clsx(
                                " rounded-full w-10 text-sm h-10  flex items-center justify-center ",
                                {
                                    "bg-primary text-white": item === value,
                                    "bg-[#21212114]": item !== value,
                                }
                            )}
                            key={item}
                            onClick={() => handleSelect(item)}
                        >
                            {item}
                        </div>
                    ))}
                </div>
                <div className="w-full flex items-center gap-4">
                    <MtUiButton size="large" block>
                        Cancel
                    </MtUiButton>
                    <MtUiButton size="large" block type="primary">
                        Start
                    </MtUiButton>
                </div>
            </div>
        </Sheet>
    );
};

export default SheetSelectQuestions;
