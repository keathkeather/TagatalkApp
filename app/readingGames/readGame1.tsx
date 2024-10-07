import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FeedbackModal from '../feedbackModal';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { GameAsset, TextAsset } from '../redux/game/courseTreeSlice';

const GameScreen = ({gameId, onContinue} : {gameId: any, onContinue : any}) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [continueClicked, setContinueClicked] = useState<boolean>(false);
  const [randomQuestion, setRandomQuestion] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const navigation = useNavigation();

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

  // Extract text assets
  const textAssets: TextAsset[] = gameAsset.flatMap(asset => asset.textAssets);

  // Extract the conversation text from the textAssets
  const conversationText = textAssets.find(asset => asset.assetClassifier === "conversation")?.textContent;
  const givenTextAsset = textAssets.find(asset => asset.assetClassifier === "given");
  const questionText = givenTextAsset ? givenTextAsset.textContent : ''
  const correctAnswer = textAssets.find(asset => asset.isCorrectAnswer)?.textContent;

  // Extract the choices
  const choices = textAssets
  .filter(asset => asset.assetClassifier === "choices")
  .map(choice => choice.textContent);

  console.log('Game Assets:', gameAsset);
  console.log('Game', game);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const checkAnswer = () => {
    if (selectedWord === correctAnswer) {
      setIsModalVisible(true);
      setFeedback("Correct!"); 
    } else {
      setIsModalVisible(true);
      setFeedback("Woopsie Daisy!");
    }
    
  }; 

  const handleWordPress = (word: string) => {
    if (!continueClicked) {
      setSelectedWord(prevWord => (prevWord === word ? null : word));
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
      <Text style={styles.header}>Read and respond</Text>
        <View style={styles.contentContainer}>
          <View style={styles.questionContainer}>
            <Image source={require('../assets/TeeTee.png')} style={styles.teetee} />
              <View style={styles.imgBubble}> 
                <Text style={styles.questionText}>{conversationText}</Text>
                <Image source={require('../assets/textbubble.png')} />
            </View>
          </View>
            <Text style={styles.subQuestionText}>{questionText}</Text>
              <View style={styles.wordContainer}>
                {choices.map((choice, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.wordButton,
                      selectedWord === choice && styles.selectedWordButton
                    ]}
                    onPress={() => handleWordPress(choice)}
                    disabled={continueClicked}
                    > 
                      <Text style={styles.wordText}>{choice}</Text>
                  </TouchableOpacity>
                ))}
                  <TouchableOpacity 
                    style={[
                      styles.continueButton,
                      continueClicked && styles.continueButtonDisabled,
                      selectedWord === null && styles.continueButtonDisabled,
                    ]}
                    onPress={checkAnswer}
                    disabled={!selectedWord}
                    >
                      <Text style={styles.continueText}>CHECK</Text>
                    </TouchableOpacity>
              </View>
        </View>
          {/* Render the modal */}
        <FeedbackModal
          visible={isModalVisible}
          feedback={feedback}
          onClose={handleModalClose}
        />
    </View>  
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    marginTop: 10,
  },
  header: {
    fontSize: 25,
    fontWeight: "900", 
    marginTop: 20,
  },
  teetee: {
    width: '55%',
    height: 130,
  },
  imgHeader: {
    flexDirection: 'row',
  },
  imgBubble: {
    position: 'relative',
  },
  questionContainer: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  questionText: {
    position: 'absolute',
    lineHeight: 25,
    width: '70%',
    fontSize: 15,
    fontWeight: "bold",
    color: "#F4F4F4", //change to #F4F4F4 if there is text bubble
    zIndex: 1,
    top: '10%',
    left: '13%',
  },
  subQuestionText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "black", //change to #F4F4F4 if there is text bubble
    textAlign: "center",
    marginBottom: 15,
  },
  wordContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#02B7E8',
    borderRadius: 35,
    marginTop: 20,
    width: '85%',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedWordButton: {
    backgroundColor: '#00ADA7',
  },
  wordText: {
    fontSize: 25,
    color: 'white',
    fontWeight: "600",
  },
  continueButton: {
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FD9F10',
    borderRadius: 30,
    width: '100%',
    height: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: 'gray',
  },
  continueText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default GameScreen;
