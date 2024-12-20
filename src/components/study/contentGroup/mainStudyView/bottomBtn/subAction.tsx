import IconBookmark from "@/components/icon/iconBookmark";
import IconDislike from "@/components/icon/iconDislike";
import IconLike from "@/components/icon/iconLike";

import { Dialog } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import ReportMistake from "./reportMistake";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { gameState } from "@/redux/features/game";
import { userState } from "@/redux/features/user";
import useActionsThunk from "@/redux/repository/user/actions";
import getListActionThunk from "@/redux/repository/user/getActions";

const SubAction = () => {
    const { currentGame, idTopic } = useAppSelector(gameState);
    const { listActions } = useAppSelector(userState);
    const [openModal, setOpenModal] = useState(false);
    const dispatch = useAppDispatch();
    const [status, setStatus] = useState({
        like: false,
        dislike: false,
        save: false,
    });

    useEffect(() => {
        if (idTopic) {
            dispatch(
                getListActionThunk({
                    partId: idTopic,
                })
            );
        }
    }, [idTopic]);

    useEffect(() => {
        if (currentGame.id) {
            const question = listActions.find(
                (item) => item.questionId === currentGame.id
            );
            if (question) {
                setStatus({
                    like: question.actions?.includes("like"),
                    dislike: question.actions?.includes("dislike"),
                    save: question.actions?.includes("save"),
                });
            } else {
                setStatus({
                    like: false,
                    dislike: false,
                    save: false,
                });
            }
        }
    }, [currentGame, listActions]);

    const saveAction = useCallback(() => {
        dispatch(
            useActionsThunk({
                status: "save",
                questionId: currentGame.id,
                partId: currentGame.parentId,
            })
        );
    }, [currentGame]);

    const likeAction = useCallback(() => {
        dispatch(
            useActionsThunk({
                status: "like",
                questionId: currentGame.id,
                partId: currentGame.parentId,
            })
        );
    }, [currentGame]);

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
