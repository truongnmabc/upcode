import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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
        updateToListGames: (state, action) => {
            let newGameData: GameState = action.payload.gameState;
            let isExisted = false;
            state.games = state.games.map((game) => {
                if (game.id == newGameData.id) {
                    isExisted = true;
                    return newGameData; //chý ý chỗ này (gán đè luôn)
                }
                return game;
            });
            if (!isExisted) state.games.push(newGameData);
        },
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

export const { updateToListGames } = listGameSlice.actions;
export default listGameSlice.reducer;
