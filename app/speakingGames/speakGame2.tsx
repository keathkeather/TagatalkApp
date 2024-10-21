import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import icons from '../../constants/icons';
import FeedbackModal from '../feedbackModal';
import { Audio } from 'expo-av';
import { handleSpeechToText, transcribeAudioFile, checkTranscription } from '~/components/speech-to-text';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { GameAsset, TextAsset } from '../redux/game/courseTreeSlice';

const SpeakGame2 = ({gameId, onContinue, onWrongAttempt} : {gameId: any, onContinue : any, onWrongAttempt: any}) => {
  const [started, setStarted] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | undefined>(undefined); 
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [recordedURI, setRecordedURI] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [matchFound, setMatchFound] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null); // State for transcription text
  const [loading, setLoading] = useState(false); // Add loading state
  const [transcribing, setTranscribing] = useState(false); // New loading state for transcription

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

  // Extract the conversation question text from the textAssets
  const conversationText = textAssets.find(asset => asset.assetClassifier === "CONVERSATION")?.textContent
  const questionText = textAssets.find(asset => asset.assetClassifier === "QUESTION")?.textContent;
  const correctAnswer = textAssets.find(asset => asset.assetClassifier === "ANSWER")?.textContent;
  const correctText: string = correctAnswer || "";

  console.log('Game Assets:', gameAsset);
  console.log('Game', game);
  console.log('Conversation:', conversationText);
  console.log('Question:', questionText);
  console.log('Correct Answer:', correctAnswer);

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
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (recording) {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      const uri = recording.getURI();
      setRecordedURI(uri);
      setRecording(undefined);
      
      if (uri) {
        setTranscribing(true);
        // Transcribe audio and set transcription to state
        const transcription = await handleTranscribeAudioFile(uri);
        setTranscription(transcription);
        setTranscribing(false);
      }
    }
  };

  async function handleTranscribeAudioFile(uri: string) {
    try {
      
      const transcription = await transcribeAudioFile(uri);
      setTranscription(transcription);
      return transcription;
    } catch (error) {
      console.error('Error transcribing audio file:', error);
      return null;
    }
  }

  async function handleTranscription(uri: string) {
    setLoading(true); // Start loading
    const transcription = await handleTranscribeAudioFile(uri);
  
    if (transcription) {
      const result = await checkTranscription(transcription, correctText);
      setFeedback(result === 1 ? 'Correct!' : 'Woopsie Daisy!');
      if (result !== 1 && onWrongAttempt) {
        onWrongAttempt();
      }
    }
  }

  const handleMicPress = async () => {
    if (!recording) {
      await startRecording();
    } else {
      await stopRecording();
    }
  };

  const handleCheckPress = async () => {
    if (recordedURI) {
      await handleTranscription(recordedURI);
      setLoading(false); // Start loading
      setIsModalVisible(true); // Show modal after checking the transcription
    } else {
      console.warn('No recording found');
    }
  };
 
  const handleModalClose = () => {
    setTranscription(null);
    if (feedback === 'Correct!' && onContinue) {
      onContinue();
    } else {
      setIsModalVisible(false);
    }
  };

  return (
    <View style={{backgroundColor: 'white', flex: 1, justifyContent: 'space-between',}}>
      <Text style={styles.header}>Complete the conversation.</Text>
      <Text style={styles.subheader}>{conversationText}</Text>
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <Image source={require('../assets/TeeTeex4.png')} style={styles.icon} />
        </View>
        <View style={styles.formContainer}>
            <Text style={styles.subSubheaderText}>{questionText}</Text>
        </View>
        <View style={styles.icon2Container}>
          <Image source={require('../assets/woman.png')} style={styles.icon2} />
        </View>
        <View style={styles.subformContainer}>
            <TouchableOpacity
                style={[styles.micButton, recording ? styles.micButtonActive : null]}
                onPress={handleMicPress}
                disabled={matchFound}>
                <Image source={recording ? icons.activeMic2 : icons.mic2} style={styles.micIcon} />
            </TouchableOpacity>
            <View style={styles.subheaderContainer}>
                <Text style={styles.subheaderText}>
                    {!recording ? 'Tap to record' : 'Tap to stop recording'}
                </Text>
            </View>
        </View>
        
      </View>
      <TouchableOpacity
        style={[styles.continueButton, transcription === null ? styles.disabledButton : null]}
        onPress={handleCheckPress}
        disabled={transcription === null}>
        <Text style={styles.continueText}>{loading ? 'LOADING...' : 'CHECK'}</Text>
      </TouchableOpacity>

      <FeedbackModal
        visible={isModalVisible}
        feedback={feedback}
        onClose={handleModalClose}
      />

      {/* Loading Overlay */}
      {transcribing && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Transcribing...</Text>
        </View>
      )}

      {/* Transcription View */}
      {transcription && (
        <View style={styles.transcriptionView}>
          <Text style={styles.transcriptionTitle}>Transcription:</Text>
          <View style={styles.innerTranscriptionView}>
            <Text style={styles.transcriptionText}>{transcription}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default SpeakGame2;

const styles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    bottom: '11.5%',
    backgroundColor: '#BF85FA',
    padding: 15,
    borderRadius: 15,
    width: '100%',
    height: '15%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  transcriptionView: {
    position: 'absolute',
    bottom: '11.5%',
    backgroundColor: '#BF85FA',
    padding: 15,
    borderRadius: 15,
    width: '100%',
  },
  innerTranscriptionView: {
    backgroundColor: 'white',
    paddingTop: '5%',
    paddingHorizontal: '5%',
    borderRadius: 10,
  },
  transcriptionTitle: {
    fontSize: 18,
    marginBottom: '3%',
    color: 'white',
  },
  transcriptionText: {
    fontSize: 16,
  },
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
    width: '50%',
    height: 'auto',
    padding: 10,
    marginTop: -80,
    marginLeft: 20,
    marginBottom: 10,
    backgroundColor: '#DA9EFF',
    flexDirection: 'column',
    borderRadius: 10,
    position: 'absolute',
    left: '35%',
    top: '20%',
  },
  subformContainer: {
    width: '50%',
    height: 'auto',
    padding: 10,
    backgroundColor: '#FFB4C4',
    borderRadius: 10,
    alignItems: "center",
    position: 'absolute',
    left: '20%',
    top: '25%',
  },
  subSubheaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: "#F4F4F4",
  },
  subheaderContainer: {
    alignItems: "center",
    width: 'auto',
    height: 'auto',
  },
  subheaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: "#F4F4F4"
  },
  micIcon: {
    width: 30,
    height: 30,
  },
  icon: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
  },
  iconContainer: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
    position: 'absolute',
    left: 10,
    top: 10,
  },
  icon2: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  icon2Container: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
    position: 'absolute',
    right: '5%',
    top: '25%',
  },
  container: {
    color: "white",
  },
  header: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: "900",
  },
  subheader: {
    fontSize: 16,
    fontWeight: "normal",
    marginHorizontal: '3%',
    marginTop: 10,
  },
  contentContainer: {
    // backgroundColor: '#F4F4F4',
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    width: '100%',
    height: '90%',
  },
  micButton: {
    fontSize: 14,
    borderRadius: 35,
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFB4C4",
  },
  micButtonActive: {
    backgroundColor: '#FFB4C4',
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
    width: '100%',
    height: '8%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    position: 'absolute' ,
    bottom: 0,
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
