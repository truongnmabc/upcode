import IconBookmark from "@/components/icon/iconBookmark";
import IconDislike from "@/components/icon/iconDislike";
import IconLike from "@/components/icon/iconLike";
import { gameState } from "@/redux/features/game";
import { userState } from "@/redux/features/user";
import { useAppSelector } from "@/redux/hooks";
import { Dialog } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import ReportMistake from "./reportMistake";

const SubAction = () => {
    // const { currentGame } = useAppSelector(gameState);
    // const { listActions } = useAppSelector(userState);
    const [openModal, setOpenModal] = useState(false);

    const [status, setStatus] = useState({
        like: false,
        dislike: false,
        save: true,
    });

    // useEffect(() => {
    //     if (currentGame.id) {
    //         const question = listActions.find(
    //             (item) => item.questionId === currentGame.id
    //         );
    //         if (question) {
    //             console.log("🚀 ~ useEffect ~ question:", question);
    //             setStatus({
    //                 like: question.isLike,
    //                 dislike: question.isDisLike,
    //                 save: question.isSave,
    //             });
    //         } else {
    //             setStatus({
    //                 like: false,
    //                 dislike: false,
    //                 save: false,
    //             });
    //         }
    //     }
    // }, [currentGame, listActions]);

    const saveAction = useCallback(() => {
        // dispatch(
        //     useActionsThunk({
        //         status: "save",
        //         questionId: currentGame.id,
        //     })
        // );
    }, []);

    const likeAction = useCallback(() => {
        // dispatch(
        //     useActionsThunk({
        //         status: "like",
        //         questionId: currentGame.id,
        //     })
        // );
    }, []);

    const dislikeAction = () => setOpenModal(true);

    return (
        <div className="flex items-center gap-4">
            <div className="cursor-pointer" onClick={likeAction}>
                <IconLike
                    color={status.like ? "var(--color-primary)" : "#7C6F5B"}
                />
            </div>
            <div className="cursor-pointer" onClick={dislikeAction}>
                <IconDislike
                    color={status.dislike ? "var(--color-primary)" : "#7C6F5B"}
                />
            </div>
            <div className="cursor-pointer" onClick={saveAction}>
                <IconBookmark
                    color={status.save ? "var(--color-primary)" : "#7C6F5B"}
                />
            </div>

            <Dialog
                open={openModal}
                onClose={() => {
                    setOpenModal(false);
                }}
            >
                <ReportMistake
                    onClose={() => {
                        setOpenModal(false);
                    }}
                />
            </Dialog>
        </div>
    );
};

export default React.memo(SubAction);
