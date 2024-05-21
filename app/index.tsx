import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { Container, Main } from '../tamagui.config';
import { useAuth } from './context/AuthContext';  // Ensure correct path
import { Text } from 'tamagui';
import { View, Image } from 'react-native';
import {Provider, useSelector} from 'react-redux';
import { RootState, store } from './redux/store';
import { initMiddlewareAction } from './redux/initMiddlewareAction';

export default function Page() {
  const { authState } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const isAuthenticated =useSelector((state:RootState)=>state.auth.authenticated);

  useEffect(() => {
    // Simulate loading delay (you can replace it with your actual loading mechanism)
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false); // Set loading state to false after some delay
    }, 1000); // Adjust the delay as needed

    return () => clearTimeout(loadingTimeout); // Cleanup timeout
  }, []);

  useEffect(() => {
    // Perform navigation only after the Root Layout has finished rendering
   
    if (!isLoading) {
      if (isAuthenticated === true) {
        console.log("Authenticated")
        router.replace('/(tabs)');
      } else if (isAuthenticated === false) { // TODO authenticated ==false / token == expired 
        console.log("NOT AUTHENTICATED")
        router.replace('/auth/login');
      }
    }
  }, [isLoading, authState?.authenticated, router]);

  return (
    <Provider store={store}>
    <Container style={{ backgroundColor: '#FD9F10' }}>
      {isLoading ? (
        // Display loading indicator or placeholder while loading
        
        <Main>
          <Stack.Screen options={{ headerShown: false }} />
          <View style={{backgroundColor: '#FD9F10'}}/>
        </Main>
      ) : (
        // Render your main content here instead of RootLayout
        <Main>
          {/* Your main content */}
        </Main>
      )}
    </Container>
   </Provider>
  );
}
