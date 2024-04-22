import { YStack } from 'tamagui';
import { Stack, Link } from 'expo-router';

import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, TextInput} from 'react-native'
import { Container, Main, Title, Subtitle, Button, ButtonText } from '../../tamagui.config';
import React from 'react'

const Login = () => {
    return (
        <Container style={{backgroundColor:"#fff"}}>
            <Main> 
                <Stack.Screen options={{ title: 'Login', headerShown: true }} />
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
                        <TextInput style={styles.textInput} placeholder='Email' />
                        <TextInput style={styles.textInput} placeholder='Password' />

                        <Text style={styles.forgotPasswordText}>
                            <Text> Forgot password? </Text>
                            <Text style={{ color: '#e8852c' }}>Click here!</Text>
                        </Text>
                    <TouchableOpacity
                        style={styles.registerButton}
                        onPress={() => Alert.alert('Simple Button pressed')}
                        >
                        <Text style={styles.buttonText}>Sign in</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.RegisterHereContainer}>
                        <Text >
                            <Text> Don't have an account? </Text>
                            <Link href={'./index'}>
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