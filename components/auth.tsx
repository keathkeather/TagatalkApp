import React from 'react'
import { Alert } from 'react-native'
import { Link } from 'expo-router'
import axios, { AxiosRequestConfig } from 'axios'; // Import AxiosRequestConfig
import { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Configure Axios instance to accept self-signed certificates
// const axiosInstance = axios.create({
//   httpsAgent: {
//     rejectUnauthorized: false // Ignore self-signed certificates
//   }
// });

export async function register(email: string, password: string) :Promise<boolean | null>{
  try {
    console.log(email)
    console.log(password)
    //* Change to whateveer is your local ip address run ipconfig in cmd to get it put your ipv4 address
    const res = await axios.post('http://192.168.1.5:3000/auth/register', {
      email: email,
      password: password
    });
    if(res.status===201){
      return true;
    }else{
      return false;
    }
    
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      const serverError = error as AxiosError;
      if (serverError && serverError.response) {
        console.log(serverError.response.data);
      }
    }
    return null;
  }
}

export async function login(email: string, password: string): Promise<boolean> {
  try {
    const response = await axios.post('http://192.168.43.57:3000/auth/login', {
      email: email,
      password: password
    });
    console.log(response.data)
    await AsyncStorage.setItem('token', response.data);
    return true;
    
  } catch (error) {
    console.log(error);
    throw error; // Rethrow the error for handling at the caller level
  }
}
