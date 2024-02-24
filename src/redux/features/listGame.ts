import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { GameState } from "./game";
import { REHYDRATE } from "redux-persist";

export const listGameSlice = createSlice({
    name: "listGame",
    initialState: { games: new Array<GameState>() },
    reducers: {
        updateToListGames: (state, action: PayloadAction<GameState>) => {
            let newGameData: GameState = action.payload;
            state.games = updateToState(state.games, newGameData);
        },
    },
    extraReducers: (builder) => {
        //TODO
        builder.addCase(REHYDRATE, (state, action) => {
            if (action["payload"]) {
                let localList = action["payload"]["listGameReducer"];
                if (localList && localList.games) {
                    for (let i = 0; i < localList.games.length; i++) {
                        const element = localList.games[i];
                        let game = GameState.cloneGameState(element);
                        if (!!game.levelTag) game.unlock = true;
                        state.games.push(game);
                    }
                }
            }
        });
    },
});

const updateToState = (games: GameState[], newGameData: GameState) => {
    let isExisted = false;
    let _games = [...games];
    _games = _games.map((game) => {
        if (game.id == newGameData.id) {
            isExisted = true;
            return newGameData; //chý ý chỗ này (gán đè luôn)
        }
        return game;
    });
    if (!isExisted) _games.push(newGameData);
    return _games;
};

export const { updateToListGames } = listGameSlice.actions;
export default listGameSlice.reducer;
