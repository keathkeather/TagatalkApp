import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getGame } from "~/components/game";

interface Game {
    gameId: string;
    gameType: string; // 'Type 1', 'Type 2', 'Type 3'
    gameValue: number; // score
    gameSkill: string; // 'reading', 'writing', 'listening', 'speaking'
    gameUnit: string; // Unit Description
    gameUnitNumber: number; // Unit Number
    gameLessonNumber: number; // Lesson Number
    gameLesson: string; // Lesson Title
}

interface GameState {
    games: Game[];
    loading: boolean;
    error: string | null;
}

const initialState: GameState = {
    games: [],
    loading: false,
    error: null,
};

export const handleGame = createAsyncThunk('game/getGame', async (gameLessonNumber: number, { rejectWithValue }) => {
    try {
        const game = await getGame(gameLessonNumber);
        return game;
    } catch (error) {
        return rejectWithValue(error);
    }
});

const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(handleGame.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(handleGame.fulfilled, (state, action) => {
                state.games = action.payload?.game ?? [];
                state.loading = false;
            })
            .addCase(handleGame.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || action.error.message || 'Something went wrong';
            });
    }
});


export const {} = gameSlice.actions
export default gameSlice.reducer