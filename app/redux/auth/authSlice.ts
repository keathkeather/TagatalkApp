import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AnimatableStringValue } from "react-native";
import  { registerFunction, login, logout, checkTokenHealth, sendCode, verifyCode, resetPassword, resendEmail, editUserName }  from "~/components/auth";
interface AuthState {
    token:string
    authenticated:boolean
}
export const loadToken = createAsyncThunk('auth/loadToken', async () => {
    const token = await AsyncStorage.getItem('token');
    const isTokenHealthy = await checkTokenHealth();
    return { token, isAuthenticated: token && isTokenHealthy };
  });
  
export const handleLogin = createAsyncThunk('auth/login', async ({ email, password }: { email: string, password: string }) => {
    await login(email, password);
    const token = await AsyncStorage.getItem('token');
    return { token };
});
  
  export const handleRegister = createAsyncThunk('auth/register', async ({ email, password }: { email: string, password: string }) => {
    const success = await registerFunction(email, password);
    return success;
  });

  export const handleSendCode = createAsyncThunk('auth/requestOTP', async ({ email }: { email: string }) => {
    const success = await sendCode(email);
    return success;
  });

  export const handleVerifyCode = createAsyncThunk('auth/verifyOTP', async ({ OTP }: { OTP: string }) => {
    const success = await verifyCode(OTP);
    return success;
  });

  export const handleResetPassword = createAsyncThunk('auth/forgotPassword', async ({ OTP, newPassword }: { OTP: string, newPassword: string }) => {
    const success = await resetPassword(OTP, newPassword);
    return success;
  });

  export const handleResendEmail = createAsyncThunk('auth/resendVerification', async ({ email }: { email: string }) => {
    const success = await resendEmail(email);
    return success;
  });

  export const handleEditUserName = createAsyncThunk('user/addUserName', async ({ username }: { username: string }) => {
    const success = await editUserName(username);
    return success;
  });
  
  export const handleLogout = createAsyncThunk('auth/logout', async () => {
    await logout();
    return { token: null, isAuthenticated: false };
  });
const initialState:AuthState = {
    token:"",
    authenticated:false
};

const authSlice = createSlice({
    name:"authState",
    initialState,
    reducers:{
        setToken(state,action){
            state.token = action.payload
        },
        setAuthenticated(state,action){
            state.authenticated = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadToken.fulfilled, (state, action) => {
                state.token = action.payload.token??"";
                state.authenticated = !!action.payload.isAuthenticated; // Fix: Convert to boolean using double negation operator
            })
            .addCase(handleLogin.fulfilled, (state, action) => {
                state.token = action.payload.token??"";
                state.authenticated = true;
            })
            .addCase(handleRegister.fulfilled, (state, action) => {
                // handle registration success if needed
            })
            .addCase(handleSendCode.fulfilled, (state, action) => {
                // handle send code success if needed
            })
            .addCase(handleVerifyCode.fulfilled, (state, action) => {
                // handle verify code success if needed
            })
            .addCase(handleResetPassword.fulfilled, (state, action) => {
                // handle reset password success if needed
            })
            .addCase(handleResendEmail.fulfilled, (state, action) => {
              // handle resend email success if needed
            })
            .addCase(handleEditUserName.fulfilled, (state, action) => {
              // handle edit username success if needed
            })
            .addCase(handleLogout.fulfilled, (state) => {
            state.token = "";
            state.authenticated = false;
          });
      },
    
})
export const {setToken,setAuthenticated} = authSlice.actions
export default authSlice.reducer