"use client";

import { handleNavigateStudy } from "@/components/home/gridTopic/item/titleTopic";
import { db } from "@/db/db.model";
import { selectAppInfo } from "@/redux/features/appInfo.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const FN = () => {
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const appInfo = useAppSelector(selectAppInfo);
    const handleNavigate = async () => {
        const topics = await db?.topics.toArray();
        if (topics)
            return handleNavigateStudy({
                appShortName: appInfo.appShortName,
                dispatch,
                router,
                topic: topics[0],
            });
    };
    if (pathname?.includes("/review")) {
        return (
            <div
                onClick={handleNavigate}
                className="hidden sm:flex item-center hover:text-primary  capitalize gap-3"
            >
                <div className="w-fit cursor-pointer h-fit">
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M21.6602 10.44L20.6802 14.62C19.8402 18.23 18.1802 19.69 15.0602 19.39C14.5602 19.35 14.0202 19.26 13.4402 19.12L11.7602 18.72C7.59018 17.73 6.30018 15.67 7.28018 11.49L8.26018 7.30001C8.46018 6.45001 8.70018 5.71001 9.00018 5.10001C10.1702 2.68001 12.1602 2.03001 15.5002 2.82001L17.1702 3.21001C21.3602 4.19001 22.6402 6.26001 21.6602 10.44Z"
                            stroke="#212121"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M15.0603 19.3901C14.4403 19.8101 13.6603 20.1601 12.7103 20.4701L11.1303 20.9901C7.16034 22.2701 5.07034 21.2001 3.78034 17.2301L2.50034 13.2801C1.22034 9.3101 2.28034 7.2101 6.25034 5.9301L7.83034 5.4101C8.24034 5.2801 8.63034 5.1701 9.00034 5.1001C8.70034 5.7101 8.46034 6.4501 8.26034 7.3001L7.28034 11.4901C6.30034 15.6701 7.59034 17.7301 11.7603 18.7201L13.4403 19.1201C14.0203 19.2601 14.5603 19.3501 15.0603 19.3901Z"
                            stroke="#212121"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M12.6406 8.52979L17.4906 9.75979"
                            stroke="#212121"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M11.6602 12.3999L14.5602 13.1399"
                            stroke="#212121"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                <div
                    className={clsx(
                        "text-base font-normal cursor-pointer text-[var(--text-color)] hover:text-primary"
                    )}
                >
                    Topics
                </div>
            </div>
        );
    }
    return null;
};

const IconTopics = React.memo(FN);

export default IconTopics;
