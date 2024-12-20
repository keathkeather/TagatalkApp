import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


export async function feedback(feedbackTitle:string , feedbackDescription:string): Promise<boolean>{
    try{
        const token = await AsyncStorage.getItem('token');
        console.log(feedbackTitle, feedbackDescription)
        const res = await axios.post(`https://${process.env.EXPO_PUBLIC_LOCAL_IP}/v1/feedback/createFeedback`,{
            feedbackTitle: feedbackTitle,
            feedbackDescription: feedbackDescription
        },{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if(res.status===201){
            return true
        }
        return false;
    }catch(error){
        console.log(error);
        throw error;
    }
} 