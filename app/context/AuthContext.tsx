import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerFunction, login, handleChangePassword, logout } from '~/components/auth';

interface AuthProps {
    authState?: { token: string | null; authenticated: boolean | null };
    onRegister: (email: string, password: string) => Promise<boolean | null>;
    onLogin: (email: string, password: string) => Promise<boolean>;
    onChangePassword: (newPassword: string) => Promise<boolean>;
    onLogout: () => Promise<boolean>;
}

const AuthContext = createContext<AuthProps>({
    onLogin: async (email: string, password: string) => Promise.resolve(false),
    onRegister: async (email: string, password: string) => Promise.resolve(null),
    onChangePassword: async (newPassword: string) => Promise.resolve(false),
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
            console.log(token)
            if (token) {
                setAuthState({
                    token: token,
                    authenticated: true
                });
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
        onChangePassword: handleChangePassword,
        onLogout: handleLogout,
        authState
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
