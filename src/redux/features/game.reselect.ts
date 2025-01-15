import { createSelector } from "reselect";
import { gameState } from "./game";

export const selectCurrentGame = createSelector(
    [gameState],
    (reducer) => reducer.currentGame
);

export const selectListQuestion = createSelector(
    [gameState],
    (reducer) => reducer.listQuestion
);

export const selectIdTopic = createSelector(
    [gameState],
    (reducer) => reducer.idTopic
);

export const selectTurn = createSelector(
    [gameState],
    (reducer) => reducer.turn
);

export const selectIndexCurrentQuestion = createSelector(
    [gameState],
    (reducer) => reducer.indexCurrentQuestion
);

export const selectIndexSubTopic = createSelector(
    [gameState],
    (reducer) => reducer.indexSubTopic
);

export const selectTimeCurrentGame = createSelector(
    [gameState],
    (reducer) => reducer.time
);

export const selectIsPaused = createSelector(
    [gameState],
    (reducer) => reducer.isPaused
);

export const selectType = createSelector(
    [gameState],
    (reducer) => reducer.type
);

export const selectFeedBack = createSelector(
    [gameState],
    (reducer) => reducer.feedBack
);

export const selectSubTopicProgressId = createSelector(
    [gameState],
    (reducer) => reducer.subTopicProgressId
);

export const selectIsFinish = createSelector(
    [gameState],
    (reducer) => reducer.isFinishGame
);

export const selectPassing = createSelector(
    [gameState],
    (reducer) => reducer.passing
);

export const selectRemainTime = createSelector(
    [gameState],
    (reducer) => reducer.remainTime
);

export const selectIsEndTimeTest = createSelector(
    [gameState],
    (reducer) => reducer.isEndTimeTest
);

export const selectListenEventKeyboard = createSelector(
    [gameState],
    (reducer) => reducer.shouldListenEventKeyboard
);
