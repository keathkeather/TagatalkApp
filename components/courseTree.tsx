import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Lesson {
    id: string;
    lessonNumber: number;
    lessonName: string;
}

interface Unit {
    unitName: string;
    unitNumber: number;
    lesson: Lesson[];
}

interface CourseTreeArray {
    course: Unit[];
}

export async function getCourseTree(skillName: string): Promise<CourseTreeArray | null> {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`http://13.236.105.57:3000/unit/courseTree/${skillName}`, {
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
        console.log(error);
        throw new Error('Failed to get course tree data');
    }
}