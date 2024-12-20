import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Game {
    gameId: string,
    gameType: string, //  'Type 1', 'Type 2', 'Type 3'
    gameValue: number,  // score
    gameSkill: string, // 'reading', 'writing', 'listening', 'speaking'
    gameUnit: string, // Unit Description
    gameUnitNumber: number, // Unit Number
    gameLessonNumber: number, // Lesson Number
    gameLesson: string, // Lesson Title
}

export interface Games {
    game: Game[];
}

// Function to get game base on lesson
export async function getGame(gameLessonNumber: number): Promise<Games | null> {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`https://${process.env.EXPO_PUBLIC_LOCAL_IP}/v1/game/getGameByLesson/${gameLessonNumber}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (!response) {
            console.log('No response');
            return null;
        }
        console.log('response')
        console.log(response.data);
        return { game: response.data } ; // Fix: Typecast response.data as Game
    } catch (error) {
        console.log(error);
        throw new Error('Failed to get game data');
    }
}