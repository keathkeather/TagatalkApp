import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerFunction, login, sendCode, verifyCode, resetPassword, resendEmail, logout, checkTokenHealth } from '~/components/auth';

interface AuthProps {
    authState?: { token: string | null; authenticated: boolean | null };
    onRegister: (email: string, password: string) => Promise<boolean | null>;
    onLogin: (email: string, password: string) => Promise<boolean>;
    onSendCode: (email: string) => Promise<boolean | null>;
    onVerifyCode: (OTP: string) => Promise<boolean | null>;
    onResetPassword: (OTP: string, newPassword: string) => Promise<boolean | null>;
    onResendEmail: (email: string) => Promise<boolean | null>;
    onLogout: () => Promise<boolean>;
}

const AuthContext = createContext<AuthProps>({
    onLogin: async (email: string, password: string) => Promise.resolve(false),
    onRegister: async (email: string, password: string) => Promise.resolve(null),
    onSendCode: async (email: string) => Promise.resolve(null),
    onVerifyCode: async (OTP: string) => Promise.resolve(null),
    onResetPassword: async (OTP: string, newPassword: string) => Promise.resolve(null),
    onResendEmail: async (email: string) => Promise.resolve(null),
    onLogout: async () => Promise.resolve(false),
});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
    const [authState, setAuthState] = useState<{
        token: string | null;
        authenticated: boolean | null;
    }>({
        token: null,
        authenticated: false
    });

    useEffect(() => {
        const loadToken = async () => {
            const token = await AsyncStorage.getItem('token');
            // console.log(await checkTokenHealth())
            if(await checkTokenHealth() === false){
                setAuthState({
                    token: token,
                    authenticated: false
                });
            }else{
                if (token) {
                    setAuthState({
                        token: token,
                        authenticated: true
                    });
                }
            }

        };
        loadToken();
    }, []);
    useEffect(() => {
        console.log("Auth state changed:", authState);
    }, [authState]);

    const handleRegister = async (email: string, password: string) => {
      console.log("inside auth register")
      console.log(email)
      console.log(password)
        const success = await registerFunction(email, password);
        return success !== null ? success : false;
    };

    const handleLogin = async (email: string, password: string) => {
      console.log("inside auth login");
      console.log(email);
      console.log(password);
      try {
          // Call login function to authenticate user
          await login(email, password);
          
          // Retrieve token from AsyncStorage after login
          const token = await AsyncStorage.getItem('token');
          
          // Update AuthState with the retrieved token
          setAuthState({
              token: token,
              authenticated: true
          });
  
          return true; // Return true to indicate successful login
        } catch (error) {
            console.log(error);
            return false; // Return false if login fails
        }
    };  

    const handleSendCode = async (email: string) => {
        console.log("inside auth sendCode")
        console.log(email)
        const success = await sendCode(email);
        return success !== null ? success : false;
    };

    const handleVerifyCode = async (OTP: string) => {
        console.log("inside auth verifyCode")
        console.log(OTP)
        const success = await verifyCode(OTP);
        return success !== null ? success : false;
    };

    const handleResetPassword = async (OTP: string, newPassword: string) => {
        console.log("inside auth resetPassword")
        console.log(OTP)
        console.log(newPassword)
        const success = await resetPassword(OTP, newPassword);
        return success !== null ? success : false;
    };

    const handleResendEmail = async (email: string) => {
        console.log("inside auth resendEmail")
        console.log(email)
        const success = await resendEmail(email);
        return success !== null ? success : false;
    };

    const handleLogout = async () => {
        const success = await logout();
        if (success==true) {
            setAuthState({
                token: null,
                authenticated: false
            });
        }
        return success;
    };

    const value: AuthProps = {
        onRegister: handleRegister,
        onLogin: handleLogin,
        onSendCode: handleSendCode,
        onVerifyCode: handleVerifyCode,
        onResetPassword: handleResetPassword,
        onLogout: handleLogout,
        onResendEmail: handleResendEmail,
        authState
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
