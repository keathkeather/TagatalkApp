import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCourseTree } from "~/components/courseTree";

interface Lesson {
    id: string;
    lessonNumber: number;
    lessonName: string;
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
    course: []
}

export const handleCourseTree = createAsyncThunk('courseTree/getCourseTree', async (gameSkill: string) => {
    const courseTree = await getCourseTree(gameSkill);
    return courseTree;
});

const courseTreeSlice = createSlice({
    name: "courseTreeState",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(handleCourseTree.fulfilled, (state, action) => {
                console.log('Fulfilled Action Payload:', action.payload); // Log the payload
                if (action.payload) {
                    state.course = action.payload.course;
                }
            })
            .addCase(handleCourseTree.rejected, (state, action) => {
                console.log('Rejected Action:', action); // Log if action is rejected
            });
    }
});

export const {} = courseTreeSlice.actions;
export default courseTreeSlice.reducer;