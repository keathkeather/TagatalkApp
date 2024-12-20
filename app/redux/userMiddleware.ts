import { Middleware } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setToken, setAuthenticated } from './auth/authSlice';
import { checkTokenHealth } from '~/components/auth';
import { checkToken } from './actions';
import { handleUser } from './user/userSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './store';
let initialized = false; // Flag to track initialization

const userMiddleware: Middleware = store => next => async (action: any) => {
  console.log('Middleware triggered:', action.type); // Log every action type
  
  const result = next(action);
  const dispatch = useDispatch<AppDispatch>();
  // Check if middleware has already been initialized
  if (!initialized) {
    // Set the flag to true to prevent repeated initialization
    initialized = true;
    console.log('User middleware initialized');

    try {
      
      const user =  await dispatch(handleUser());
      console.log('Middleware result:',user); 
    } catch (error) {
      console.error('Error fetching:', error);
    }
  }
  // Log the result of the action
  return result;
};

export default userMiddleware;
