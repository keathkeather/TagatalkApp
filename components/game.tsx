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