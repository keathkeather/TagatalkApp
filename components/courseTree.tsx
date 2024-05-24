import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface CourseTree {
    gameUnit: string; // Unit Description
    gameUnitNumber: number; // Unit Number
    gameLessonNumber: number; // Lesson Number
    gameLesson: string; // Lesson Title
    isCompleted: boolean; // Lesson Completion Status
}

export interface CourseTreeArray {
    course: CourseTree[];
}

// Function to get course tree needed data
export async function getCourseTree(gameSkill: string): Promise<CourseTreeArray | null> {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`http://13.236.105.57:3000/user/getAllGamesForCourseTree/${gameSkill}`, {
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
        return { course: response.data }; // Ensure this matches the expected structure
    } catch (error) {
        console.log(error);
        throw new Error('Failed to get course tree data');
    }
}
