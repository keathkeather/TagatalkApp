import { Middleware } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setToken, setAuthenticated } from './auth/authSlice';
import { checkTokenHealth } from '~/components/auth';
import { INIT_MIDDLEWARE } from './initMiddlewareAction';// Adjust this path as needed

let initialized = false; // Flag to track initialization

const tokenMiddleware: Middleware = store => next => async (action: any) => {
  console.log('Middleware triggered:', action.type); // Log every action type
  
  const result = next(action);

  // Check if middleware has already been initialized
  if (action.type === INIT_MIDDLEWARE && !initialized) {
    // Set the flag to true to prevent repeated initialization
    initialized = true;
    console.log('Token middleware initialized');

    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Token from AsyncStorage:', token);

      if (token) {
        const isTokenHealthy = await checkTokenHealth();
        console.log('Is token healthy:', isTokenHealthy);

        store.dispatch(setToken(token));
        store.dispatch(setAuthenticated(isTokenHealthy));
      } else {
        console.log('No token found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error checking token health:', error);
    }
  }

  return result;
};

export default tokenMiddleware;
