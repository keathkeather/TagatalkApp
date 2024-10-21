import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { GameAsset, TextAsset, FileAsset } from '../redux/game/courseTreeSlice';
import FeedbackModal from '../feedbackModal';

const WriteGame1 = ({ gameId, onContinue, onWrongAttempt}: { gameId: any, onContinue: any, onWrongAttempt: any  }) => {
  const [typedText, setTypedText] = useState('');
  const [currentItem, setCurrentItem] = useState<{ given: string, correctAnswer: string[], image: any } | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const courses = useSelector((state: RootState) => state.courseTree.course);
  
  useEffect(() => {
    // Find the specific game by gameId
    const game = courses
      .flatMap(course => course.lesson)
      .flatMap(lesson => lesson.game)
      .find(game => game.id === gameId);

    // Extract the game assets from the game
    const gameAsset: GameAsset[] = game ?
      (Array.isArray(game.gameAssets) ? game.gameAssets : [game.gameAssets]) : [];

    // Extract text assets for conversation and question
    const textAssets: TextAsset[] = gameAsset.flatMap(asset => asset.textAssets);

    // Extract file assets for images
    const fileAssets: FileAsset[] = gameAsset.flatMap(asset => asset.fileAssets);
    
    // Extract the given image from the fileAssets
    const givenFile = fileAssets.find(asset => asset.assetClassifier === "GIVEN");

    // Extract each individual correct answer from the textAssets
    const correctAnswer = textAssets
      .filter(asset => asset.assetClassifier === "ANSWER")
      .map(answer => answer.textContent.toLowerCase());

    // Debugging purposes only
    console.log('Game Assets:', gameAsset);
    console.log('Game:', game);
    console.log('Given Image:', givenFile);
    console.log('Correct Answers:', correctAnswer);

    // Set the current item
    setCurrentItem({
      given: givenFile?.fileUrl || '',
      correctAnswer: correctAnswer,
      image: givenFile ? { uri: givenFile.fileUrl } : null
    });
  }, [gameId, courses]);

  const handleTextChange = (text: any) => {
    setTypedText(text);
  };

  // Function to normalize text by removing punctuation and making it lowercase
  const normalizeText = (text: string) => {
    return text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase().trim();
  };

  // Check if the user's answer matches one of the correct answers
  const checkAnswer = () => {
    if (!currentItem) return;

    const userAnswer = normalizeText(typedText);
    const isCorrect = currentItem.correctAnswer.some(answer => normalizeText(answer) === userAnswer);

    if (isCorrect) {
      setFeedback('Correct!');
      setIsModalVisible(true);
    } else {
      setFeedback('Woopsie Daisy!');
      setIsModalVisible(true);
      if (onWrongAttempt) {
        onWrongAttempt();
      }
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
    <View style={{backgroundColor: 'white', flex: 1, justifyContent: 'space-between'}}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
     style={{backgroundColor: 'white', width: '100%', flex: 1, justifyContent: 'space-between'}}>
      <Text style={styles.header}>Describe in one word.</Text>
      <View style={styles.contentContainer}>
        {currentItem && currentItem.image && (
          <Image source={currentItem.image} style={styles.image} />
        )}
        <TextInput
          style={styles.textBox}
          onChangeText={handleTextChange}
          value={typedText}
          placeholder="Write your answer here..."
          placeholderTextColor={'#D0D5DD'}
          autoCapitalize="none"
          autoCorrect={false}
          multiline
          numberOfLines={3}
        />
        
      </View>
      <TouchableOpacity 
          style={[styles.continueButton, typedText.trim() === '' ? styles.disabledButton : null]}
          onPress={checkAnswer}
          disabled={typedText.trim() === ''}
        >
          <Text style={styles.continueText}>CHECK</Text>
        </TouchableOpacity>
      <FeedbackModal
        visible={isModalVisible}
        feedback={feedback}
        onClose={handleModalClose}
      />
      </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default WriteGame1;

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  header: {
    marginTop: 20,
    fontSize: 25,
    fontWeight: "900",
  },
  contentContainer: {
    marginVertical: 20,
    width: '100%',
    height: '90%',
  },
  textBox: {
    width: '100%',
    height: '45%',
    borderColor: '#D4D4D8',
    borderWidth: 1,
    borderRadius: 20,
    marginTop: 40,
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
    height: '50%',
    letterSpacing: 1,
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