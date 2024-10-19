import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import icons from '../../constants/icons';
import FeedbackModal from '../feedbackModal';
import { Audio } from 'expo-av';
import { checkTranscription, handleSpeechToText, transcribeAudioFile } from '~/components/speech-to-text';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { GameAsset, TextAsset } from '../redux/game/courseTreeSlice';

const ListenGame1 = ({gameId, onContinue} : {gameId: any, onContinue : any})  => {
  const [started, setStarted] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | undefined>(undefined); 
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [recordedURI, setRecordedURI] = useState<string | null>(null);
  const [isCorrect , setIsCorrect] = useState<boolean | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [matchFound, setMatchFound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null); // State for transcription text
  const [loading, setLoading] = useState(false); // Add loading state
  const [transcribing, setTranscribing] = useState(false); // New loading state for transcription

  // Get courses from the store
  const courses = useSelector((state: RootState) => state.courseTree.course);

  //TODO: GET GAME ASSETS OF THE CURRENT GAME
  // Find the specific game by gameId
  const game = courses
    .flatMap(course => course.lesson) 
    .flatMap(lesson => lesson.game) 
    .find(game => game.id === gameId);

  // Extract the game assets from the game
  const gameAsset: GameAsset[] = game ? 
    (Array.isArray(game.gameAssets) ? game.gameAssets : [game.gameAssets]) : [];

  // Extract file assets
  const fileAssets = gameAsset.flatMap(asset => asset.fileAssets);

  // Extract text assets
  const textAssets: TextAsset[] = gameAsset.flatMap(asset => asset.textAssets);

  // Extract the audio file in mp3 form from the file assets NOTE: make the storage an audio file
  const audioFile = fileAssets.find(asset => asset.assetClassifier === 'GIVEN');


  // Extract the correct answer from the text assets
  const correctAnswer = textAssets.find(asset => asset.assetClassifier === "ANSWER")?.textContent;
  const correctText: string = correctAnswer || "";

  console.log(correctText);

  console.log('Game Assets:', gameAsset);

  const playAudio = async () => {
    if (!audioFile) 
      return;

    try {
      if (audioFile && audioFile.fileUrl) {
        // construct the audio file url
        const audioFileUri = audioFile.fileUrl;

        setIsPlaying(true);
        // create a new sound object
        const sound = new Audio.Sound();
        // Load the audio file using the URI
        await sound.loadAsync({ uri: audioFileUri });
        console.log('Audio loaded successfully from:', audioFileUri);

        // Optionally, play the sound
        await sound.playAsync();
        setIsPlaying(false);
      } else {
        console.warn('Audio file URL is null');
      }
    } catch (error) {
      console.log('Error playing audio:', error);
    }
  };

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

  // const handleMicPress = async () => {
  //   if (!recording) {
  //     await startRecording();
  //   } else {
  //     await stopRecording();
  //   }
  // };
  
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
    if (recording) {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      const uri = recording.getURI();
      setRecordedURI(uri);
      setRecording(undefined);
      
      if (uri) {
        setTranscribing(true); // Set transcribing to true before transcription
        // Transcribe audio and set transcription to state
        const transcription = await handleTranscribeAudioFile(uri);
        setTranscription(transcription);
        setTranscribing(false); // Reset transcribing after transcription
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
    }
  }

  console.log(isCorrect);

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
        <View style={[styles.micContainer, recording ? styles.micContainerActive : null]}>
          <TouchableOpacity
            style={[styles.micButton]}
            onPress={handleMicPress}
            disabled={matchFound}>
           <Image source={recording ? icons.activeMic : icons.mic} style={styles.micIcon} />
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
        <Text style={styles.continueText}>{loading ? 'Loading...' : 'Check'}</Text>
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

export default ListenGame1;

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
  micContainerActive: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: '5%',
    marginVertical: '10%',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FF5230',
    width: '100%',
  },
  micContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: '5%',
    marginVertical: '10%',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#545F714C',
    width: '100%',
  },
  backContainer: {
    height: 43,
    marginTop: 40,
    marginLeft: 10,
    flexDirection: 'row',
  },
  speakerIcon: {
    width: 43,
    height: 43,
  },
  speakerButton: {
    borderRadius: 20,
    width: '35%',
    height: '35%',
    marginTop: '30%',
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
    justifyContent: "center",
    marginTop: "5%"
  },
  subheaderText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: "#D0D5DD",
    textAlign: "center" //center the text
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
    paddingVertical: '5%',
    alignSelf: 'center',
    alignItems: "center",
    justifyContent: "center",
    margin: '5%',
    position: 'absolute',
    width: '100%',
  },
  micButton: {
    fontSize: 25,
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
