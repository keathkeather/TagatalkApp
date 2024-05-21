import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { TamaguiProvider } from 'tamagui';
import { AuthProvider } from './context/AuthContext';
import config from '../tamagui.config';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { initMiddlewareAction } from './redux/initMiddlewareAction';
export default function Layout() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      store.dispatch(initMiddlewareAction());
    }
  }, [loaded]);



  if (!loaded) return null;
  
 
  return (
    <Provider store={store}>
    <TamaguiProvider config={config}>
      {/* <AuthProvider> */}
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/register" options={{ headerShown: false }} />
          <Stack.Screen name="auth/forgotPassword/passwordChanged" options={{ headerShown: false }} />
          <Stack.Screen name="auth/forgotPassword/resetPassword" options={{ headerShown: false }} />
          <Stack.Screen name="auth/forgotPassword/verifyCode" options={{ headerShown: false }} />
          <Stack.Screen name="auth/forgotPassword/forgotPassword" options={{ headerShown: false }} />
        </Stack>
      {/* </AuthProvider> */}
    </TamaguiProvider>
    </Provider>
  );
}
