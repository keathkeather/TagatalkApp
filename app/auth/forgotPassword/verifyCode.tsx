import { Stack, Link, router, useLocalSearchParams } from 'expo-router';

import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, TextInput, ImageBackground } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Container, Main, Title, Subtitle, Button, ButtonText } from '../../../tamagui.config';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { handleVerifyCode, handleSendCode } from '../../redux/auth/authSlice';
import { AppDispatch } from '../../redux/store';
import { useDispatch } from 'react-redux';

const VerifyCode = () => {
    const { onVerifyCode } = useAuth();
    const [OTP, setOTP] = useState('');
    const [shouldVerifyCode, setVerifyCode] = useState(false);
    const [shouldResendCode, setResendCode] = useState(false);
    const [shouldGoBack, setGoBack] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const { email } = useLocalSearchParams<{ email: string }>();

    useEffect(() => {
      console.log("Inside useEffect for verify code");
      console.log("OTP:", OTP);
      console.log("email:", email);

      const verifyCode = async () => {
        console.log("Attempting to verify code...");
        const resultAction = await dispatch(handleVerifyCode({OTP}));
        console.log("Code successfully verified:", resultAction);
        if (handleVerifyCode.fulfilled.match(resultAction)) {
          console.log("Code successfully verify, triggering onVerifyCodeSuccess...");
          router.push({
            pathname: '/auth/forgotPassword/resetPassword',
            params: { OTP, email },
          });
        } else if(handleVerifyCode.rejected.match(resultAction)){
          console.log("Sending code failed.");
        }
      };

      const resendCode = async () => {
        console.log("Attempting to resend code...");
        const resultAction = await dispatch(handleSendCode({email}));
        console.log("Code successfully resent:", resultAction);
        if (handleSendCode.fulfilled.match(resultAction)) {
          console.log("Code successfully resent, triggering onSendCodeSuccess...");
          Alert.alert("Verification code resent");
        } else if(handleSendCode.rejected.match(resultAction)){
          console.log("Resending code failed.");
        }
      };

      const handleGoBack = async () => {
        router.push('/auth/forgotPassword/forgotPassword')
      };

      if (shouldVerifyCode) {
        verifyCode();
        setVerifyCode(false); // reset the trigger
      }

      if (shouldResendCode) {
        console.log("Resend button clicked!");
        resendCode();
        setResendCode(false);
      }

      if (shouldGoBack) {
        handleGoBack();
        setGoBack(false); // reset the trigger
      }
    }, [shouldVerifyCode, shouldResendCode, shouldGoBack]);    
    
  const handleVerifying = ()=> {
    setVerifyCode(true);
  }

  const handleResending = () => {
    setResendCode(true);
  }

  const handleGoBack = ()=> {
    setGoBack(true);
  }

  return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFA51B' }}>
            <ImageBackground source={require('../../assets/forgotPassBg.png')} style={styles.background}>
                <Main style={{ flex: 1 }}> 
                    <Stack.Screen options={{ title: 'Verify Code', headerShown: false }} />
                        <View style={styles.container}>
                            <View style={styles.formContainer}>
                                <View style={styles.headerContainer}>
                                  <TouchableOpacity 
                                    style={styles.backButtonContainer} 
                                    onPress={() => handleGoBack()}>
                                      <Image source={require('../../assets/icons/fpback.png')} style={styles.backButton} />
                                  </TouchableOpacity>
                                    <Text style={styles.headerText}>Verification</Text>
                                </View>
                                <View style={styles.subheaderContainer}>
                                    <Text style={styles.subheaderText}>Enter Verification Code</Text>
                                </View>
                                <TextInput style={styles.textInput} onChangeText ={text=>setOTP(text)}value={OTP}placeholder='Enter code' />
                                <View style={styles.ResendContainer}>
                                    <Text style={{ color: '#ffffff' }}> If you didn't receive a code. </Text>
                                    <TouchableOpacity
                                        style={styles.resendCodeButton}
                                        onPress={() => handleResending()}
                                    >
                                        <Text style={{ color: '#FFA51B', fontWeight: "bold" }}>Resend</Text>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity
                                    style={styles.sendCodeButton}
                                    onPress={() => handleVerifying()}
                                >
                                    <Text style={styles.buttonText}>Verify</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                </Main>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default VerifyCode

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
      paddingLeft: 20,
    },
    subheaderContainer: {
      marginBottom: 30,
      marginTop: 10,
      alignItems: "center",
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
    sendCodeButton: {
      backgroundColor: '#FD9F10',
      borderRadius: 30,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    resendCodeButton: {
      marginLeft: 3
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
    ResendContainer: {
        marginTop: 30,
        marginBottom: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
  });