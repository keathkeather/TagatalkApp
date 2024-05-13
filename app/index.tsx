import { Stack, Link } from 'expo-router';
import { YStack } from 'tamagui';
import axios from 'axios';
import { Container, Main, Title, Subtitle, Button, ButtonText } from '../tamagui.config';
import { Input ,SizableText} from 'tamagui';
import { useEffect, useState } from 'react';
import {router} from 'expo-router';
import { View, Image, Text, StyleSheet, TextInput, TouchableOpacity, Alert} from 'react-native';
import { registerFunction } from '~/components/auth';
import {GoogleSignin, GoogleSigninButton,statusCodes} from '@react-native-google-signin/google-signin';
import Register from './auth/register';
import Login from './auth/login';
import Index from './(tabs)';
import { AuthProvider } from './context/AuthContext';

export default function Page() {
  const [registered, setRegistered] = useState(false);
  const [signed, setSigned] = useState(false);

  const handleRegisterSuccess = () => {
    setRegistered(true);
  };

  const handleLoginSuccess = () => {
    setSigned(true);
  };

  useEffect(() => {
    if (registered) {
      router.push('/auth/login'); // Push to the login route if registered
    }
  }, [registered]);

  useEffect(() => {
    if (signed) {
      router.push('../(tabs)'); // Push to the home route when signed in
    }
  }, [signed]);

  return (
    <AuthProvider>
      <Container style={{ backgroundColor: '#fff' }}>
        <Main>
          {!registered ? <Register onRegisterSuccess={handleRegisterSuccess} /> : <Login onLoginSuccess={handleLoginSuccess} />}
        </Main>
      </Container>
    </AuthProvider>
  );
}

