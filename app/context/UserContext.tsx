import React, { createContext, useContext, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { getUser, User } from '~/components/user';

interface UserProps {
    userState: { user: User | null };
    getUserData: ()=> Promise<boolean>;
}

const UserContext = createContext<UserProps>({
    userState: { user: null },
    getUserData : async () => Promise.resolve(false),
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: any) => {
   
    const [userState, setUserState] = useState<{ user: User | null }>({ user: null });


    const handleUser = async () => {
        try {
            const user = await getUser();
            if(user){
                setUserState({ user:user });
                console.log("User data:", user);
                return true
            }
            return false
            
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            return false;
        } 
    };

    const value = { userState, getUserData: handleUser };
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

