import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FeedbackModal from '../feedbackModal';

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
    <View style={{backgroundColor: 'white', width: '100%', flex: 1, justifyContent: 'space-between'}}>
      <Text style={styles.header}>Read and respond</Text>
        <View style={styles.contentContainer}>
          <View style={styles.questionContainer}>
            <Image source={require('../assets/TeeTee.png')} style={styles.teetee} />
              <View style={styles.imgBubble}> 
                <Text style={styles.questionText}>{randomQuestion}</Text>
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
