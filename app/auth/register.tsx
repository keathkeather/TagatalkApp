import { Stack, Link } from 'expo-router';
import { YStack } from 'tamagui';
import axios from 'axios';
import { Container,Main ,Title, Subtitle, Button, ButtonText } from '~/tamagui.config';
import { Input ,SizableText,} from 'tamagui';
import React, { useEffect, useState } from 'react';
import {router} from 'expo-router';
import { View, Image, Text, StyleSheet, TextInput, TouchableOpacity, Alert, StatusBar, ImageBackground} from 'react-native';
//import { registerFunction } from '~/components/auth';
import { useAuth } from '../context/AuthContext';
import { handleRegister } from '../redux/auth/authSlice';
import { AppDispatch } from '../redux/store';
import { useDispatch } from 'react-redux';
interface RegisterProps {
  onRegisterSuccess: () => void;
}

const Register: React.FC<RegisterProps> = ( ) =>{
  const { onRegister } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [shouldRegister, setShouldRegister] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    console.log("Inside useEffect for registration");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);
  
    const registerUser = async () => {
      console.log("Attempting registration...");
      if (password !== confirmPassword) {
        console.log("Password does not match.");
        Alert.alert("Password does not match");
        return;
      }
      const resultAction = await dispatch(handleRegister({email,password}));
      console.log("Registration successful:", resultAction);
      if (handleRegister.fulfilled.match(resultAction)) {
        console.log("Registration successful, triggering onRegisterSuccess...");
        router.push({
          pathname: '/auth/emailVerification',
          params: { email },
        });
      } else if(handleRegister.rejected.match(resultAction)){
        console.log("Registration failed.");
      }
    };
  
    if (shouldRegister) {
      console.log("Attempting registration...");
      registerUser();
      setShouldRegister(false); // reset the trigger
    }
  }, [shouldRegister]);  
  
  const handleRegistration = () => {
    setShouldRegister(true);  // trigger the registration effect
  };
  



  return (
    <View style={{ flex: 1, width:'100%', justifyContent: 'center'}}>
      <StatusBar backgroundColor="#FD9F10" barStyle="light-content" />
      <Image source={require('../assets/loginRegisPassBg.png')} style={{position: 'absolute', width: '100%', height: '100%', }} />
      <Main style={{width:'100%', padding:'8%'}}>
        <Stack.Screen options={{ title: 'Login', headerShown: false }} />
        <YStack>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
          <Text style={styles.headerText}> Create Account</Text>
        </View> 
        <View>
          <Image source={require('../assets/logo1.png')} 
                          style={{
                            width: 250,
                            height:90,
                            marginTop:20,
                            resizeMode: 'contain',
                          }}/>
        </View>
        <View style={styles.formContainer}>
          <TextInput style={styles.textInput} onChangeText ={text=>setEmail(text)}value={email}placeholder='Email' />
          <TextInput style={styles.textInput} onChangeText={text=>setPassword(text)}value={password}placeholder='Password' secureTextEntry={true}/>
          <TextInput style={styles.textInput} onChangeText={text=>setConfirmPassword(text)}value={confirmPassword}placeholder='Confirm Password' secureTextEntry={true} />
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => handleRegistration()}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <View style={styles.formFooter}>
            <Text style={{ color: '#fff'}}>
              Already have an account?&nbsp;
              <Link href={'/auth/login'}>
                <Text style={{color:"#FD9F10",}}>Sign in </Text>
              </Link>
            </Text>
            </View>
        </View>
        {/* 
        <View style={styles.afterContainer}>
          <View style={styles.line} />
            <Text style={styles.bottomText}> or continue with </Text>
          <View style={styles.line} />
        </View>
        <View style={{marginTop: 20}}>
          <View style={{flexDirection:'row', gap: 20}}>
            <TouchableOpacity style={styles.box}>
              <Image source={require('../assets/Google.png')} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.box}>
              <Image source={require('../assets/outlook.png')} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.box}>
              <Image source={require('../assets/Facebook.png')} />
            </TouchableOpacity>
          </View>
        </View>
        */}
        <View style={styles.bottomContainer}>
        <Text style={styles.bottomText}>By continuing, you agree to TagaTalk’s 
        Terms of Service and acknowledge our Privacy and Policy.</Text>
        
        </View>
        </View>
        
        </YStack>
        
      </Main>
    </View>
  )
}

export default Register;
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  box: {
    width: 60,
    height: 60,
    borderRadius: 10,
    borderWidth: 1, // You can adjust the border width as needed
    borderColor: 'rgba(30, 30, 30, 0.5)', // You can set the border color as needed
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    marginTop: 50,
    marginBottom: 5,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  formContainer: {
    width: '90%',
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginTop: 20,
    backgroundColor: '#212121',
    flexDirection: 'column',
    borderRadius: 20,
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 30,
    height: 45,
    paddingLeft: 20,
    marginBottom: 20,
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
  formFooter: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    marginTop: 20,
    width: '70%',
  },
  bottomText: { 
    color: 'rgba(30, 30, 30, 0.5)',
    textAlign: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
  },
  bottomImageContainer: {
  },
  bottomImage: {

    height: 110,
  },
  line: {
    width: 70,
    marginHorizontal: 15,
    height: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#8e8e8e',
  },
  afterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    fontSize: 16,
  },
})