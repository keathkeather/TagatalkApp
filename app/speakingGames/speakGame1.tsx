// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
// import { Audio } from 'expo-av';
// import * as FileSystem from 'expo-file-system';
// import { Stack } from 'expo-router';
// import { useNavigation } from '@react-navigation/native';
// import icons from '../../constants/icons';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import ProgressBar from '../../components/ProgressBar';
// import FeedbackModal from '../feedbackModal';
// import axios, { AxiosError } from 'axios';
// // import { KJUR, KEYUTIL, RSAKey } from 'jsrsasign';

// const SpeakGame1 = () => {
//   const [recording, setRecording] = useState<Audio.Recording | undefined>(undefined);
//   const [permissionResponse, requestPermission] = Audio.usePermissions();
//   const [recordedURI, setRecordedURI] = useState<string | null>(null);
//   const [isTranscribing, setIsTranscribing] = useState(false);
//   const [transcription, setTranscription] = useState('');
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [feedback, setFeedback] = useState('');
//   const [matchFound, setMatchFound] = useState(false);
//   const targetText = 'Nakakapagpabagabag ang sinabi ni Juan sa akin';
//   const simulatedCorrect = 'Nakakapagpabagabag ang sinabi ni Juan sa akin';
//   const simulatedWrong = 'Nakakapagbagabagagabag ang sinabi ni Juan sa akin';

//   const navigation = useNavigation();
//   const handleGoBack = () => {
//     navigation.goBack();
//   };

//   useEffect(() => {
//     return () => {
//       if (recording) {
//         recording.stopAndUnloadAsync();
//       }
//     };
//   }, [recording]);

//   const startRecording = async () => {
//     try {
//       if (permissionResponse?.status !== 'granted') {
//         console.log('Requesting permission...');
//         await requestPermission();
//       }
//       await Audio.setAudioModeAsync({
//         allowsRecordingIOS: true,
//         playsInSilentModeIOS: true,
//       });

//       console.log('Starting recording...');
//       const { recording } = await Audio.Recording.createAsync(
//         Audio.RecordingOptionsPresets.HIGH_QUALITY
//       );
//       setRecording(recording);
//       console.log('Recording started');
//     } catch (err) {
//       console.error('Failed to start recording', err);
//     }
//   };

//   const stopRecording = async () => {
//     console.log('Stopping recording...');
//     if (recording) {
//       await recording.stopAndUnloadAsync();
//       await Audio.setAudioModeAsync({
//         allowsRecordingIOS: false,
//       });
//       const uri = recording.getURI();
//       setRecordedURI(uri);
//       console.log('Recording stopped and stored at', uri);
//       setRecording(undefined);
//       setIsTranscribing(true);
//       await saveRecordingAsWav(uri); // Save recording as .wav file
//     } else {
//       console.warn('Recording does not exist.');
//     }
//   };

//   const saveRecordingAsWav = async (uri: any) => {
//     try {
//       const { sound } = await Audio.Sound.createAsync({ uri: uri }, { shouldPlay: false });
//       const wavFile = `${FileSystem.documentDirectory}recording.wav`; // Removed extra slash before "recording.wav"
//       await sound.setIsLoopingAsync(false);
//       await sound.playAsync();
//       await sound.setIsLoopingAsync(false);
//       await sound.unloadAsync();
//       await sound.setOnPlaybackStatusUpdate(null);
//       await FileSystem.moveAsync({ from: uri, to: wavFile });
//       console.log('Recording saved as .wav file at', wavFile);
//       transcribeAudio(wavFile); // Pass the absolute path without file:// prefix
//     } catch (error) {
//       console.error('Error saving recording as .wav:', error);
//       setIsTranscribing(false);
//       setIsModalVisible(true);
//     }
//   };      

//   const transcribeAudio = async (audioFileUri: string) => {
//     try {
//       // Prepare JWT token
//       const privateKey = require('../../tagatalk_speechtotext.json');
//       const token = createToken(privateKey);
  
//       // Prepare request configuration
//       const config = {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       };
  
