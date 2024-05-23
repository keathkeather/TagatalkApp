import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


export async function report(reportTitle:string , reportDescription:string): Promise<boolean>{
    try{
        const token = await AsyncStorage.getItem('token');
        const res = await axios.post('http://13.236.105.57:3000/report/createReport',{
            reportTitle: reportTitle,
            reportDescription: reportDescription
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