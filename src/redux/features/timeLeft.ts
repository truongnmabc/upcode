import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { GameState } from "./game";
import Config from "@/config";

export interface ITimeTestItem {
    id: string; //id cua bai hoc
    timeTest: number; // thoi gian
}
export interface ITimeTestState {
    loading: boolean;
    data: { [id: string]: ITimeTestItem };
    list: ITimeTestItem[];
    error: any;
}

export const timeTestSlice = createSlice({
    name: "timeTest",
    initialState: { loading: false, data: {}, list: [], error: null },
    reducers: {
        setTimeTest: (state, action) => {
            if (action.payload.timeTest && action.payload.id) {
                state = updateDataToState(action.payload.timeTest, action.payload.id, state);
            }
        },
        setTimeTestForRestoreGame: (state, action: PayloadAction<GameState>) => {
            let gameRestoredData: GameState = action.payload;
            if (gameRestoredData.gameType == Config.TEST_GAME) {
                state = updateDataToState(gameRestoredData.timeTest, gameRestoredData.id, state);
            }
        },
        setTimeTestForStartNewGame: (state, action: PayloadAction<GameState>) => {
            let { gameType, id, defaultTimeTest } = action.payload;
            let _id = JSON.stringify(id);
            if (gameType == Config.TEST_GAME) {
                state = updateDataToState(defaultTimeTest, _id, state);
            }
        },
        // case Types.ON_RESTART_GAME_SUCCESS: // update vào đây vì trong này được dùng để làm biến countdown
        //     let gameRestartedData: GameState = action.gameState;
        //     if (gameRestartedData.gameType == Config.TEST_GAME) {
        //         state = updateDataToState(
        //             gameRestartedData.timeTest, //reset lại thời gian khi restart lại bài học
        //             gameRestartedData.id,
        //             state
        //         );
        //     }
    },
});

const updateDataToState = (timeTest: number, id: string, state: ITimeTestState) => {
    if (!!state.data[id]) {
        // neu da ton tai data ve phan test nay thi upadte lai gia tri
        state.data[id].timeTest = timeTest;
    } else {
        // neu chua co thi bo sung vao
        state.data[id] = { id: id, timeTest: timeTest };
    }
    let isExisted = false;
    state.list = state.list.map((item) => {
        if (item.id == id) {
            isExisted = true;
            return { ...item, timeTest: timeTest };
        }
        return item;
    });
    if (!isExisted) {
        state.list.push({ id: id, timeTest: timeTest });
    }
    return state;
};

export const { setTimeTest, setTimeTestForRestoreGame, setTimeTestForStartNewGame } = timeTestSlice.actions;
export default timeTestSlice.reducer;
