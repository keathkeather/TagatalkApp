import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default async function handleUserProgress(lessonId:string){
    try{
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }
        const response = await axios.get(`http://${process.env.EXPO_PUBLIC_LOCAL_IP}:3000/v1/user/create-user-progress/${lessonId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if(response){
            //* might change depending on what you need
            return true;
        }
        return false;
    }catch(error){
        console.log(error);
        throw new Error('Failed to create user progress');
    }
}