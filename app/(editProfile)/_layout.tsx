import { Tabs } from 'expo-router';
import { View, Text, Platform, Image} from 'react-native';
import icons from '../../constants/icons';
import { UserProvider } from '../context/UserContext';
import { Stack } from 'tamagui';
import config from '~/tamagui.config';
import { TamaguiProvider } from 'tamagui';
export default function TabLayout() {

    return (
        <TamaguiProvider config={config}>
        <UserProvider>
            {/* <Stack.Screen name="EditProfile" options={{ headerShown: false }} /> */}
        </UserProvider>
        </TamaguiProvider>
    )
}