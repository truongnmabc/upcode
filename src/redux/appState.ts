import { IAppInfoReducer } from "./features/appInfo";
import { ICardState } from "./features/card";
import { GameState } from "./features/game";
import { ListGamesState } from "./features/listGame";
import { ITestState } from "./features/test";
import { ITimeTestState } from "./features/timeLeft";
import { ITopicState } from "./features/topic";

export interface AppState {
    appInfoReducer: IAppInfoReducer;
    cardReducer: ICardState;
    gameReducer: GameState;
    listGameReducer: ListGamesState;
    testReducer: ITestState;
    timeLeftReducer: ITimeTestState;
    topicReducer: ITopicState;
}
