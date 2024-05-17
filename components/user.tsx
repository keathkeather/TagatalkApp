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

//*Function to update user data
// export async function handleEditProfile(newProfileImage: File | null, newName: string, newProfileDescription: string): Promise<boolean> {
//   try {
//     const token = await AsyncStorage.getItem('token');
//     const formData = new FormData();
//     if (newProfileImage) {
//       formData.append('profileImage', newProfileImage);
//     }
//     formData.append('name', newName);
//     formData.append('profileDescription', newProfileDescription);

//     const response = await axios.put('http://13.236.105.57:3000/editUser', formData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data'
//       }
//     });

//     if (response && response.status === 200) {
//       console.log(response.data);
//       return true;
//     }
//     return false;
//   } catch (error) {
//     console.log(error);
//     return false;
//   }
// }

export async function handleEditProfile(newProfileImageuri: string,  newName : string, newProfileDescription: string):Promise<boolean>{
  try {
    const token = await AsyncStorage.getItem('token');
    const formData = new FormData();
    if (newProfileImageuri) {
      formData.append('Profile', newProfileImageuri);
    }
    formData.append('name', newName);
    formData.append('profileDescription', newProfileDescription);

    const response = await axios.put('http://13.236.105.57:3000/user/editUser', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response) {
      console.log(response.data);
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}