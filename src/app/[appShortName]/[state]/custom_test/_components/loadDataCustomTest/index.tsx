"use client";
import { selectCurrentTopicId } from "@/redux/features/game.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import initCustomTestThunk from "@/redux/repository/game/initData/initCustomTest";
import { useEffect } from "react";

const LoadData = () => {
    const idTopics = useAppSelector(selectCurrentTopicId);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (!idTopics || idTopics === -1) {
            dispatch(initCustomTestThunk());
        }
    }, [idTopics, dispatch]);
    return null;
};

export default LoadData;
