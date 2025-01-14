// import { createAsyncThunk } from "@reduxjs/toolkit";
// import { ICurrentGame } from "@/models/game/game";
// import { RootState } from "@/redux/store";
// import { db } from "@/db/db.model";
// import { IQuestion } from "@/models/question/questions";

// type IRes = {
//     nextLever: ICurrentGame;
//     listQuestion: ICurrentGame[];
//     isFirst: boolean;
//     indexCurrentQuestion: number;
// };

// const updateDb = async (idTopic: number, listQuestion: ICurrentGame[]) => {
//     await db?.testQuestions
//         .where("parentId")
//         .equals(idTopic)
//         .filter((item) => item.status === 0)
//         .modify((item) => {
//             item.question = listQuestion as IQuestion[];
//         });
// };
// const nextQuestionDiagnosticThunk = createAsyncThunk(
//     "nextQuestionDiagnostic",
//     async (_, thunkAPI): Promise<IRes | undefined> => {
//         const state = thunkAPI.getState() as RootState;
//         const {
//             listQuestion,
//             indexCurrentQuestion,
//             currentGame,
//             belowFifty,
//             aboveFifty,
//             idTopic,
//         } = state.gameReducer;

//         let nextQuestion;
//         const updatedList: ICurrentGame[] = [...listQuestion];

//         if ((indexCurrentQuestion + 1) % 3 === 0) {
//             return {
//                 listQuestion: listQuestion,
//                 nextLever: {
//                     ...listQuestion[indexCurrentQuestion + 1],
//                     tag: listQuestion[indexCurrentQuestion + 1]?.tag,
//                 },
//                 isFirst: false,
//                 indexCurrentQuestion: indexCurrentQuestion + 1,
//             };
//         }
//         if (currentGame.selectedAnswer?.correct && currentGame?.tag) {
//             const listQuestionAbove = aboveFifty[currentGame.tag];
//             if (listQuestionAbove && listQuestionAbove.length > 0) {
//                 nextQuestion =
//                     indexCurrentQuestion % 2 === 0
//                         ? listQuestionAbove[0]
//                         : listQuestionAbove[1];
//             }
//         } else if (currentGame?.tag) {
//             // Use belowFifty if the current answer is incorrect
//             const nextQuestionsBelow = belowFifty[currentGame.tag];
//             if (nextQuestionsBelow && nextQuestionsBelow.length > 0) {
//                 nextQuestion =
//                     indexCurrentQuestion % 2 === 0
//                         ? nextQuestionsBelow[0]
//                         : nextQuestionsBelow[1];
//             }
//         }
//         if (nextQuestion) {
//             updatedList[indexCurrentQuestion + 1] = nextQuestion;
//             updateDb(idTopic, updatedList);
//             return {
//                 listQuestion: updatedList,
//                 nextLever: {
//                     ...nextQuestion,
//                     tag: listQuestion[indexCurrentQuestion + 1]?.tag,
//                 },
//                 isFirst: false,
//                 indexCurrentQuestion: indexCurrentQuestion + 1,
//             };
//         }

//         return undefined;
//     }
// );

// export default nextQuestionDiagnosticThunk;

import { createAsyncThunk } from "@reduxjs/toolkit";
import { ICurrentGame } from "@/models/game/game";
import { RootState } from "@/redux/store";
// import { db } from "@/db/db.model";
// import { IQuestion } from "@/models/question/questions";

type IRes = {
    nextLever: ICurrentGame;
    listQuestion: ICurrentGame[];
    isFirst: boolean;
    indexCurrentQuestion: number;
};

// const updateDb = async (idTopic: number, listQuestion: ICurrentGame[]) => {
//     await db?.testQuestions
//         .where("parentId")
//         .equals(idTopic)
//         .filter((item) => item.status === 0)
//         .modify((item) => {
//             item.question = listQuestion as IQuestion[];
//         });
// };
const nextQuestionDiagnosticThunk = createAsyncThunk(
    "nextQuestionDiagnostic",
    async (_, thunkAPI): Promise<IRes | undefined> => {
        const state = thunkAPI.getState() as RootState;
        const {
            listQuestion,
            indexCurrentQuestion,
            // currentGame,
            // belowFifty,
            // aboveFifty,
            // idTopic,
        } = state.gameReducer;

        if (indexCurrentQuestion + 1 < listQuestion.length) {
            return {
                nextLever: listQuestion[indexCurrentQuestion + 1],
                isFirst: true,
                indexCurrentQuestion: indexCurrentQuestion + 1,
                listQuestion: listQuestion,
            };
        } else {
            return undefined;
        }
    }
);

export default nextQuestionDiagnosticThunk;
