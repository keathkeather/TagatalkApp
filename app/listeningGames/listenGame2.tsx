import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Audio } from 'expo-av';
import icons from '../../constants/icons';
import FeedbackModal from '../feedbackModal';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { GameAsset, TextAsset } from '../redux/game/courseTreeSlice';

const ListenGame2 = ({gameId, onContinue} : {gameId: any, onContinue : any}) => {
  const [typedText, setTypedText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');

  //Get courses from the redux store
  const courses = useSelector((state: RootState) => state.courseTree.course);

  // TODO: GET GAME ASSETS OF THE CURRENT GAME
  // find the specific game by passed gameId
  const game = courses
    .flatMap(course => course.lesson) 
    .flatMap(lesson => lesson.game) 
    .find(game => game.id === gameId);

  // Extract game assets from the game
  const gameAsset: GameAsset[] = game ? 
    (Array.isArray(game.gameAssets) ? game.gameAssets : [game.gameAssets]) : [];
  
  // Extract text assets
  const textAssets: TextAsset[] = gameAsset.flatMap(asset => asset.textAssets);

  // Extract file assets
  const fileAssets = gameAsset.flatMap(asset => asset.fileAssets);

  // Extract the audio file
  const audioFile = fileAssets.find(asset => asset.assetClassifier === 'GIVEN');
  
  // Extract the correct answer from the text assets
  const correctAnswer: TextAsset | undefined = textAssets.find(asset => asset.isCorrectAnswer === true);

  // console.log(correctAnswer?.textContent)

  // useEffect(() => {
  //   // Select a random item from the array
  //   const randomItem = items[Math.floor(Math.random() * items.length)];
  //   setCurrentItem(randomItem);
  // }, []);
  

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

  const handleTextChange = (text: any) => {
    setTypedText(text);
  };

  const checkAnswer = () => {
    if (!correctAnswer) return;

    if (typedText.trim().toLowerCase() === correctAnswer.textContent.toLowerCase()) {
      setFeedback('Correct!');
      setIsModalVisible(true);
    } else {
      setFeedback('Woopsie Daisy!');
      setIsModalVisible(true);
    }
  };

  const handleContinue = () => {
    if (feedback === 'Correct!' && onContinue) {
      onContinue();
    } else {
      setIsModalVisible(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
     style={{backgroundColor: 'white', width: '100%', flex: 1, justifyContent: 'space-between'}}>
    <Text style={styles.header}>Write what you hear.</Text>
        <View style={styles.contentContainer}>
          <TouchableOpacity 
          style={styles.speakerButton}
          onPress={playAudio}
          disabled={isPlaying}>
            <Image source={icons.speaker} style={styles.speakerIcon} />
          </TouchableOpacity>
      <TextInput
        style={styles.textBox}
        onChangeText={handleTextChange}
        value={typedText}
        placeholder="Write your answer here..."
        placeholderTextColor={'#D0D5DD'}
        autoCapitalize="none"
        autoCorrect={false}
        multiline={true}
        numberOfLines={3}
      />
      <TouchableOpacity 
        style={[styles.continueButton, typedText.trim() === '' ? styles.disabledButton : null]}
        onPress={checkAnswer}
        disabled={typedText.trim() === ''}
      >
        <Text style={styles.continueText}>CHECK</Text>
      </TouchableOpacity>
        </View>
      <FeedbackModal visible={isModalVisible}
        feedback={feedback}
        onClose={handleContinue}
      />
      </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
  );
};

export default ListenGame2;

const styles = StyleSheet.create({
  speakerIcon: {
    width: 43,
    height: 43,
  },
  header: {
    marginTop: 20,
    fontSize: 25,
    fontWeight: "900",
  },
  contentContainer: {
    alignItems: 'center',
  },
  speakerButton: {
    marginTop: 50,
    borderRadius: 35,
    width: '30%',
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#02B7E8",
    elevation: 5,
  },
  choicesText: {
    fontSize: 23,
    fontWeight: "600",
    color: "white",
  },
  textBox: {
    width: '100%',
    height: '45%',
    borderColor: '#D4D4D8',
    borderWidth: 1,
    borderRadius: 20,
    marginTop: '10%',
    marginBottom: '10%',
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
    height: '7%',
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
})