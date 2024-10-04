import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { editUser, getUser, getLeaderBoard } from "~/components/user";

interface LeaderboardUser{
    userId: string;
    userProfileImage: string;
    email: string;
    name: string;
    userPoints: number;
    rank: number;
}

interface userState{
    userId:string,
    email:string,
    name:string,
    profileImage:string,
    profileDescription:string
    editSuccess: boolean;
    error: string | null;
    leaderBoard: LeaderboardUser[];
}

const initialState:userState={
    userId: "",
    email:"",
    name:"",
    profileImage:"",
    profileDescription:"",
    editSuccess: false,
    error: null,
    leaderBoard: [],
}

export const handleEditUser = createAsyncThunk(
    'user/editUser',
    async ({ file, username, bio }: { file: string | null, username: string, bio: string }) => {
      const success = await editUser(file, username, bio);
      return success;
    }
  );
export const handleUser = createAsyncThunk(
    'user/getUser',
    async()=>{
        const user = await getUser();
        return user;
    }
);
export const handleLeaderBoard = createAsyncThunk<LeaderboardUser[], void>(
    'user/getLeaderBoard',
    async () => {
        const leaderboard = await getLeaderBoard();
        return (leaderboard ?? []) as LeaderboardUser[];
    }
);

const userSlice = createSlice({
    name:"userState",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
            .addCase(handleUser.fulfilled, (state,action)=>{
                state.userId =  action.payload?.userId??"";
                state.email = action.payload?.email??"";
                state.name = action.payload?.name??"";
                state.profileImage = action.payload?.profileImage??"";
                state.profileDescription = action.payload?.profileDescription??"";
            }) 
            .addCase(handleEditUser.fulfilled, (state, action) => {
                state.editSuccess = true;
                state.error = null;
              })
            .addCase(handleLeaderBoard.fulfilled, (state, action) => {
                state.leaderBoard = action.payload; 
                state.error = null;
            })
            .addCase(handleLeaderBoard.rejected, (state, action) => {
                state.error = action.error.message || "Failed to fetch leaderboard";
            });
    }
});


export const {} = userSlice.actions
export default userSlice.reducer