//       // Prepare data for the transcription request
//       const data = {
//         audio: {
//           uri: audioFileUri, // Pass the URI of the .wav file
//         },
//         config: {
//           encoding: 'LINEAR16',
//           sampleRateHertz: 16000,
//           languageCode: 'fil-PH',
//         },
//       };
  
//       // Make a POST request to the Speech-to-Text API
//       const response = await axios.post(
//         'https://speech.googleapis.com/v1/speech:recognize',
//         data,
//         config
//       );
  
//       // Extract transcription from response
//       const transcription = response.data.results[0]?.alternatives[0]?.transcript || 'No transcription results found';
//       console.log('Transcription:', transcription);
//       setTranscription(transcription);
  
//       // Check if the transcribed text matches the targetText
//       const matchFound = transcription.toLowerCase() === targetText.toLowerCase();
//       setMatchFound(matchFound);
//       setFeedback(matchFound ? 'Correct!' : 'Incorrect. Try again.');
//       setIsModalVisible(true);
//     } catch (error) {
//       console.error('Error:', error);
//       if (axios.isAxiosError(error)) {
//         const axiosError = error as AxiosError;
//         if (axiosError.response) {
//           console.error('Response data:', axiosError.response.data);
//           console.error('Response status:', axiosError.response.status);
//           console.error('Response headers:', axiosError.response.headers);
//         }
//       }
//       setFeedback('Error occurred during transcription.');
//     } finally {
//       setIsTranscribing(false); // Reset isTranscribing state
//       setIsModalVisible(true); // Show feedback modal regardless of success or failure
//     }
//   };  
  
//   // Function to create JWT token
//   const createToken = (privateKey: any) => {
//     const iat = Math.floor(Date.now() / 1000);
//     const exp = iat + 3600;
//     const payload = {
//       iss: privateKey.client_email,
//       sub: privateKey.client_email,
//       aud: 'https://speech.googleapis.com/',
//       iat: iat,
//       exp: exp,
//     };
//     const header = { alg: 'RS256', typ: 'JWT' };
//     const stringHeader = JSON.stringify(header);
//     const stringPayload = JSON.stringify(payload);
//     const prvKey: RSAKey = KEYUTIL.getKey(privateKey.private_key) as RSAKey;
//     return KJUR.jws.JWS.sign(null, stringHeader, stringPayload, prvKey);
//   };  
  
//   const handleMicPress = async () => {
//     if (!recording) {
//       await startRecording();
//     } else {
//       await stopRecording();
//     }
//   };

//   const checkAnswer = () => {
//     if (matchFound) {
//       setFeedback('Correct!');
//     } else {
//       setFeedback('Incorrect. Try again.');
//     }
//     setIsModalVisible(true);
//   };

//   /* FOR simulation
//   const handleMicPress = () => {
//     if (started) {
//       // Simulate stopping the recording
//       setStarted(false);
      
//       // Randomly choose between simulatedText and simulatedWrong
//       const recognized = Math.random() < 0.5 ? simulatedCorrect : simulatedWrong;
//       setRecognizedText(recognized);

