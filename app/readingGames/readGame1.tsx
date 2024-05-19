import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Stack, Link } from 'expo-router';
import icons from '../../constants/icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FeedbackModal from '../feedbackModal';
import ProgressBar from '../../components/ProgressBar';

const GameScreen = ({onContinue} : {onContinue : any}) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [continueClicked, setContinueClicked] = useState<boolean>(false);
  const [randomQuestion, setRandomQuestion] = useState<string>("");
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const words: string[] = ["umaga", "tanghali", "gabi"];
  const questions = [
    "Magandang gabi, Anna! Matutulog ka na ba?",
    "Magandang umaga, Anna! Kumain ka na ba?",
    "Magandang tanghali, Anna! Kumain ka na ba?",
    // Add more questions as needed
  ];

  useEffect(() => {
    // Select a random question when the component mounts
    const randomIndex = Math.floor(Math.random() * questions.length);
    setRandomQuestion(questions[randomIndex]);
  }, []);

  const checkAnswer = () => {
    // Regular expression to match the time of day phrase
    const timeOfDayRegex = /Magandang (umaga|tanghali|gabi)/;
    const match = randomQuestion.match(timeOfDayRegex);
  
    // Extract the time of day from the matched result
    const timeOfDay = match ? match[1] : "";
  
    // Compare the selected word with the correct answer based on the time of day
    if (selectedWord === timeOfDay) {
      setFeedback("Correct!"); 
    } else {
      setFeedback("Incorrect!");
    }
    setContinueClicked(true);
  };
  

  const handleWordPress = (word: string) => {
    if (!continueClicked) {
      setSelectedWord(prevWord => (prevWord === word ? null : word));
    }
  };

  const handleContinue = () => {
    checkAnswer();
    setTimeout(() => {
      setFeedback(null);
      setSelectedWord(null);
      setContinueClicked(false);
      if (onContinue) {
        onContinue();
      }
    }, 1500);
  };

  return (
    <View>
      <Text style={styles.header}>Read and respond</Text>
      <View style={styles.imgHeader}> 
        <Image source={require('../assets/TeeTee.png')} />
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{randomQuestion}</Text>
        </View>
          <View style={styles.imgBubble}> 
            <Image source={require('../assets/textbubble.png')} />
          </View>
      </View>
      <Text style={styles.subQuestionText}>Anong oras na ngayon base sa sinabi TeeTee?</Text>
        <View style={styles.wordContainer}>
          {words.map((word, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.wordButton,
                selectedWord === word && styles.selectedWordButton
              ]}
              onPress={() => handleWordPress(word)}
              disabled={continueClicked}
            > 
              <Text style={styles.wordText}>{word}</Text>
            </TouchableOpacity>
          ))}
            <TouchableOpacity 
              style={[
                styles.continueButton,
                continueClicked && styles.continueButtonDisabled,
                selectedWord === null && styles.continueButtonDisabled,
              ]}
              onPress={selectedWord !== null ? handleContinue : undefined}
              disabled={continueClicked || selectedWord === null}
            >
              <Text style={styles.continueText}>CHECK</Text>
            </TouchableOpacity>
        </View>
        {/* Render the modal */}
      <FeedbackModal
        visible={feedback !== null}
        feedback={feedback}
        onClose={() => setFeedback(null)}
      />
    </View>  
  );
};

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
    width: 38,
    height: 38,
  },
  header: {
    fontSize: 25,
    fontWeight: "900",
    marginLeft: 20,
    marginTop: 20,
  },
  imgHeader: {
    marginLeft: 25,
    flexDirection: 'row',
  },
  imgBubble: {
    position: 'absolute',
    marginLeft: 125,
    marginTop: 25,
    zIndex: -1,
  },
  questionContainer: {
    width: '50%',
    marginLeft: 30,
    marginTop: 40,
    flexWrap: 'wrap',
  },
  questionText: {
    width: '90%',
    lineHeight: 25,
    fontSize: 15,
    fontWeight: "bold",
    color: "#F4F4F4", //change to #F4F4F4 if there is text bubble
  },
  subQuestionText: {
    marginTop: 20,
    fontSize: 15,
    fontWeight: "bold",
    color: "black", //change to #F4F4F4 if there is text bubble
    textAlign: "center",
    marginBottom: 15,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedback: {
    fontSize: 20,
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
    marginTop: 50,
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
