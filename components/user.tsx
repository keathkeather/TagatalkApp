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

export interface LeaderboardUser {
    userId: string;
    email: string;
    name: string;
    userPoints: number;
    rank: number;
}

//*Function to get user data
const formdata = global.FormData

export async function getUser(): Promise<User | null> {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`http://${process.env.EXPO_PUBLIC_LOCAL_IP}:3000/v1/user/getUserData`, {
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

// Function to fetch leaderboard data
export async function getLeaderBoard(): Promise<LeaderboardUser[] | null> {
    try {
        // Retrieve the token from AsyncStorage
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        // Make an API request to get leaderboard data
        const response = await axios.get(`http://${process.env.EXPO_PUBLIC_LOCAL_IP}:3000/v1/user/getLeaderBoard`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Return the leaderboard data
        return response.data as LeaderboardUser[];
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        if (axios.isAxiosError(error)) {
            const serverError = error as AxiosError;
            if (serverError && serverError.response) {
                console.error(serverError.response.data);
            }
        }
        return null;
    }
}

export async function editUser(file: string | null, username: string, profileDescription: string): Promise<boolean> {
  try {
    // Retrieve the token from AsyncStorage
    const token = await AsyncStorage.getItem('token');

    // If no token is found, throw an error
    if (!token) {
      throw new Error('No token found');
    }

    // Create FormData object to handle the file upload
    const formData = new formdata();
    if (file) {
      console.log("file:", file);
      const photo={
        uri:file,
        type:'image/jpeg',
        name:'profile.jpg'
      }
      formData.append('Profile',photo as unknown as File)
    }
    formData.append('name', username);
    formData.append('profileDescription', profileDescription);

    console.log("data:", formData);

    // Create the Axios request configuration with Bearer token
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    };

    // Make the API call to edit the user profile
    const response = await axios.put(`http://${process.env.EXPO_PUBLIC_LOCAL_IP}:3000/v1/user/editUser`, formData, config);

    // Check if the response status is 200 (OK)
    return response.status === 200;

  } catch (error) {
    console.log("Error?", error);
    if (axios.isAxiosError(error)) {
      const serverError = error as AxiosError;
      if (serverError && serverError.response) {
        console.log(serverError.response.data);
      }
    }
    return false;
  }
}