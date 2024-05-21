import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUser,handleEditProfile} from "~/components/user";

interface userState{
    userId:string,
    email:string,
    name:string,
    profileImage:string,
    profileDescription:string
}

const initialState:userState={
    userId: "",
    email:"",
    name:"",
    profileImage:"",
    profileDescription:""
}

export const handleUser = createAsyncThunk('auth/login',async()=>{
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
            
    }
});


export const {} = userSlice.actions
export default userSlice.reducer