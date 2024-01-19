import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { GameState } from "./game";
import { REHYDRATE } from "redux-persist";

export class ListGamesState {
    games: GameState[];
    constructor(props?: any) {
        this.games = new Array();
        if (props && props.games) {
            for (let i = 0; i < props.games.length; i++) {
                const element = props.games[i];
                let xxx = GameState.cloneGameState(element);
                this.games.push(xxx);
            }
        }
    }
    static init() {
        return new ListGamesState();
    }
}

export const listGameSlice = createSlice({
    name: "listGame",
    initialState: ListGamesState.init(),
    reducers: {
        updateToListGames: (state, action: PayloadAction<GameState>) => {
            let newGameData: GameState = action.payload;
            state = updateToState(state, newGameData);
        },
        // case Types.ON_CHOOSE_ANSWER_SUCCESS:
        //     newGameData = action.gameState;
        //     state = updateToState(state, newGameData);
        //     return { ...state };
        // case Types.ON_GAME_SUBMITTED_SUCCESS:
        //     newGameData = action.gameState;
        //     state = updateToState(state, newGameData);
        //     return { ...state };
        // case Types.ON_RESTART_GAME_SUCCESS:
        //     newGameData = action.gameState;
        //     state = updateToState(state, newGameData);
        //     return { ...state };
        // case Types.NEXT_QUESTION_SUCCESS:
        //     newGameData = action.gameState;
        //     state = updateToState(state, newGameData);
        //     return { ...state };
        // case Types.START_NEW_STUDY:
        //     newGameData = action.gameState;
        //     state = updateToState(state, newGameData);
        //     return { ...state };
    },
    extraReducers: (builder) => {
        //TODO
        builder.addCase(REHYDRATE, (state, action) => {
            if (action["payload"]) {
                let localList = action["payload"]["listGameState"];
                return new ListGamesState(localList);
            }
            return state;
        });
    },
});

const updateToState = (_state: ListGamesState, newGameData: GameState) => {
    let isExisted = false;
    _state.games = _state.games.map((game) => {
        if (game.id == newGameData.id) {
            isExisted = true;
            return newGameData; //chý ý chỗ này (gán đè luôn)
        }
        return game;
    });
    if (!isExisted) _state.games.push(newGameData);
    return _state;
};

export const { updateToListGames } = listGameSlice.actions;
export default listGameSlice.reducer;
