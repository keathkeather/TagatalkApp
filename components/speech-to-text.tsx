import axios, { AxiosError } from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system'; // Required for file handling in React Native

// Function to handle speech to text
export async function handleSpeechToText(uri: string,correctText:string) {
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
        formData.append('correctAnswer',correctText);
        // Create the Axios request configuration with Bearer token
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        };

        // API REQUEST ON BACKEND TO START SPEECH TO TEXT
        const response = await axios.post(
            `https://${process.env.EXPO_PUBLIC_LOCAL_IP}/v1/speech-to-text/process-audio-file-with-checker`,
            formData,
            config
        );
        console.log("The response is: "+response.data.isCorrect)
        const isCorrect = (response.data.isCorrect == 1) ? true : false
        return isCorrect
        

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

// Function to handle the transcription of the recorded audio
export async function transcribeAudioFile(uri: string) {
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
            `https://${process.env.EXPO_PUBLIC_LOCAL_IP}/v1/speech-to-text/transcribe-audio-file`,
            formData,
            config
        );
        console.log("The response is: "+response.data);
        return response.data;

    }
    catch (error) {
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

// Function to check the correctness of the transcription of the recorded audio using Check-transcription
export async function checkTranscription(transcription: string, correctAnswer: string) {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        // Create the request body
        const body = {
            transcription,
            correctAnswer,
        };

        // Create the Axios request configuration with Bearer token
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };

        // API REQUEST ON BACKEND TO CHECK TRANSCRIPTION
        const response = await axios.post(
            `https://${process.env.EXPO_PUBLIC_LOCAL_IP}/v1/speech-to-text/Check-transcription`,
            body,
            config
        );

        console.log('Check Transcription Response:', response.data); // Log the response for debugging
        return response.data; // Return the response data

    } catch (error) {
        if (axios.isAxiosError(error)) {
            const serverError = error as AxiosError;
            if (serverError && serverError.response) {
                console.error('Server Error:', serverError.response.data);
            }
        }
        console.error('Error checking transcription:', error);
        return null; // Return null on error
    }
}
    


