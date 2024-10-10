import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { GameAsset, TextAsset } from '../redux/game/courseTreeSlice';
import FeedbackModal from '../feedbackModal';

const WriteGame3 = ({ gameId, onContinue }: { gameId: any, onContinue: any }) => {
  const [typedText, setTypedText] = useState('');
  const [currentItem, setCurrentItem] = useState<{ given: string, correctAnswer: string[] } | null>(null);
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
    
    // Extract the given text from the textAssets
    const givenText = textAssets.find(asset => asset.assetClassifier === "GIVEN")?.textContent;

    // Extract each individual correct answer from the textAssets
    const correctAnswer = textAssets
      .filter(asset => asset.assetClassifier === "ANSWER")
      .map(answer => answer.textContent.toLowerCase());

    // Debugging purposes only
    console.log('Game Assets:', gameAsset);
    console.log('Game:', game);
    console.log('Conversation Text:', givenText);
    console.log('Correct Answers:', correctAnswer);

    // Set the current item
    setCurrentItem({
      given: givenText || '',
      correctAnswer: correctAnswer
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
      <Text style={styles.header}>Read and Translate.</Text>
          <View style={styles.contentContainer}>
            {currentItem && (
              <Text style={styles.word}>{currentItem.given}</Text>
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
        <TouchableOpacity 
          style={[styles.continueButton, typedText.trim() === '' ? styles.disabledButton : null]}
          onPress={checkAnswer}
          disabled={typedText.trim() === ''}
        >
          <Text style={styles.continueText}>CONTINUE</Text>
        </TouchableOpacity>
          </View>
        <FeedbackModal visible={isModalVisible}
          feedback={feedback}
          onClose={handleModalClose}
        />
        </View>
    );
  };
export default WriteGame3

const styles = StyleSheet.create({
    word: {
      marginTop: 20,
      fontSize: 20,
      fontWeight: "600",
      textDecorationLine: 'underline',
      color: '#344054',
    },
    header: {
      marginTop: 20,
      fontSize: 25,
      fontWeight: "900",
    },
    contentContainer: {
      marginTop: 10,
    },
    textBox: {
      width: '100%',
      height: '65%',
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
       height: '7%',
       alignItems: 'center',
       justifyContent: 'center',
       elevation: 4,
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
  })