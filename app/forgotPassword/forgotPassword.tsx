import { Stack, Link, router } from 'expo-router';

import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, TextInput, ImageBackground } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Container, Main, Title, Subtitle, Button, ButtonText } from '../../tamagui.config';
import React, { useEffect, useState } from 'react'

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [shouldSendCode, setSendCode] = useState(false);

    useEffect(() => {
        console.log("Inside useEffect for forgot password");
        console.log("Email:", email);
      
        const handleSendCode = async () => {
          router.push('/auth/forgotPassword/verifyCode')
        };
      
        if (shouldSendCode) {
          handleSendCode();
          setSendCode(false); // reset the trigger
        }
      }, [shouldSendCode]);       
    
  const handleSendCode = ()=>{
    setSendCode(true);
  }

  return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFA51B' }}>
            <ImageBackground source={require('../assets/forgotPassBg.png')} style={styles.background}>
                <Main style={{ flex: 1 }}> 
                    <Stack.Screen options={{ title: 'Forgot Password', headerShown: false }} />
                        <View style={styles.container}>
                            <View style={styles.formContainer}>
                                <View style={styles.headerContainer}>
                                    <Text style={styles.headerText}>Forgot Password</Text>
                                </View>
                                <View style={styles.iconContainer}>
                                    <Image source={require('../assets/icons/lock.png')} />
                                </View> 
                                <View style={styles.subheaderContainer}>
                                    <Text style={styles.subheaderText}>Enter the email associated with</Text>
                                    <Text style={styles.subheaderText}>your account.</Text>
                                </View>
                                <View style={styles.subSubheaderContainer}>
                                    <Text style={styles.subSubheaderText}>We will send you a code to reset your</Text>
                                    <Text style={styles.subSubheaderText}>password</Text>
                                </View>
                                <TextInput style={styles.textInput} onChangeText ={text=>setEmail(text)}value={email}placeholder='Enter email' />
                                <TouchableOpacity
                                    style={styles.sendCodeButton}
                                    onPress={() => handleSendCode()}
                                >
                                    <Text style={styles.buttonText}>Send Code</Text>
                                </TouchableOpacity>
                                <View style={styles.BackToLoginContainer}>
                                    <Text >
                                        <Text style={{ color: '#ffffff' }}> Back to </Text>
                                        <Link href={'/auth/login'}>
                                            <Text style={{ color: '#FFA51B', fontWeight: "bold" }}>Login</Text>
                                        </Link>
                                    </Text>
                                </View>
                            </View>
                        </View>
                </Main>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default ForgotPassword

const styles = StyleSheet.create({
    background: {
      flex: 1,
      width: '100%',
      height: '100%'
    },
    container: {
      flex: 1,
      marginTop: 100,
      alignItems: 'center',
    },
    headerContainer: {
      marginBottom: 40,
      alignItems: "center",
    },
    headerText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: "#FD9F10",
    },
    formContainer: {
      width: '80%',
      height: 630,
      padding: 24,
      marginTop: 20,
      backgroundColor: '#212121',
      flexDirection: 'column',
      borderRadius: 40,
    },
    iconContainer: {
      marginBottom: 20,
      alignItems: "center",
    },
    textInput: {
      backgroundColor: '#fff',
      borderRadius: 30,
      height: 60,
      paddingLeft: 20,
      marginBottom: 24,
    },
    subheaderContainer: {
      marginBottom: 10,
      marginTop: 10,
      alignItems: "center",
    },
    subSubheaderContainer: {
        marginBottom: 40,
        alignItems: "center",
    },
    subheaderText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: "#ffffff",
    },
    subSubheaderText: {
        fontSize: 12,
        fontWeight: '300',
        color: "#ffffff",
      },
    forgotPasswordText: {
      fontSize: 12,
      color: "white",
      marginBottom: 24,
      marginLeft: 80,
    },
    sendCodeButton: {
      backgroundColor: '#FD9F10',
      borderRadius: 30,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff', 
      fontSize: 20,
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
    BackToLoginContainer: {
        marginTop: 30,
        marginBottom: 30,
        alignItems: 'center'
    }
  });