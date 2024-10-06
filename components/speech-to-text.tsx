import axios, { AxiosError } from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system'; // Required for file handling in React Native

export async function handleSpeechToText(uri: string) {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        const formData = new FormData();

        // Fetch file details
        const fileInfo = await FileSystem.getInfoAsync(uri);
        if (!fileInfo.exists) {
            throw new Error('File does not exist at the given URI');
        }

        // Append audio file to formData
        formData.append('audio', {
            uri: uri, // local file path
            type: 'audio/m4a', // specify the correct MIME type
            name: 'audio.m4a', // the filename that will be used on the server
        }as any);

        // Create the Axios request configuration with Bearer token
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        };

        // API REQUEST ON BACKEND TO START SPEECH TO TEXT
        const response = await axios.post(
            `http://${process.env.EXPO_PUBLIC_LOCAL_IP}:3000/v1/speech-to-text/process-audio-file`,
            formData,
            config
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const serverError = error as AxiosError;
            if (serverError && serverError.response) {
                console.log(serverError.response.data);
            }
        }
        console.error('Error processing audio file:', error);
        return null;
    }
}
