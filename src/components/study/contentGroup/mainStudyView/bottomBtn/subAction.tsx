"use client";
import IconBookmark from "@/components/icon/iconBookmark";
import IconDislike from "@/components/icon/iconDislike";
import IconLike from "@/components/icon/iconLike";

import Sheet from "@/components/sheet";
import { useIsMobile } from "@/hooks/useIsMobile";
import { gameState } from "@/redux/features/game";
import { userState } from "@/redux/features/user";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import useActionsThunk from "@/redux/repository/user/actions";
import { Dialog } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ReportMistake from "./reportMistake";
const SubAction = () => {
    const { currentGame, idTopic } = useAppSelector(gameState);
    const { listActions } = useAppSelector(userState);
    const [openModal, setOpenModal] = useState(false);
    const isMobile = useIsMobile();
    const dispatch = useAppDispatch();
    const [status, setStatus] = useState({
        like: false,
        dislike: false,
        save: false,
    });

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

    const saveAction = () => {
        if (!status.save) {
            toast.success(" Added To Saved List!");
        } else {
            toast.info(" Removed From Saved List!");
        }
        dispatch(
            useActionsThunk({
                status: "save",
                questionId: currentGame.id,
                partId: currentGame.parentId,
            })
        );
    };

    const likeAction = () => {
        if (!status.like) {
            toast.success("You find this question useful!");
        }
        dispatch(
            useActionsThunk({
                status: "like",
                questionId: currentGame.id,
                partId: currentGame.parentId,
            })
        );
    };

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
            {isMobile ? (
                <Sheet
                    visible={openModal}
                    onClose={() => {
                        setOpenModal(false);
                    }}
                    className="custom-sheet-handler"
                >
                    <ReportMistake
                        onClose={() => {
                            setOpenModal(false);
                        }}
                    />
                </Sheet>
            ) : (
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
            )}
        </div>
    );
};

export default React.memo(SubAction);
