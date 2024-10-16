import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { GameAsset, TextAsset } from '../redux/game/courseTreeSlice';
import FeedbackModal from '../feedbackModal';

const WriteGame2 = ({ gameId, onContinue }: { gameId: any, onContinue: any }) => {
  const [typedText, setTypedText] = useState('');
  const [currentItem, setCurrentItem] = useState<{ scenario: string, question: string, correctAnswers: string[] } | null>(null);
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
    
    // Extract the conversation text from the textAssets
    const conversationText = textAssets.find(asset => asset.assetClassifier === "CONVERSATION")?.textContent;

    // Extract the question text from the textAssets
    const questionText = textAssets.find(asset => asset.assetClassifier === "QUESTION")?.textContent;

    // Extract each individual correct answer from the textAssets
    const correctAnswers = textAssets
      .filter(asset => asset.assetClassifier === "ANSWER")
      .map(answer => answer.textContent.toLowerCase().trim());

    // Debugging purposes only
    console.log('Game Assets:', gameAsset);
    console.log('Game:', game);
    console.log('Conversation Text:', conversationText);
    console.log('Question Text:', questionText);
    console.log('Correct Answers:', correctAnswers);

    // Set the current item
    setCurrentItem({
      scenario: conversationText || '',
      question: questionText || '',
      correctAnswers: correctAnswers
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
    const isCorrect = currentItem.correctAnswers.some(answer => normalizeText(answer) === userAnswer);

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
    <View style={{ backgroundColor: 'white', flex: 1, justifyContent: 'space-between' }}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
     style={{backgroundColor: 'white', width: '100%', flex: 1, justifyContent: 'space-between'}}>
      <Text style={styles.header}>Answer TeeTee's question!</Text>
      <View style={styles.contentContainer}>
        {currentItem && (
          <>
            <Text style={styles.word}>{currentItem.scenario}</Text>
            <View style={styles.questionContainer}>
              <Image source={require('../../app/assets/TeeTee.png')} style={styles.teetee} />
              <View style={styles.chatBubble}>
                <Text style={styles.chatText}>{currentItem.question}</Text>
                <Image source={require('../../app/assets/chatBbl.png')} style={styles.chatBbl} />
              </View>
            </View>
          </>
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
          <Text style={styles.continueText}>CHECK</Text>
        </TouchableOpacity>
      </View>
      <FeedbackModal visible={isModalVisible}
        feedback={feedback}
        onClose={handleModalClose}
      />
      </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default WriteGame2;

const styles = StyleSheet.create({
  questionContainer: {
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  teetee: {
    width: '35%',
    height: 130,
  },
  chatBubble: {
    position: 'relative',
  },
  chatText: {
    fontSize: 16,
    fontWeight: "900",
    color: 'white',
    position: 'absolute',
    zIndex: 1,
    top: '7%',
    left: '13%',
  },
  chatBbl: {
    width: 230,
    height: 40,
  },
  word: {
    fontSize: 18,
    fontWeight: "normal",
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
});