import { Stack, Link } from 'expo-router';
import { YStack } from 'tamagui';

import { Container, Main, Title, Subtitle, Button, ButtonText } from '../tamagui.config';
import { Input ,SizableText} from 'tamagui';
import { useState } from 'react';
import {router} from 'expo-router';
import { View, Image, Text, StyleSheet, TextInput, TouchableOpacity, Alert} from 'react-native';
import { register } from '~/components/auth';
export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const handleRegistration = async () => {
    if(password !== confirmPassword){
      Alert.alert('Password does not match')
      return
    }
    const succesful = await register(email,password)
    if(succesful){
      Alert.alert('Registration succesful')
      router.push('/auth/login')
    }
  }



  return (
    <Container style={{backgroundColor:"#fff"}}>
      <Main>
        <Stack.Screen options={{ title: 'Login', headerShown: false }} />
        <YStack>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
          <Text style={styles.headerText}> Create Account</Text>
        </View> 
        <View>
          <Image source={require('./assets/logo1.png')} />
        </View>
        <View style={styles.formContainer}>
          <TextInput style={styles.textInput} onChangeText ={text=>setEmail(text)}value={email}placeholder='Email' />
          <TextInput style={styles.textInput} onChangeText={text=>setPassword(text)}value={password}placeholder='Password' />
          <TextInput style={styles.textInput} onChangeText={text=>setConfirmPassword(text)}value={confirmPassword}placeholder='Confirm Password' />
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
        <View style={styles.bottomContainer}>
        <Text style={styles.bottomText}>By continuing, you agree to TagaTalk’s 
        Terms of Service and acknowledge our Privacy and Policy.</Text>
        </View>
        </View>
        </YStack>
      </Main>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  headerContainer: {
    marginTop: 80,
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
})