//       const matchFound = recognized.toLowerCase() === targetText.toLowerCase();
//       setMatchFound(matchFound);
//       if (!matchFound) {
//         setFeedback('Incorrect. Try again.');
//       } else {
//         setFeedback('Correct!');
//       }
//       setIsModalVisible(true);
//     } else {
//       // Simulate starting the recording
//       setStarted(true);
//       setRecognizedText('');
//     }
//   };
//   */

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
//       <Stack.Screen options={{ headerShown: false }} />
//       <View style={styles.backContainer}>
//         <TouchableOpacity onPress={handleGoBack}>
//           <Image source={icons.modbackarrow} style={styles.backArrow} />
//         </TouchableOpacity>
//         <View style={styles.progressBarContainer}>
//           <ProgressBar value={20} indicatorColor={'#FD9F10'} />
//         </View>
//       </View>
//       <Text style={styles.header}>Speak the sentence below.</Text>
//       <View style={styles.contentContainer}>
//         <View style={styles.iconContainer}>
//           <Image source={require('../assets/TeeTeex4.png')} style={styles.icon} />
//         </View>
//         <View style={styles.formContainer}>
//           <View style={styles.subSubheaderContainer}>
//             <Text style={styles.subSubheaderText}>Nakakapagpabagabag</Text>
//             <Text style={styles.subSubheaderText}>ang sinabi ni Juan sa</Text>
//             <Text style={styles.subSubheaderText}>akin.</Text>
//           </View>
//         </View>
//         <TouchableOpacity
//           style={[styles.micButton, recording ? styles.micButton : null]}
//           onPress={handleMicPress}
//           disabled={matchFound}>
//           <Image source={icons.mic} style={styles.micIcon} />
//         </TouchableOpacity>
//         <View style={styles.subheaderContainer}>
//           <Text style={styles.subheaderText}>
//             {!recording ? 'I-tap para magsalita' : 'Magsalita ka...'}
//           </Text>
//         </View>
//         <TouchableOpacity
//           style={[styles.continueButton, !matchFound ? styles.disabledButton : null]}
//           disabled={!matchFound}>
//           <Text style={styles.continueText}>CONTINUE</Text>
//         </TouchableOpacity>
//       </View>
//       <FeedbackModal
//         visible={isModalVisible}
//         feedback={feedback}
//         onClose={() => setIsModalVisible(false)}
//       />
//     </SafeAreaView>
//   );
// };

// export default SpeakGame1;

// const styles = StyleSheet.create({
//   backContainer: {
//     height: 43,
//     marginTop: 40,
//     marginLeft: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   progressBarContainer: {
//     marginLeft: 20,
//   },
//   backArrow: {
//     width: 43,
//     height: 43,
//   },
//   formContainer: {
//     width: '48%',
//     height: 100,
//     padding: 18,
//     marginTop: -250,
//     marginLeft: 60,
//     marginBottom: 217,
//     backgroundColor: '#ffffff',
//     borderColor: '#D0D5DD',
//     borderWidth: 1,
//     flexDirection: 'column',
//     borderRadius: 20,
//   },
//   subSubheaderContainer: {
//     marginBottom: 40,
//   },
//   subSubheaderText: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: "#344054",
//   },
//   subheaderContainer: {
//     marginBottom: 10,
//     alignItems: "center",
//   },
//   subheaderText: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     color: "#D0D5DD",
//     marginBottom: 80,
//   },
//   micIcon: {
//     width: 70,
//     height: 70,
//   },
//   icon: {
//     width: 200,
//     height: 155,
//     transform: [{ rotate: '38deg' }],
//   },
//   iconContainer: {
//     marginTop: 90,
//     marginRight: 298,
//     marginBottom: 10,
//     alignItems: "center",
//   },
//   container: {
//     color: "white",
//   },
//   header: {
//     fontSize: 25,
//     fontWeight: "bold",
//     marginLeft: 20,
//     marginTop: 40,
//   },
//   contentContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 55,
//   },
//   micButton: {
//     fontSize: 25,
//     marginTop: 25,
//     marginLeft: 20,
//     borderRadius: 35,
//     width: 70,
//     height: 70,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#ffffff",
//   },
//   micButtonActive: {
//     backgroundColor: '#ffffff',
//   },
//   choicesText: {
//     fontSize: 23,
//     fontWeight: "600",
//     color: "white",
//   },
//   textBox: {
//     width: 388,
//     height: 300,
//     borderColor: '#D4D4D8',
//     borderWidth: 1,
//     borderRadius: 20,
//     marginTop: 70,
//     marginBottom: 30,
//     textAlign: 'left',
//     textAlignVertical: 'top',
//     fontSize: 20,
//     fontWeight: '700',
//     padding: 20,
//   },
//   continueButton: {
//     backgroundColor: '#FD9F10',
//     borderRadius: 30,
//     width: 390,
//     height: 48,
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 4,
//   },
//   continueText: {
//     fontSize: 18,
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   success: {
//     fontSize: 18,
//     color: 'black',
//     fontWeight: 'bold',
//   },
//   disabledButton: {
//     backgroundColor: 'gray',
//   },
//   matched: {
//     backgroundColor: 'gray',
//   },
// });
