import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Main } from '../../tamagui.config';
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import icons from '../../constants/icons';
import { StatusBar } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { handleResendEmail } from '../redux/auth/authSlice';
import { AppDispatch } from '../redux/store';
import { useDispatch } from 'react-redux';

const EmailVerification = () => {
  const { onResendEmail } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [shouldResendEmail, setResendEmail] = useState(false);

  useEffect(() => {
    console.log("Inside useEffect for verify email");
    console.log("email:", email);

    const resendEmail = async () => {
      console.log("Attempting to resend email...");
      const resultAction = await dispatch(handleResendEmail({email}));
      console.log("Email successfully resent:", resultAction);
      if (handleResendEmail.fulfilled.match(resultAction)) {
        console.log("Email successfully resent, triggering onResendEmailSuccess...");
        Alert.alert("Email resent");
      } else if(handleResendEmail.rejected.match(resultAction)){
        console.log("Resending email failed.");
      }
    };

    if (shouldResendEmail) {
      console.log("Resend email clicked!");
      resendEmail();
      setResendEmail(false);
    }

  }, [shouldResendEmail]); 

  const handleResending = () => {
    setResendEmail(true);
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f4f4f4'}}>
        <StatusBar backgroundColor={'#FD9F10'}/>
                <TouchableOpacity style={{marginLeft: 20, marginTop: 20}}
                    onPress={() =>router.push('/auth/register')}>
                    <Image 
                        source={icons.backArrow} 
                        style={{
                            height: 32, 
                            width: 12,
                        }}/>
                </TouchableOpacity>
                <Main style={{ justifyContent: 'center', alignItems: 'center',}}> 
                    <View style={styles.formContainer}>
                         
                        <View style={styles.headerContainer}>
                            <Text style={styles.headerText}>Verify your Email</Text>
                        </View>
                        <View>
                            <Text style={styles.subheaderText}>Check your email & click the link to activate your account.</Text>
                        </View>
                        <View style={styles.imageContainer}>
                            <Image source={require('../assets/verify.png')} style={styles.image}/>
                        </View>
                        <View>
                            <TouchableOpacity style={styles.saveButton} 
                                onPress={() =>router.push('/auth/login')}>
                                <Text style={styles.saveText}>Continue</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.resendContainer} 
                                onPress={() => handleResending()}>
                                <Text style={styles.resendText}>Resend Email</Text>
                            </TouchableOpacity>
                        </View>
                        
                    </View>
                </Main>
        </SafeAreaView>
  )
}

export default EmailVerification

const styles = StyleSheet.create({
    background: {
        width: '100%',
        height: '100%'
      },
    formContainer: {
        width: '100%',
        height: '100%',
        padding: '10%',
        backgroundColor: '#F4F4F4',
        borderRadius: 40,
        alignSelf: 'center',
      },
    headerContainer: {
        marginBottom: '5%',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    headerText: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center', 
        flex: 1, 
        color: '#344054',
    },
    subheaderText: {
        fontSize: 16.5,
        textAlign: 'center',
        color: '#344054',
        fontWeight: '300',
        width: '90%',
        alignSelf: 'center',
    },
    imageContainer: {
        alignItems: 'center',
        height: '50%',
        width: '100%',
        marginTop: '10%',
    },
    image: {
        height: '100%',
        width: '100%',
        resizeMode: 'contain',
    },
    saveButton: {
        marginTop: '10%',
        backgroundColor: '#FD9F10',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        width: '90%',
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.15, 
        shadowRadius: 4, 
        elevation: 2, 
        marginBottom: 20,
        alignSelf:'center',
      },
      saveText: {
        color: '#fff', 
        fontSize: 18,
        fontWeight: 'bold',
      },
      resendText: {
        color: '#344054',
        fontSize: 18,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
      },
      resendContainer: {
        justifyContent: 'center',
        alignItems: 'center',
      },
})