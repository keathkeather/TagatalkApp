import axios, { AxiosRequestConfig } from 'axios'; // Import AxiosRequestConfig
import { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
    userId: string,
    email: string,
    name: string,
    profileImage: string,
    profileDescription: string,
}

//*Function to get user data

export async function getUser(): Promise<User | null> {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get('http://13.236.105.57:3000/user/getUserData', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if(response){
          return response.data as User;
        } 
        return null;
        // Add catch block to handle errors
      } catch (error) {
        console.log(error);
        throw new Error('Failed to get user data');
      }
}