import { Tabs } from 'expo-router';
import { View, Text, Platform, Image} from 'react-native';
import icons from '../../constants/icons';
import { UserProvider } from '../context/UserContext';

export default function TabLayout() {

    return (
    <UserProvider>
        <Tabs screenOptions={{
            headerShown: false,
            tabBarStyle: {
                position: 'absolute',
                bottom: 0,
                right: 0,
                left: 0,
                height: 72,
                elevation: 0,
                backgroundColor: 'white',
            },
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title:"",
                    tabBarIcon: ({focused}: {focused: boolean}) => {
                        return (
                            <View style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingTop: 15,
                                paddingBottom: 8,
                                borderBottomColor: focused ? '#FD9F10' : 'rgba(255, 255, 255, 0)',
                                borderBottomWidth: 4,
                                
                            }}>
                                <Image 
                                    source={focused ? icons.homeOutline : icons.home}
                                    style={{
                                        height: 24, 
                                        width: 24,
                                    }}
                                />
                            </View>
                        )
                    }

                }}
            />
            <Tabs.Screen
                name="sandbox"
                options={{
                    title:"",
                    tabBarIcon: ({focused}: {focused: boolean}) => {
                        return (
                            <View style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingTop: 15,
                                paddingBottom: 8,
                                borderBottomColor: focused ? '#FD9F10' : 'rgba(255, 255, 255, 0)',
                                borderBottomWidth: 4,
                                
                            }}>
                                <Image 
                                    source={focused ? icons.sandboxOutline : icons.sandbox}
                                    style={{
                                        height: 24, 
                                        width: 24,
                                    }}
                                />
                            </View>
                        )
                    }

                }}
            />
            <Tabs.Screen
                name="leaderboard"
                options={{
                    title:"",
                    tabBarIcon: ({focused}: {focused: boolean}) => {
                        return (
                            <View style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingTop: 15,
                                paddingBottom: 8,
                                borderBottomColor: focused ? '#FD9F10' : 'rgba(255, 255, 255, 0)',
                                borderBottomWidth: 4,
                                
                            }}>
                                <Image 
                                    source={focused ? icons.leaderboardOutline : icons.leaderboard}
                                    style={{
                                        height: 24, 
                                        width: 24,
                                    }}
                                />
                            </View>
                        )
                    }

                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title:"",
                    tabBarIcon: ({focused}: {focused: boolean}) => {
                        return (
                            <View style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingTop: 15,
                                paddingBottom: 8,
                                borderBottomColor: focused ? '#FD9F10' : 'rgba(255, 255, 255, 0)',
                                borderBottomWidth: 4,
                                
                            }}>
                                <Image 
                                    source={focused ? icons.profileOutline : icons.profile}
                                />
                            </View>
                        )
                    }

                }}
            />
            <Tabs.Screen
                name="setting"
                options={{
                    title:"",
                    tabBarIcon: ({focused}: {focused: boolean}) => {
                        return (
                            <View style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingTop: 15,
                                paddingBottom: 8,
                                borderBottomColor: focused ? '#FD9F10' : 'rgba(255, 255, 255, 0)',
                                borderBottomWidth: 4,
                                
                            }}>
                                <Image 
                                    source={focused ? icons.settingOutline : icons.setting}
                                    style={{
                                        height: 24, 
                                        width: 24,
                                    }}
                                />
                            </View>
                        )
                    }

                }}
            />
        </Tabs>
        </UserProvider>
    )
}