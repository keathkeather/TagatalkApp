import { Stack, Link, router } from 'expo-router';

import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, TextInput, ImageBackground } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Container, Main, Title, Subtitle, Button, ButtonText } from '../../tamagui.config';
import React, { useEffect, useState } from 'react'

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [shouldSubmit, setSubmit] = useState(false);
    const [shouldGoBack, setGoBack] = useState(false);

    useEffect(() => {
      console.log("Inside useEffect for reset password");

      const handleSubmit = async () => {
        router.push('/auth/forgotPassword/passwordChanged')
      };

      const handleGoBack = async () => {
        router.push('/auth/forgotPassword/verifyCode')
      };

      if (shouldSubmit) {
        handleSubmit();
        setSubmit(false); // reset the trigger
      }

      if (shouldGoBack) {
        handleGoBack();
        setGoBack(false); // reset the trigger
      }
    }, [shouldSubmit, shouldGoBack]);    
    
  const handleSubmit = ()=>{
    setSubmit(true);
  }

  const handleGoBack = ()=>{
    setGoBack(true);
  }

  return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFA51B' }}>
            <ImageBackground source={require('../assets/forgotPassBg.png')} style={styles.background}>
                <Main style={{ flex: 1 }}> 
                    <Stack.Screen options={{ title: 'Reset Password', headerShown: false }} />
                        <View style={styles.container}>
                            <View style={styles.formContainer}>
                                <View style={styles.headerContainer}>
                                  <TouchableOpacity 
                                    style={styles.backButtonContainer} 
                                    onPress={() => handleGoBack()}>
                                      <Image source={require('../assets/icons/fpback.png')} style={styles.backButton} />
                                  </TouchableOpacity>
                                    <Text style={styles.headerText}>Reset Password</Text>
                                </View>
                                <View style={styles.subheaderContainer}>
                                    <Text style={styles.subheaderText}>Enter New Password</Text>
                                </View>
                                <TextInput style={styles.textInput} onChangeText ={text=>setPassword(text)}value={password}placeholder='' secureTextEntry={true} />
                                <View style={styles.subheaderContainer}>
                                    <Text style={styles.subheaderText}>Confirm New Password</Text>
                                </View>
                                <TextInput style={styles.textInput} onChangeText ={text=>setConfirmPassword(text)}value={confirmPassword}placeholder='' secureTextEntry={true} />
                                <TouchableOpacity
                                    style={styles.submitButton}
                                    onPress={() => handleSubmit()}
                                >
                                    <Text style={styles.buttonText}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                </Main>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default ResetPassword

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
      position: 'relative',
    },
    backButtonContainer: {
        position: 'absolute',
        left: 0,
    },
    backButton: {
        width: 30,
        height: 30,
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
    textInput: {
      backgroundColor: '#fff',
      borderRadius: 30,
      height: 60,
      marginBottom: 20,
      paddingLeft: 20,
    },
    subheaderContainer: {
      marginBottom: 30,
      marginTop: 10,
    },
    subheaderText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: "#ffffff",
    },
    forgotPasswordText: {
      fontSize: 12,
      color: "white",
      marginBottom: 24,
      marginLeft: 80,
    },
    submitButton: {
      backgroundColor: '#FD9F10',
      borderRadius: 30,
      height: 50,
      marginTop: 30,
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
    }
  });