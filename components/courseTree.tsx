import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FileAsset {
  assetId: string,
  assetClassifier: string,
  assetType: string,
  isCorrectAnswer: boolean,
  fileUrl: string,
}

interface TextAsset {
  assetId: string,
  assetClassifier: string,
  assetType: string,
  isCorrectAnswer: boolean,
  textContent: string,
}

interface GameAsset {
  gameAssetId: string,
  gameId: string,
  isCorrectAnswer: string,
  textContent: string,
  assetClassifier: string,
  fileUrl: string,
  gameLessonNumber: number,
  gameSkill: string,
  gameUnitNumber: number,
  textAssets: TextAsset[],
  fileAssets: FileAsset[],
}

interface Game {
  id: string;
  gameType: string; // 'Type 1', 'Type 2', 'Type 3'
  gameValue: number; // score
  gameSkill: string; // 'reading', 'writing', 'listening', 'speaking'
  gameUnit: string; // Unit Description
  gameUnitNumber: number; // Unit Number
  gameLessonNumber: number; // Lesson Number
  gameLesson: string; // Lesson Title
  gameAssets: GameAsset[];
}

interface Lesson {
  id: string;
  lessonNumber: number;
  lessonName: string;
  isComplete: boolean;
  games: Game[];
}

interface Unit {
  unitName: string;
  unitNumber: number;
  lesson: Lesson[];
}

export interface CourseTreeArray {
  course: Unit[];
}

export async function getCourseTree(skillName: string): Promise<CourseTreeArray | null> {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Token:', token);
      console.log('Skill Name:', skillName);
      console.log('Local IP:', process.env.EXPO_PUBLIC_LOCAL_IP);
      
      const response = await axios.get(`https://${process.env.EXPO_PUBLIC_LOCAL_IP}/v1/unit/courseTree/${skillName}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.data) {
        console.log('No response');
        return null;
      }
      
      console.log('response', response.data);
      return { course: response.data }; // Ensure this matches the expected structure
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Log the server response error
        console.log('Server response error:', error.response.data);
        console.log('Status code:', error.response.status);
        console.log('Headers:', error.response.headers);
      } else {
        // Log other errors
        console.log('Error:', error);
      }
      throw new Error('Failed to get course tree data');
    }
  } 