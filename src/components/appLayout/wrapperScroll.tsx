"use client";

import { SessionProvider } from "next-auth/react";
import React, { Fragment, useLayoutEffect, useRef, useState } from "react";
import ScrollToTopArrow from "../scrollTop";

const WrapperScroll = ({ children }: { children: React.ReactNode }) => {
    const [isScrollRef, setIsShowRef] = useState(false);
    const scrollRef = useRef<HTMLDivElement | null>(null);

    return (
        <Fragment>
            <SessionProvider>
                <div
                    id="pageScroll"
                    className="w-screen h-screen flex flex-col justify-between relative overflow-auto"
                    onScroll={(e: React.UIEvent<HTMLDivElement, UIEvent>) => {
                        const { scrollTop } = e.target as HTMLElement;

                        if (scrollTop > 300 && !isScrollRef) {
                            setIsShowRef(true);
                        }
                        if (scrollTop < 300 && isScrollRef) {
                            setIsShowRef(false);
                        }
                    }}
                    ref={scrollRef}
                >
                    {children}
                    {isScrollRef && <ScrollToTopArrow scrollRef={scrollRef} />}
                </div>
            </SessionProvider>
            <InitGg />
        </Fragment>
    );
};
export default React.memo(WrapperScroll);

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_ID;
const InitGg = () => {
    async function handleCredentialResponse(response: CredentialResponse) {
        // console.log("🚀 ~ handleCredentialResponse ~ response:", response);
        // let accountInfo = jwt.decode(response.credential);
        // let email = accountInfo.email.toLowerCase();
        // let avatar = accountInfo.picture;
        // let name = accountInfo.name;
        // try {
        //     if (submitSuccessFc) {
        //         submitSuccessFc();
        //     }
        //     ga.event({ action: "login_success_google", params: {} });
        //     dispatch(
        //         loginSuccess({
        //             userInfo: new UserInfo({ email, id: email, avatar, name }),
        //         })
        //     );
        // } catch (error) {}
    }

    useLayoutEffect(() => {
        if (typeof window !== "undefined" && window?.google) {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: (res: any) => handleCredentialResponse(res),
                cancel_on_tap_outside: false,
            });
            console.log("🚀 ~ InitGg ~ window.google", window.google);
            // window.gapi.accounts.auth2.init({
            //     client_id: GOOGLE_CLIENT_ID,
            //     scope: "profile",
            // });
        }
    }, []);
    return <></>;
};
