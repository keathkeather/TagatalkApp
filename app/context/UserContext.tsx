import React, { createContext, useContext, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { getUser, User } from '~/components/user';
import { useAuth } from '../context/AuthContext';

interface UserProps {
    userState: { user: User | null };
    handleUser: () => Promise<void>;
}

const UserContext = createContext<UserProps>({
    userState: { user: null },
    handleUser: async () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: any) => {
    const { authState } = useAuth();
    const [userState, setUserState] = useState<{ user: User | null }>({ user: null });
    const [loading, setLoading] = useState(true);

    const handleUser = async () => {
        try {
            const user = await getUser();
            setUserState({ user });
            console.log("User data:", user);
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authState && authState.authenticated) {
            handleUser();
        }
    }, [authState]);

    return (
        <UserContext.Provider value={{ userState, handleUser }}>
            {loading ? <Loading /> : children}
        </UserContext.Provider>
    );
};

const Loading = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
    </View>
);