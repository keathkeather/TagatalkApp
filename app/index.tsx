import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { Container, Main } from '../tamagui.config';
import { useAuth } from './context/AuthContext';  // Ensure correct path
import { Text } from 'tamagui';
export default function Page() {
  const { authState } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Loading state

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
      if (authState?.authenticated === true) {
        router.replace('/(tabs)');
      } else if (authState?.authenticated === false) {
        router.replace('/auth/login');
      }
    }
  }, [isLoading, authState?.authenticated, router]);

  return (
    <Container style={{ backgroundColor: '#fff' }}>
      {isLoading ? (
        // Display loading indicator or placeholder while loading
        <Main><Text></Text></Main>
      ) : (
        // Render your main content here instead of RootLayout
        <Main>
          {/* Your main content */}
        </Main>
      )}
    </Container>
  );
}
