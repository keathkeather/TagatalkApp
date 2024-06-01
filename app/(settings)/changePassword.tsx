import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Alert } from 'react-native'
import { Stack, router } from 'expo-router'
import { Container } from '~/tamagui.config'
import icons from '../../constants/icons';
import React, { useEffect, useState } from 'react'
import { handleChangePassword } from '../redux/auth/authSlice';
import { AppDispatch } from '../redux/store';
import { useDispatch } from 'react-redux';


const ChangePassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [shouldChangePassword, setShouldChangePassword] = useState(false);  

  useEffect(()=>{
    console.log("Inside useEffect for change password");
    console.log("oldPassword:", oldPassword);
    console.log("newPassowrd:", newPassword);
    console.log("confirmPassword:", confirmPassword);

    const handlePasswordChange = async()=>{
      if (!oldPassword || !newPassword || !confirmPassword) {
        Alert.alert("All fields are required");
        return;
      }

      if (newPassword !== confirmPassword) {
        Alert.alert("New password and confirmation do not match");
        return;
      }

      console.log("Attempting change password...");
      const resultAction = await dispatch(handleChangePassword({oldPassword, newPassword}));
      if (handleChangePassword.fulfilled.match(resultAction)) {
        console.log("Password successfully changed, triggering onChangePasswordSuccess...");
        Alert.alert("Password changed successfully");
        router.push('../(tabs)/setting');
      } else if (handleChangePassword.rejected.match(resultAction)) {
        console.log("Password change failed.");
        Alert.alert("Failed to change password");
      }
    };
    if (shouldChangePassword) {
      handlePasswordChange();
      setShouldChangePassword(false);  // reset the trigger
    }
  },[shouldChangePassword])

  const ChangePasswordHandler = ()=>{
    setShouldChangePassword(true);
  }
  return (
    
    <Container style={{backgroundColor:'#fff'}}>
        <View>
            <Stack.Screen options={{ title: 'Change Password', headerShown: false }} />
            <View style={styles.headerContainer}>
                <TouchableOpacity
                onPress={() =>router.push('../(tabs)/setting')}>
                <Image 
                    source={icons.backArrow} 
                    style={{
                        height: 32, 
                        width: 12,
                    }}/>
                </TouchableOpacity>
                <Text style={styles.headerText}>Change Password</Text>
            </View>
            <View style={styles.formContainer}>
                <Text style={styles.label}>Current Password</Text>
                <TextInput style={styles.textInput}onChangeText={text=>setOldPassword(text)} placeholder='Password' secureTextEntry={true}/>
                <Text style={styles.label}>New Password</Text>
                <TextInput style={styles.textInput}onChangeText={text=>setNewPassword(text)} placeholder='Password' secureTextEntry={true}/>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput style={styles.textInput}onChangeText={text=>setConfirmPassword(text)} placeholder='Password' secureTextEntry={true}/>
                <TouchableOpacity
                    style={styles.saveButton} onPress={()=>ChangePasswordHandler()}
                    >
                    <Text style={styles.saveText}>Save Changes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => router.push('../')}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Container>
  )
}

export default ChangePassword

const styles = StyleSheet.create({
    mainContainer: {},
    headerContainer: {
        marginTop: 50,
        marginBottom: 30,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center', 
        flex: 1, 
        color: '#344054',
    },
    textInput: {
        backgroundColor: '#fff',
        borderRadius: 6,
        height: 48,
        width: '90%',
        paddingLeft: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#D0D5DD',
      },
      formContainer: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      label: {
        fontSize: 16,
        marginBottom: 8,
        textAlign: 'left', 
        alignSelf: 'flex-start', 
        width: '90%', 
        paddingLeft: '5%', 
        color: '#344054',
      },
      saveButton: {
        backgroundColor: '#FD9F10',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        width: '90%',
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.15, 
        shadowRadius: 4, 
        elevation: 2, 
        marginBottom: 20,
      },
      saveText: {
        color: '#fff', 
        fontSize: 18,
        fontWeight: 'bold',
      },
      cancelButton: {
        backgroundColor: '#FFF',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        width: '90%',
        borderWidth: 1,
        borderColor: '#D0D5DD',
      },
      cancelText: {
        color: '#D0D5DD', 
        fontSize: 18,
        fontWeight: 'bold',
      },
})