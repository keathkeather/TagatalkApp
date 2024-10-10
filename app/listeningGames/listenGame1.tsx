import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Voice from '@react-native-voice/voice';
import { Stack } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import icons from '../../constants/icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgressBar from '../../components/ProgressBar';
import FeedbackModal from '../feedbackModal';
import { Audio } from 'expo-av';
import { handleSpeechToText } from '~/components/speech-to-text';

const ListenGame1 = ({onContinue} : {onContinue : any})  => {
  const [started, setStarted] = useState(false);
  const [results, setResults] = useState([]);
  const [recording, setRecording] = useState<Audio.Recording | undefined>(undefined); 
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [recordedURI, setRecordedURI] = useState<string | null>(null);
  const [isCorrect , setIsCorrect] = useState<boolean | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [recognizedText, setRecognizedText] = useState('');
  const [matchFound, setMatchFound] = useState();
  const [currentItem, setCurrentItem] = useState<{ audio: any, correctText: string } | null>(null);
  const [targetText, setTargetText] = useState('');
  const simulatedWrong = 'Leche flan';
  const [isPlaying, setIsPlaying] = useState(false);
  
  const navigation = useNavigation();
  const handleGoBack = () => {
    navigation.goBack();
  };

  // Array of audio files and their correct answers
  const items = [
    { audio: require('../assets/umaga.mp3'), correctText: 'Umaga' },
    { audio: require('../assets/gabi.mp3'), correctText: 'Gabi' },
    { audio: require('../assets/hapon.mp3'), correctText: 'Hapon' },
    { audio: require('../assets/tanghali.mp3'), correctText: 'Tanghali' },
    // Add more items here...
  ];

  useEffect(() => {
    // Select a random item from the array
    const randomItem = items[Math.floor(Math.random() * items.length)];
    setCurrentItem(randomItem);
  }, []);
  
  
  const playAudio = async () => {
    if (!currentItem) 
      return;

    try {
      setIsPlaying(true);
      const sound = new Audio.Sound();
      await sound.loadAsync(currentItem.audio);
      await sound.playAsync();
      setIsPlaying(false);
    } catch (error) {
      console.log('Error playing audio:', error);
    }
  };

  // FOR simulation
  const handleMicPress = async () => {
    if (!recording) {
      await startRecording();
    } else {
      await stopRecording();
    }
  };
  
  const startRecording = async () => {
    try {
      if (permissionResponse?.status !== 'granted') {
        console.log('Requesting permission...');
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording...');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    console.log('Stopping recording...');
    if (recording) {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      const uri = recording.getURI();
      console.log(uri);
      setRecordedURI(uri);
      console.log('Recording stopped and stored at', uri);
      setRecording(undefined);
      
      // await saveRecordingAsWav(uri); // Save recording as .wav file
      if (uri) {
        //* correct text should be passed in this function as the second parameter
        await handleTranscription(uri,"Kumusta, ako si keith Ian Lavador, ako ay nakatira sa");
      } else {
        console.warn('Recording URI is null.');
      }
    } else {
      console.warn('Recording does not exist.');
    }
  };
  

  //* Function to handle the transcription of the recorded audio
  async function handleTranscription(uri:string, correctText:string){
    try{
      setIsCorrect(await handleSpeechToText(uri, correctText));
      console.log(isCorrect);
    }catch(error){
      console.log(error)
    }
  }
 
  const handleContinue = () => {
    if (feedback === 'Correct!' && onContinue) {
      onContinue();
    } else {
      setIsModalVisible(false);
    }
  };

  const handleModalClose = () => {
      
    if (feedback === 'Correct!' && onContinue) {
      onContinue();
    } else {
      setIsModalVisible(false);
    }
  };

  return (
    <View style={{backgroundColor: 'white', flex: 1, justifyContent: 'space-between',}}>
      <Text style={styles.header}>Speak what you hear.</Text>
      <View style={styles.contentContainer}>
        <TouchableOpacity 
          style={styles.speakerButton}
          onPress={playAudio}
          disabled={isPlaying}>
            <Image source={icons.speaker} style={styles.speakerIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.micButton, started ? styles.micButtonActive : null]}
          onPress={handleMicPress}
          disabled={matchFound}>
          <Image source={icons.mic} style={styles.micIcon} />
        </TouchableOpacity>
        <View style={styles.subheaderContainer}>
          <Text style={styles.subheaderText}>
            {!started ? 'I-tap para magsalita' : 'Magsalita ka...'}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.continueButton, !matchFound ? styles.disabledButton : null]}
          disabled={!matchFound}>
          <Text style={styles.continueText}>CHECK</Text>
        </TouchableOpacity>
      </View>
      <FeedbackModal
        visible={isModalVisible}
        feedback={feedback}
        onClose={handleModalClose}
      />
    </View>
  );
};

export default ListenGame1;

const styles = StyleSheet.create({
  backContainer: {
    height: 43,
    marginTop: 40,
    marginLeft: 10,
    flexDirection: 'row',
  },
  speakerIcon: {
    width: 60,
    height: 60,
  },
  speakerButton: {
    borderRadius: 35,
    width: '50%',
    height: '30%',
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#02B7E8",
    elevation: 5,
    shadowColor: '#000', // For iOS
    shadowOffset: { width: 0, height: 2 }, // For iOS
    shadowOpacity: 0.25, // For iOS
    shadowRadius: 3.84, // For iOS
  },
  progressBarContainer: {
    marginLeft: 20,
  },
  backArrow: {
    width: 43,
    height: 43,
  },
  formContainer: {
    width: '48%',
    height: 100,
    padding: 18,
    marginTop: -250,
    marginLeft: 60,
    marginBottom: 210,
    backgroundColor: '#ffffff',
    borderColor: '#D0D5DD',
    borderWidth: 1,
    flexDirection: 'column',
    borderRadius: 20,
  },
  subSubheaderContainer: {
    marginBottom: 30,
  },
  subSubheaderText: {
    fontSize: 15,
    fontWeight: '600',
    color: "#344054",
  },
  subheaderContainer: {
    marginBottom: 10,
    alignItems: "center",
  },
  subheaderText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: "#D0D5DD",
    marginBottom: 80,
  },
  micIcon: {
    width: 70,
    height: 70,
  },
  icon: {
    width: 235,
    height: 230,
    resizeMode: 'contain',
  },
  iconContainer: {
    marginTop: 10,
    marginBottom: 75,
    alignItems: "center",
  },
  container: {
    color: "white",
  },
  header: {
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: '5%',
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  micButton: {
    fontSize: 25,
    marginTop: '20%',
    borderRadius: 35,
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  micButtonActive: {
    backgroundColor: '#ffffff',
  },
  choicesText: {
    fontSize: 23,
    fontWeight: "600",
    color: "white",
  },
  textBox: {
    width: 388,
    height: 300,
    borderColor: '#D4D4D8',
    borderWidth: 1,
    borderRadius: 20,
    marginTop: 70,
    marginBottom: 30,
    textAlign: 'left',
    textAlignVertical: 'top',
    fontSize: 20,
    fontWeight: '700',
    padding: 20,
  },
  continueButton: {
    position: 'absolute',
    bottom: 0,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FD9F10',
    borderRadius: 30,
    width: '100%',
    height: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  success: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: 'gray',
  },
  matched: {
    backgroundColor: 'gray',
  },
});
