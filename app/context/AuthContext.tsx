import { createContext,useContext,useEffect,useState } from "react";
import * as SecureStore from 'expo-secure-store';
import axios from "axios";


interface AuthProps{
    authState?: {token:string|null; authenticated: boolean|null};
    onRegister?: (email:string,password:string)=>Promise<any>
    onLogin?: (email:string,password:string)=>Promise<any>
    onLogout?: ()=>Promise<any>
}
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({children}:any) => {
    const [authState,setAuthState] = useState<{
        token:string|null;
        authenticated:boolean|null;
    }>({
        token:null,
        authenticated:null
    });
    useEffect(()=>{
        const loadToken = async()=>{
            const token = await SecureStore.getItemAsync('token');
            console.log(authState)
            console.log("Token:", token)
            if(token){
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setAuthState({
                    token:token,
                    authenticated:true
                })
                
            }
        };
        loadToken();
    },[])

    const register = async(email:string,password:string)=>{
        try{
            const res = await axios.post('http://52.65.15.61:3000/auth/register', {
            email: email,
            password: password
            });
            if(res.status===201){
                return true;
                }else{
                return false;
            }
        }catch(error){
            console.log(error);
        }
    }
    const login = async(email:string, password:string)=>{
        try{
            const response = await axios.post('http://52.65.15.61:3000/auth/login', {
                email: email,
                password: password
            });
            console.log(response.data)
            setAuthState({
                token:response.data,
                authenticated:true
            })

            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data}`;
            await SecureStore.setItemAsync('token',response.data)
            return response;
        }catch(error){
            console.log(error);
        }
    }

    const logout = async()=>{
        try{
            await SecureStore.deleteItemAsync('token');
            setAuthState({
                token:null,
                authenticated:false
            })
            axios.defaults.headers.common['Authorization'] = '';
        }catch(error){
            console.log(error);
        }
    }
    
    
    const value ={
        onRegister:register,
        onLogin:login,
        onLogout:logout,
        authState
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

