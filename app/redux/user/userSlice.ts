import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { editUser, getUser,} from "~/components/user";

interface userState{
    userId:string,
    email:string,
    name:string,
    profileImage:string,
    profileDescription:string
    editSuccess: boolean;
    error: string | null;
}

const initialState:userState={
    userId: "",
    email:"",
    name:"",
    profileImage:"",
    profileDescription:"",
    editSuccess: false,
    error: null,
}
export const handleEditUser = createAsyncThunk(
    'user/editUser',
    async ({ file, username, bio }: { file: string | null, username: string, bio: string }) => {
      const success = await editUser(file, username, bio);
      return success;
    }
  );
export const handleUser = createAsyncThunk('user/getUser',async()=>{
    const user = await getUser();
    return user;
});

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
            
    }
});


export const {} = userSlice.actions
export default userSlice.reducer