"use client";
import { gameState } from "@/redux/features/game";
import { selectIdTopic } from "@/redux/features/game.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import getListActionThunk from "@/redux/repository/user/getActions";
import React, { useEffect } from "react";

const UserActionListen = () => {
    const idTopic = useAppSelector(selectIdTopic);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (idTopic) {
            dispatch(
                getListActionThunk({
                    partId: idTopic,
                })
            );
        }
    }, [idTopic, dispatch]);

    return <></>;
};

export default UserActionListen;
