import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import icons from '../../constants/icons';
import FeedbackModal from '../feedbackModal';
import { Audio } from 'expo-av';
import { handleSpeechToText } from '~/components/speech-to-text';
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
  const correctAnswer: TextAsset | undefined = textAssets.find(asset => asset.isCorrectAnswer === true);

  console.log(correctAnswer?.textContent)

  console.log('Game Assets:', gameAsset);
 
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

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
        //* the second parameter is the correct text while the first parameter is the uri of the recorded audio
        if (correctAnswer) {
          const result = await handleTranscription(uri, correctAnswer.textContent); // recorded by the user - uri ;  correct text - correctAnswer.textContent

          // setFeedback
          if (result === true) {
            setFeedback('Correct!');
          } else {
            setFeedback('Woopsie Daisy!');
          }

          //show modal
          setIsModalVisible(true);
        } else {
          console.warn('Correct answer is undefined.');
        }
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
      const isCorrect = await handleSpeechToText(uri, correctText); // Happening: Speech to text comparison with the correct text
      setIsCorrect(isCorrect);
      return isCorrect;
    }catch(error){
      console.log(error)
    }
  }
 
  console.log(isCorrect);

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
            {!recording ? 'Tap to speak!' : 'Tap again to check your answer!'}
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
    justifyContent: "center",
    marginTop: "5%"
  },
  subheaderText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: "#D0D5DD",
    marginBottom: 80,
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
