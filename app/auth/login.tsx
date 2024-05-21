import { Stack, Link, router } from 'expo-router';

import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, TextInput} from 'react-native'
import { Container, Main, Title, Subtitle, Button, ButtonText } from '../../tamagui.config';
import React, { useEffect, useState } from 'react'
//import { login } from '~/components/auth'; 
import { useAuth } from '../context/AuthContext';
import { useSelector,useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { setAuthenticated, setToken } from '../redux/auth/authSlice';
import { login } from '~/components/auth';
import { handleLogin } from '../redux/auth/authSlice';
import { unwrapResult } from '@reduxjs/toolkit';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ( ) =>{
    const { onLogin } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [shouldLogin, setShouldLogin] = useState(false);
    
    const dispatch = useDispatch<AppDispatch>();


    useEffect(() => {
      console.log("Inside useEffect for login");
      console.log("Email:", email);
      console.log("Password:", password);
    
      const loginFunction = async () => {
        console.log("Attempting login...");
        try {
          const resultAction = await dispatch(handleLogin({ email, password }));
          console.log("Login successful:", resultAction);
          if (handleLogin.fulfilled.match(resultAction)) {
            console.log("Login successful, triggering onLoginSuccess...");
            
            router.push('/(tabs)')
          } else if(handleLogin.rejected.match(resultAction)) {
            alert("Invalid email or password. Please try again.");
            console.log("Login failed.");
          }
        } catch (error) {
          console.error("Login error:", error);
        }
      };
      
      if (shouldLogin) {
        loginFunction();
        setShouldLogin(false); // reset the trigger
      }
    }, [shouldLogin]);    
    
  const loginFunction = ()=>{
    setShouldLogin(true);
  }
 
  return (
        <Container style={{backgroundColor:"#fff"}}>
            <Main> 
                <Stack.Screen options={{ title: 'Login', headerShown: false }} />
                <View style={styles.container}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>Sign in</Text>
                    </View>
                    <View>
                        <Image source={require('../assets/logo1.png')} />
                    </View> 
                    <View style={styles.subheaderContainer}>
                        <Text style={styles.subheaderText}>Welcome back, we</Text>
                        <Text style={styles.subheaderText}>missed you!</Text>
                    </View>
                    <View style={styles.formContainer}>
                        <TextInput style={styles.textInput} onChangeText ={text=>setEmail(text)}value={email}placeholder='Email' />
                        <TextInput style={styles.textInput} onChangeText={text=>setPassword(text)}value={password}placeholder='Password' secureTextEntry={true} />

                        <Text style={styles.forgotPasswordText}>
                            <Text> Forgot password? </Text>
                            <Link href={'/auth/forgotPassword/forgotPassword'}>
                              <Text style={{ color: '#e8852c' }}>Click here!</Text>
                            </Link>
                        </Text>
                    <TouchableOpacity
                        style={styles.registerButton}
                        onPress={() => loginFunction()}
                        >
                        <Text style={styles.buttonText}>Sign in</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.RegisterHereContainer}>
                        <Text >
                            <Text> Don't have an account? </Text>
                            <Link href={'/auth/register'}>
                                <Text style={{ color: '#1e1e1e', fontWeight: "bold" }}>Register Here!</Text>
                            </Link>
                        </Text>
                    </View>
                </View>
            </Main>
        </Container>
    );
};

export default Login

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
    },
    headerContainer: {
      marginTop: 50,
      marginBottom: 10,
    },
    headerText: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    formContainer: {
      width: '80%',
      padding: 24,
      marginTop: 20,
      backgroundColor: '#212121',
      flexDirection: 'column',
      borderRadius: 20,
    },
    textInput: {
      backgroundColor: '#fff',
      borderRadius: 30,
      height: 40,
      paddingLeft: 20,
      marginBottom: 24,
    },
    subheaderContainer: {
      marginTop: 20,
      marginBottom: 10,
      alignItems: "center",
    },
    subheaderText: {
      fontSize: 24,
      fontWeight: '300',
      color: "#8e8e8e",
    },
    forgotPasswordText: {
      fontSize: 12,
      color: "white",
      marginBottom: 24,
      marginLeft: 80,
    },
    registerButton: {
      backgroundColor: '#FD9F10',
      borderRadius: 30,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff', 
      fontSize: 16,
      fontWeight: 'bold',
    },
    afterContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
      fontSize: 16,
      paddingBottom: 50,
    },
    afterText: { 
      color: '#1E1E1E',
      padding: 10,
    },
    line: {
      width: 80,
      height: 0,
      borderBottomWidth: 1,
      borderBottomColor: '#8e8e8e',
    },
    RegisterHereContainer: {
        marginTop: 20,
    }
  });