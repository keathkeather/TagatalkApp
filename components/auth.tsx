import React from 'react'
import { Alert } from 'react-native'
import { Link } from 'expo-router'
export async function register(email:string,password:string) {
  try{
    const response = await fetch('http://localhost:3000/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password
    }),
  });

  if (response.ok) {
    const newUser = await response.json();
    return newUser;
  } else {
    throw new Error('Failed to register user');
  }
  }catch(error){
    console.log(error)
    
  }
}
export async function login(email: string, password: string): Promise<string> {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (response.status === 201) {
    return response.text();
  } else {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}