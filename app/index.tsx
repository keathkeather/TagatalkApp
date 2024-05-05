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

export default function Page() {
  return (
    <Container style={{backgroundColor:"#fff"}}>
      <Main>
        <Stack.Screen options={{ title: 'Login', headerShown: false }} />
          <Register/>
      </Main>
      </Container>
  )
}

