import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import icons from '../../constants/icons';
import FeedbackModal from '../feedbackModal';
import { Audio } from 'expo-av';
import { handleSpeechToText, transcribeAudioFile, checkTranscription  } from '~/components/speech-to-text';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { GameAsset, TextAsset, FileAsset } from '../redux/game/courseTreeSlice';

const SpeakGame3 = ({gameId, onContinue, onWrongAttempt} : {gameId : any, onContinue : any, onWrongAttempt: any})  => {
  const [started, setStarted] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | undefined>(undefined); 
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [recordedURI, setRecordedURI] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [matchFound, setMatchFound] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null); // State for transcription text
  const [loading, setLoading] = useState(false); // Add loading state
  const courses = useSelector((state: RootState) => state.courseTree.course);
  const [transcribing, setTranscribing] = useState(false); // New loading state for transcription

  // GET GAME ASSETS OF THE CURRENT GAME
  // Find the specific game by gameId
  const game = courses
    .flatMap(course => course.lesson) 
    .flatMap(lesson => lesson.game) 
    .find(game => game.id === gameId); 

  // Extract the game assets from the game
  const gameAsset: GameAsset[] = game ? 
    (Array.isArray(game.gameAssets) ? game.gameAssets : [game.gameAssets]) : [];

  // Extract files and text assets
  const fileAssets: FileAsset[] = gameAsset.flatMap(asset => asset.fileAssets);
  const textAssets: TextAsset[] = gameAsset.flatMap(asset => asset.textAssets);

  // Extract the image from the file assets and answer from text assets
  const imageFile = fileAssets.find(asset => asset.assetClassifier === "GIVEN")?.fileUrl;
  const correctAnswer = textAssets.find(asset => asset.assetClassifier === "ANSWER")?.textContent;
  const correctText: string = correctAnswer || "";

  console.log('Game Assets:', gameAsset);
  console.log('Game', game);
  console.log('Image:', imageFile);
  console.log('Answer:', correctText);

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
      <Text style={styles.header}>Guess the image in one word.</Text>
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          {/* Background Image */}
          <Image
            source={icons.loading} // Replace with your background image URL
            style={styles.backgroundImage}
          />
          {imageFile && (
            <Image
              source={{ uri: imageFile }}
              style={styles.icon}
            />
          )}
          
        </View>
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

export default SpeakGame3;

const styles = StyleSheet.create({
  backgroundImage: {
    position: 'absolute', 
    width: 50, 
    height: 50,
    resizeMode: 'contain',
    zIndex: -1, 
  },
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
  subheaderContainer: {
    alignItems: "center",
    width: '100%',
  },
  subheaderText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: "#D0D5DD",
    textAlign: 'center',
  },
  micIcon: {
    width: 70,
    height: 70,
  },
  icon: {
    width: 235,
    height: 230,
    resizeMode: 'contain',
    marginVertical: '2%',
    // backgroundColor: 'black',
  },
  iconContainer: {
    marginTop: '1%',
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    marginTop: 20,
    fontSize: 23,
    fontWeight: "900",
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
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  micButtonActive: {
    backgroundColor: '#ffff',
  },
  micContainerActive: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: '5%',
    marginVertical: '5%',
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

    marginVertical: '5%',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#545F714C',
    width: '100%',
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
  disabledButton: {
    backgroundColor: 'gray',
  },
});
