import axios from 'axios';
import { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProgress {
    userId: string;
    lessonId: string;
    isCompleted: boolean;
}

export async function addUserProgress(lessonId: string): Promise<string | null> {
    try {
        // Retrieve the token from AsyncStorage
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        // Make an API request to add user progress
        const response = await axios.post(`https://${process.env.EXPO_PUBLIC_LOCAL_IP}/v1/user-progress/create-user-progress/${lessonId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Return the response message
        return response.data.message;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const serverError = error as AxiosError;
            if (serverError && serverError.response) {
                console.log(serverError.response.data);
            }
        }
        console.error('Error adding user progress:', error);
        return null;
    }
}

export async function getUserProgress(): Promise<UserProgress[] | null> {
    try {
        // Retrieve the token from AsyncStorage
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        // Make an API request to get user progress
        const response = await axios.get(`https://${process.env.EXPO_PUBLIC_LOCAL_IP}/v1/user-progress/getUserProgress`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Return the user progress data
        return response.data as UserProgress[];
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const serverError = error as AxiosError;
            if (serverError && serverError.response) {
                console.log(serverError.response.data);
            }
        }
        console.error('Error fetching user progress:', error);
        return null;
    }
}