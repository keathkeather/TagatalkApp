import React from 'react'
import { Alert } from 'react-native'
import { Link } from 'expo-router'
import axios, { AxiosRequestConfig } from 'axios'; // Import AxiosRequestConfig
import { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import "core-js/stable/atob";
// Configure Axios instance to accept self-signed certificates
// const axiosInstance = axios.create({
//   httpsAgent: {
//     rejectUnauthorized: false // Ignore self-signed certificates
//   }
// });

export async function registerFunction(email: string, password: string) :Promise<boolean | null>{
  try {
    console.log(email)
    console.log(password)
    //* Change to whateveer is your local ip address run ipconfig in cmd to get it put your ipv4 address
    const res = await axios.post('http://13.236.105.57:3000/auth/register', {
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
    const response = await axios.post('http://13.236.105.57:3000/auth/login', {
      email: email,
      password: password
    });
    console.log(response.data)
    await AsyncStorage.setItem('token', response.data);
    console.log(await AsyncStorage.getItem('token'))
    return true;
    
  } catch (error) {
    console.log(error);
    throw error; // Rethrow the error for handling at the caller level
  }


}
export async function handleChangePassword(newPassword: string):Promise<boolean>{
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.put('http://13.236.105.57:3000/auth/changePassword',{
      newPassword: newPassword
    },{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if(response){
      console.log(response)
      return true;
    } 
    return false
    // Add catch block to handle errors
  } catch (error) {
    console.log(error);
    return false;
  }
}
export async function logout(){
  try {
    await AsyncStorage.removeItem('token');
    return true
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function handletokenRefresh(): Promise<boolean | null> {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get('http://13.236.105.57:3000/auth/changePassword',{
      headers: {
        Authorization: `Bearer ${token}`
      }
    }); 
    if(response){
      await AsyncStorage.setItem('token', response.data);
      return true
    }
    return false

  }catch(error){
    return false
  }
}


export async function checkTokenHealth(): Promise<boolean | null> {
  try {
    const token = await AsyncStorage.getItem('token');
    console.log(`tokenAAAAAaa: ${token}`)
    if (!token) {
      return false;
    }
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Get the current time in seconds
    const tenMinutes = 10 * 60; // Ten minutes in seconds
    console.log(decoded.exp)
    console.log(currentTime + tenMinutes)
    if ((decoded.exp ?? 0) > currentTime) { 
      if((decoded.exp??0)<currentTime + tenMinutes){
        console.log("token will expire in 10 minutes")
        await handletokenRefresh()
        return true
      }
      console.log("token not expired")
      return true
        
    }else{
      console.log("token expired")
      return false
    
    }
    return false; //* token is not expired
  } catch (error) {
    console.error(error);
    return false;
  }
}
   
