import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Container } from '~/tamagui.config';
import { Stack, router } from 'expo-router';
import icons from '../../constants/icons';
import * as ImagePicker from 'expo-image-picker';
import { ScrollView } from 'tamagui';
import { handleEditUser } from '../redux/user/userSlice';
import { AppDispatch } from '../redux/store';
import { useDispatch } from 'react-redux';

const EditProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [imageUri, setImageUri] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [initialUsername, setInitialUsername] = useState<string>('');
  const [initialBio, setInitialBio] = useState<string>('');
  const [initialImageUri, setInitialImageUri] = useState<string>('');
  const [shouldEditUser, setShouldEditUser] = useState(false);
  const maxLength = 100;

  useEffect(() => {
    // Set initial state when component mounts
    setInitialUsername(username);
    setInitialBio(bio);
    setInitialImageUri(imageUri);

    const editUser = async () => {
      console.log("Attempting edit user...");
      const resultAction = await dispatch(handleEditUser({ file: imageUri, username, bio}));
      if (handleEditUser.fulfilled.match(resultAction)) {
        console.log("Profile successfully edited, triggering onEditUserSuccess...");
        Alert.alert("Profile updated successfully");
        router.push('../(tabs)/profile');
      } else if (handleEditUser.rejected.match(resultAction)) {
        console.log("Editing profile failed.");
        Alert.alert("Failed to update profile");
      }
    };

    if (shouldEditUser) {
      editUser();
      setShouldEditUser(false);
    }
  }, [shouldEditUser]);

  const handleSaveChanges = () => {
    // Check if username, bio, or image has changed
    if (username !== initialUsername || bio !== initialBio || imageUri !== initialImageUri) {
      setShouldEditUser(true);
    } else {
      // If no changes, show an alert
      Alert.alert("You haven't changed anything");
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      const response = await fetch(result.assets[0].uri);
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <Container style={{backgroundColor:'#fff', flex: 1}}>
      <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Stack.Screen options={{ title: 'Edit Profile', headerShown: false }} />
        <ScrollView>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => router.push('../(tabs)/profile')}>
              <Image source={icons.backArrow} style={{ height: 32, width: 12 }} />
            </TouchableOpacity>
            <Text style={styles.headerText}>Edit Profile</Text>
          </View>
          <View style={{alignSelf: 'center'}}>
            <Image source={imageUri ? { uri: imageUri } : icons.defaultProfile} style={styles.profileImage} />
          </View>
          <TouchableOpacity onPress={pickImage} style={{ position: 'absolute', right: 100, top: 170, zIndex: 9999 }}>
            <Image source={icons.camera} style={{ height: 40, width: 40, resizeMode: 'contain' }} />
          </TouchableOpacity>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.textInput}
              placeholder='Enter your username'
              value={username}
              onChangeText={setUsername}
            />
            <Text style={styles.label}>Bio</Text>
            <View style={styles.textInputBio}>
              <TextInput
                style={{ textAlign: 'left', textAlignVertical: 'top', padding: 1 }}
                placeholder='Enter your bio here'
                value={bio}
                onChangeText={setBio}
                maxLength={maxLength}
                numberOfLines={6}
                multiline={true}
              />
              <Text style={styles.counter}>{bio.length}/{maxLength}</Text>
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
              <Text style={styles.saveText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => router.push('../')}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}

export default EditProfile;

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 30,
    marginBottom: 10,
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
  counter: {
    alignSelf: 'flex-end',
    bottom: 10,
    paddingRight: 13,
    color: '#999',
    position: 'absolute',
  },
  profileImage: {
    height: 130,
    width: 130,
    marginVertical: 20,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: 'white',
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
  textInputBio: {
    backgroundColor: '#fff',
    borderRadius: 6,
    height: 179,
    width: '90%',
    padding: 13,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    textAlign: 'left',
    textAlignVertical: 'top',
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
});