import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import FeedbackModal from '../feedbackModal';
import { AppDispatch, RootState } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { handleCourseTree } from '../redux/game/courseTreeSlice';
import { GameAsset, TextAsset } from '../redux/game/courseTreeSlice';

const ReadGame3 = ({ gameId, onContinue, onWrongAttempt } : { gameId: string, onContinue: any, onWrongAttempt: any}) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');
  const courses = useSelector((state: RootState) => state.courseTree.course);
 
  //TODO: GET GAME ASSETS OF THE CURRENT GAME
  // Find the specific game by passed gameId
  const game = courses
    .flatMap(course => course.lesson) 
    .flatMap(lesson => lesson.game) 
    .find(game => game.id === gameId); 

  // Extract the game assets from the game
  const gameAsset: GameAsset[] = game ? 
    (Array.isArray(game.gameAssets) ? game.gameAssets : [game.gameAssets]) : [];

  // Extract text assets
  const textAssets: TextAsset[] = gameAsset.flatMap(asset => asset.textAssets);

  // Extract the question text, correct answer and choices from the textAssets
  const givenTextAsset = textAssets.find(asset => asset.assetClassifier === "QUESTION");
  const questionText = givenTextAsset ? givenTextAsset.textContent : ''
  const correctAnswer = textAssets.find(asset => asset.isCorrectAnswer)?.textContent;

  // Extract the choices
  const choices = textAssets
  .filter(asset => asset.assetClassifier === "CHOICES") 
  .map(choice => choice.textContent);

  const handleChoicePress = (choice: string) => {
    setSelectedChoice(choice);
  };

  //Check if selected choice is correct
  const handleContinuePress = () => {
    if (selectedChoice === correctAnswer) {
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
    setIsModalVisible(false);
    if (feedback === 'Correct!' && onContinue) {
      onContinue();
    }
  };

  return (
    <View style={{backgroundColor: 'white', width: '100%', flex: 1, justifyContent: 'space-between'}}>
      <Text style={styles.header}>Question and Answer.</Text>
      <Text style={styles.word}>{questionText}</Text>
        <View style={styles.contentContainer}>
          <View style={styles.choicesContainer}>
            {choices.map((choice, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.choices1, choice === selectedChoice && styles.matched]} 
                  onPress={() => handleChoicePress(choice)}
                >
                  <Text style={styles.choicesText}>{choice}</Text>
                </TouchableOpacity>
              ))}
            
          </View>
        </View>
      <TouchableOpacity 
        style={[styles.checkButton, !selectedChoice && styles.disabledButton]}
        onPress={handleContinuePress}
        disabled={!selectedChoice}
      >
        <Text style={styles.checkText}>CHECK</Text>
      </TouchableOpacity>

      <FeedbackModal 
        visible={isModalVisible}
        feedback={feedback}
        onClose={handleModalClose}
      />
    </View>
  )
}

export default ReadGame3

const styles = StyleSheet.create({
  word: {
    fontSize: 18,
    fontWeight: "normal",
    marginHorizontal: '3%',
    marginTop: '5%',
  },
  contentContainer: {
    alignItems: "center",
    marginVertical: 20,
    width: '100%',
    height: '90%',
  },
  header: {
    fontSize: 23,
    fontWeight: "bold",
    marginLeft: '3%',
  },
  choicesContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: 'row',
  },
  choices1: {
    fontSize: 25,
    fontWeight: "bold",
    marginVertical: '3%',
    borderRadius: 35,
    width: 210,
    height: '18%',
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
  checkButton: {
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
  checkText: {
    fontSize: 18,
    letterSpacing: 1,
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
