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
      console.log('Token:', token);
      console.log('Skill Name:', skillName);
      console.log('Local IP:', process.env.EXPO_PUBLIC_LOCAL_IP);
      
      const response = await axios.get(`http://${process.env.EXPO_PUBLIC_LOCAL_IP}:3000/unit/courseTree/${skillName}`, {
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