"use client";
import { useEffect } from "react";
import { API_PATH } from "@/common/constants/api.constants";
import { IAppInfo } from "@/models/app/appInfo";
import { initializeDB } from "@/db/db.model";

const ServiceWorkerInit = ({ appInfo }: { appInfo: IAppInfo }) => {
    useEffect(() => {
        const handleInit = async () => {
            await initializeDB(appInfo.appShortName);

            if ("serviceWorker" in navigator && appInfo.appShortName) {
                navigator.serviceWorker
                    .register("/sw.js")
                    .then((registration) => {
                        if (registration.active) {
                            const messageChannel = new MessageChannel();

                            // Nhận phản hồi từ Service Worker
                            messageChannel.port1.onmessage = (event) => {
                                if (event.data.status === "success") {
                                    console.log(event.data.message);
                                } else {
                                    console.error("Failed to initialize DB.");
                                }
                            };

                            // Gửi thông điệp để khởi tạo IndexedDB và xử lý dữ liệu
                            registration.active.postMessage(
                                {
                                    type: "INIT_DB",
                                    payload: {
                                        appShortName: appInfo.appShortName,
                                        apiPath: API_PATH,
                                    },
                                },
                                [messageChannel.port2]
                            );
                        }
                    })
                    .catch((error) => {
                        console.error(
                            "Service Worker registration failed:",
                            error
                        );
                    });
            }
        };
        handleInit();
    }, [appInfo.appShortName]);

    return null;
};

export default ServiceWorkerInit;
