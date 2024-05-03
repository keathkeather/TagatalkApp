import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


export async function feedback(feedbackTitle:string , feedbackDescription:string): Promise<boolean>{
    try{
        const token = await AsyncStorage.getItem('token');
        console.log(feedbackTitle, feedbackDescription)
        const res = await axios.post('http://52.65.15.61:3000/feedback/createFeedback',{
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