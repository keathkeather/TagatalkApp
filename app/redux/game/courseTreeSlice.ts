import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCourseTree } from "~/components/courseTree";
interface course{
    gameUnit: string,
    gameUnitNumber: number,
    gameLessonNumber: number,
    gameLesson: string,
    isCompleted: boolean
}
interface courseTreeState {
    course: course[]
}

const initialState: courseTreeState = {
    course: []
}

export const handleCourseTree = createAsyncThunk('courseTree/getCourseTree', async (gameSkill: string) => {
    const courseTree = await getCourseTree(gameSkill);
    return courseTree;
});

const courseTreeSlice = createSlice({
    name:"courseTreeState",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
            .addCase(handleCourseTree.fulfilled, (state,action)=>{
                state.course = action.payload?.course??[];
            }) 
            
    }
});

export const {} = courseTreeSlice.actions
export default courseTreeSlice.reducer
