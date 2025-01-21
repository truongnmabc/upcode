"use client";

import IconBack from "@/components/icon/iconBack";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { Fragment } from "react";
import { getKeyTest, getLastPathSegment } from "../titleQuestion";
import {
    selectIndexSubTopic,
    selectType,
} from "@/redux/features/game.reselect";
import { shouldOpenSubmitTest } from "@/redux/features/tests";

const HeaderStudy = () => {
    const indexSubTopic = useAppSelector(selectIndexSubTopic);
    const type = useAppSelector(selectType);
    const param = useParams();
    const pathname = usePathname();
    const router = useRouter();
    const defaultTitle =
        getKeyTest(param?.["slug"]) || getLastPathSegment(pathname);

    const dispatch = useAppDispatch();
    const handleSubmit = () => {
        dispatch(shouldOpenSubmitTest(true));
    };
    return (
        <Fragment>
            <div className="flex sm:hidden items-center p-2 justify-between">
                <div
                    onClick={() => {
                        router.back();
                    }}
                    className="cursor-pointer"
                >
                    <IconBack size={20} />
                </div>

                <div className=" text-center flex-1 capitalize text-lg font-medium">
                    {type === "learn" ? `Core ${indexSubTopic}` : defaultTitle}
                </div>
                {type !== "learn" && (
                    <div onClick={handleSubmit}>
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M16.4405 8.8999C20.0405 9.2099 21.5105 11.0599 21.5105 15.1099V15.2399C21.5105 19.7099 19.7205 21.4999 15.2505 21.4999H8.74047C4.27047 21.4999 2.48047 19.7099 2.48047 15.2399V15.1099C2.48047 11.0899 3.93047 9.2399 7.47047 8.9099"
                                stroke="#212121"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M12 15.0001V3.62012"
                                stroke="#212121"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M15.3504 5.85L12.0004 2.5L8.65039 5.85"
                                stroke="#212121"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                )}
            </div>
        </Fragment>
    );
};

export default React.memo(HeaderStudy);
