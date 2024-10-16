import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { Stack } from 'expo-router';
import icons from '../../constants/icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import FeedbackModal from '../feedbackModal';
import { handleSpeechToText } from '~/components/speech-to-text';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { GameAsset, TextAsset } from '../redux/game/courseTreeSlice';
// testing commit

const SpeakGame1 = ({gameId, onContinue} : {gameId: any, onContinue : any})  => {
  const [recording, setRecording] = useState<Audio.Recording | undefined>(undefined);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [recordedURI, setRecordedURI] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [matchFound, setMatchFound] = useState(false);
  const courses = useSelector((state: RootState) => state.courseTree.course);

  // GET GAME ASSETS OF THE CURRENT GAME
  // Find the specific game by gameId
  const game = courses
    .flatMap(course => course.lesson) 
    .flatMap(lesson => lesson.game) 
    .find(game => game.id === gameId); 

  // Extract the game assets from the game
  const gameAsset: GameAsset[] = game ? 
    (Array.isArray(game.gameAssets) ? game.gameAssets : [game.gameAssets]) : [];

  // Extract text assets
  const textAssets: TextAsset[] = gameAsset.flatMap(asset => asset.textAssets);

  // Extract the conversation text and correct answer
  const conversationText = textAssets.find(asset => asset.assetClassifier === "CONVERSATION")?.textContent;
  const correctAnswer = textAssets.find(asset => asset.assetClassifier === "ANSWER")?.textContent;
  const correctText: string = correctAnswer || "";

  console.log('Game Assets:', gameAsset);
  console.log('Game', game);
  console.log('Conversation:', conversationText);
  console.log('Answer:', correctAnswer);
  
  useEffect(() => {
    return () => {
      if (recording) {
        recording.getStatusAsync().then((status) => {
          if (status.isRecording) {
            // Stop the recording if it is still in progress
            recording.stopAndUnloadAsync().catch((err) => {
              console.warn('Error stopping and unloading recording:', err);
            });
          }
        }).catch((err) => {
          console.warn('Error getting recording status:', err);
        });
      }
    };
  }, [recording]);

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
      if (uri) {
        await handleTranscription(uri);
      } else {
        console.warn('Recording URI is null.');
      }
    } else {
      console.warn('Recording does not exist.');
    }
  };

  // Function to handle the transcription of the recorded audio
  async function handleTranscription(uri:string){
    try{
      const result = await handleSpeechToText(uri, correctText);
      console.log('Match:', result);
      // setFeedback
      if (result === true) {
        setFeedback('Correct!');
      } else {
        setFeedback('Woopsie Daisy!');
      }
      // show modal
      setIsModalVisible(true);
    }catch(error){
      console.log(error)
    }
  }

  const handleMicPress = async () => {
    if (!recording) {
      await startRecording();
    } else {
      await stopRecording();
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
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={styles.header}>Speak the sentence below.</Text>
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <Image source={require('../assets/TeeTeex4.png')} style={styles.icon} />
        </View>
        <View style={styles.formContainer}>
          <View style={styles.subSubheaderContainer}>
            <Text style={styles.subSubheaderText}>{conversationText}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.micButton, recording ? styles.micButton : null]}
          onPress={handleMicPress}
          disabled={matchFound}>
          <Image source={icons.mic} style={styles.micIcon} />
        </TouchableOpacity>
        <View style={styles.subheaderContainer}>
          <Text style={styles.subheaderText}>
            {!recording ? 'I-tap para magsalita' : 'Magsalita ka...'}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.continueButton, !matchFound ? styles.disabledButton : null]}
          disabled={!matchFound}>
          <Text style={styles.continueText}>CONTINUE</Text>
        </TouchableOpacity>
      </View>
      <FeedbackModal
        visible={isModalVisible}
        feedback={feedback}
        onClose={handleModalClose}
      />
    </SafeAreaView>
  );
};

export default SpeakGame1;

const styles = StyleSheet.create({
  backContainer: {
    height: 43,
    marginTop: 40,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarContainer: {
    marginLeft: 20,
  },
  backArrow: {
    width: 43,
    height: 43,
  },
  formContainer: {
    width: '55%',
    height: 95,
    padding: 18,
    marginTop: -250,
    marginLeft: 60,
    marginBottom: 217,
    backgroundColor: '#ffffff',
    borderColor: '#D0D5DD',
    borderWidth: 1,
    flexDirection: 'column',
    borderRadius: 20,
    flexWrap: 'wrap',
    overflow: 'hidden',
  },
  subSubheaderContainer: {
    marginBottom: 0,
  },
  subSubheaderText: {
    fontSize: 15,
    fontWeight: '600',
    color: "#344054",
    flexShrink: 1,
    flexWrap: 'wrap',
    lineHeight: 18,
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
    width: 200,
    height: 155,
    transform: [{ rotate: '38deg' }],
  },
  iconContainer: {
    marginTop: 90,
    marginRight: 298,
    marginBottom: 10,
    alignItems: "center",
  },
  container: {
    color: "white",
  },
  header: {
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: 20,
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 55,
  },
  micButton: {
    fontSize: 25,
    marginTop: 25,
    marginLeft: 20,
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
    backgroundColor: '#FD9F10',
    borderRadius: 30,
    width: 390,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
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
