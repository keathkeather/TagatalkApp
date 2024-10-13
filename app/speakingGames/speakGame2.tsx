import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import icons from '../../constants/icons';
import FeedbackModal from '../feedbackModal';
import { Audio } from 'expo-av';
import { handleSpeechToText } from '~/components/speech-to-text';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { GameAsset, TextAsset } from '../redux/game/courseTreeSlice';

const SpeakGame2 = ({gameId, onContinue} : {gameId: any, onContinue : any}) => {
  const [started, setStarted] = useState(false);
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

  // Extract the conversation question text from the textAssets
  const conversationText = textAssets.find(asset => asset.assetClassifier === "CONVERSATION")?.textContent
  const questionText = textAssets.find(asset => asset.assetClassifier === "QUESTION")?.textContent;
  const correctAnswer = textAssets.find(asset => asset.assetClassifier === "ANSWER")?.textContent;
  const correctText: string = correctAnswer || "";

  console.log('Game Assets:', gameAsset);
  console.log('Game', game);
  console.log('Conversation:', conversationText);
  console.log('Question:', questionText);
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
                <Image source={icons.mic2} style={styles.micIcon} />
            </TouchableOpacity>
            <View style={styles.subheaderContainer}>
                <Text style={styles.subheaderText}>
                    {!recording ? 'I-tap para magsalita' : 'Magsalita ka...'}
                </Text>
            </View>
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

export default SpeakGame2;

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
    width: '40%',
    padding: 10,
    marginTop: -80,
    marginLeft: 20,
    marginBottom: 10,
    backgroundColor: '#DA9EFF',
    flexDirection: 'column',
    borderRadius: 10,
  },
  subformContainer: {
    width: '35%',
    height: 90,
    padding: 10,
    marginTop: -70,
    marginLeft: 75,
    marginBottom: 320,
    backgroundColor: '#FFB4C4',
    flexDirection: 'column',
    borderRadius: 10,
    alignItems: "center"
  },
  subSubheaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: "#F4F4F4",
  },
  subheaderContainer: {
    alignItems: "center",
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
  },
  iconContainer: {
    marginTop: 10,
    marginRight: 260,
    marginBottom: 10,
    alignItems: "center",
  },
  icon2: {
    width: 60,
    height: 60,
  },
  icon2Container: {
    marginTop: 10,
    marginLeft: 300,
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
  subheader: {
    fontSize: 16,
    fontWeight: "normal",
    marginLeft: 20,
    marginTop: 10,
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 55,
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
    marginBottom: 20,
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
