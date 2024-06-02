import { Stack, Link, router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, TextInput, ImageBackground } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Container, Main, Title, Subtitle, Button, ButtonText } from '../../../tamagui.config';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { handleResetPassword } from '../../redux/auth/authSlice';
import { AppDispatch } from '../../redux/store';
import { useDispatch } from 'react-redux';

const ResetPassword = () => {
    const { onResetPassword } = useAuth();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [shouldResetPassword, setResetPassword] = useState(false);
    const [shouldGoBack, setGoBack] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const { OTP } = useLocalSearchParams<{ OTP: string }>();
    const { email } = useLocalSearchParams<{ email: string }>();

    useEffect(() => {
      console.log("Inside useEffect for reset password");
      console.log("OTP:", OTP);
      console.log("email:", email);

      const resetPassword = async () => {
        console.log("Attempting reset password...");
        if (newPassword !== confirmPassword) {
          console.log("New password does not match.");
          Alert.alert("New password does not match");
          return;
        }
        const resultAction = await dispatch(handleResetPassword({OTP, newPassword}));
        console.log("Password successfully reset:", resultAction);
        if (handleResetPassword.fulfilled.match(resultAction)) {
          console.log("Password successfully reset, triggering onResetPasswordSuccess...");
          router.push('/auth/forgotPassword/passwordChanged');
        } else if(handleResetPassword.rejected.match(resultAction)){
          console.log("Resetting password failed.");
          Alert.alert("Resetting password failed");
        }
      };

      const handleGoBack = async () => {
        router.push({
          pathname: '/auth/forgotPassword/verifyCode',
          params: { email },
        });
      };

      if (shouldResetPassword) {
        resetPassword();
        setResetPassword(false); // reset the trigger
      }

      if (shouldGoBack) {
        handleGoBack();
        setGoBack(false); // reset the trigger
      }
    }, [shouldResetPassword, shouldGoBack]);    
    
  const handleResetting = ()=>{
    setResetPassword(true);
  }

  const handleGoBack = ()=>{
    setGoBack(true);
  }

  return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFA51B' }}>
            <ImageBackground source={require('../../assets/forgotPassBg.png')} style={styles.background}>
                <Main style={{ flex: 1 }}> 
                    <Stack.Screen options={{ title: 'Reset Password', headerShown: false }} />
                        <View style={styles.container}>
                            <View style={styles.formContainer}>
                                <View style={styles.headerContainer}>
                                  <TouchableOpacity 
                                    style={styles.backButtonContainer} 
                                    onPress={() => handleGoBack()}>
                                      <Image source={require('../../assets/icons/fpback.png')} style={styles.backButton} />
                                  </TouchableOpacity>
                                    <Text style={styles.headerText}>Reset Password</Text>
                                </View>
                                <View style={styles.subheaderContainer}>
                                    <Text style={styles.subheaderText}>Enter New Password</Text>
                                </View>
                                <TextInput style={styles.textInput} onChangeText ={text=>setNewPassword(text)}value={newPassword}placeholder='' secureTextEntry={true} />
                                <View style={styles.subheaderContainer}>
                                    <Text style={styles.subheaderText}>Confirm New Password</Text>
                                </View>
                                <TextInput style={styles.textInput} onChangeText ={text=>setConfirmPassword(text)}value={confirmPassword}placeholder='' secureTextEntry={true} />
                                <TouchableOpacity
                                    style={styles.submitButton}
                                    onPress={() => handleResetting()}
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