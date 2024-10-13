import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { WritableDraft } from "immer";
import { getCourseTree } from "~/components/courseTree";

export interface FileAsset {
    assetName: any;
    filename: string;
    assetId: string,
    assetClassifier: string,
    assetType: string,
    isCorrectAnswer: boolean,
    fileUrl: string,
}

export interface TextAsset {
    assetId: string,
    assetClassifier: string,
    assetType: string,
    isCorrectAnswer: boolean,
    textContent: string,
}

export interface GameAsset {
    gameId: string,
    textAssets: TextAsset[],
    fileAssets: FileAsset[],
}

interface Game {
    id: any;
    gameId: string;
    gameType: number; // 'Type 1', 'Type 2', 'Type 3'
    gameValue: number; // score
    gameSkill: string; // 'reading', 'writing', 'listening', 'speaking'
    gameUnit: string; // Unit Description
    gameUnitNumber: number; // Unit Number
    gameLessonNumber: number; // Lesson Number
    gameLesson: string; // Lesson Title
    gameAssets: GameAsset[];
}

interface Lesson {
    id: string;
    lessonNumber: number;
    lessonName: string;
    game: Game[];
}

interface Unit {
    unitName: string;
    unitNumber: number;
    lesson: Lesson[];
}

interface CourseTreeState {
    course: Unit[];
}

const initialState: CourseTreeState = {
    course: [],
};

export const handleCourseTree = createAsyncThunk('courseTree/getCourseTree', async (gameSkill: string) => {
    const courseTree = await getCourseTree(gameSkill);
    return courseTree;
});

// export const handleGameAsset = createAsyncThunk('courseTree/getGameAssets', async (gameId: string) => {
//     const gameAsset = await getGameAssets(gameId);
//     return gameAsset;
// });

// export const handleGame = createAsyncThunk('courseTree/getGame', async (gameLessonNumber: number) => {
//     const game = await getGame(gameLessonNumber);
//     return game;
// });

const courseTreeSlice = createSlice({
    name: "courseTreeState",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(handleCourseTree.fulfilled, (state, action) => {
                console.log('Fulfilled Action Payload:', JSON.stringify(action.payload, null, 2)); // Log the payload (Pretty) like in postman
                // console.log('Fulfilled Action Payload:');
                if (action.payload) {
                    state.course = action.payload.course as unknown as WritableDraft<Unit>[];
                }
            })
            .addCase(handleCourseTree.rejected, (state, action) => {
                console.log('Rejected Action:', action); // Log if action is rejected
            });
    }
});

export const {} = courseTreeSlice.actions;
export default courseTreeSlice.reducer;