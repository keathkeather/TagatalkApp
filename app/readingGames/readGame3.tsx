import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Stack } from 'expo-router'
import { useNavigation } from '@react-navigation/native';
import icons from '../../constants/icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgressBar from '../../components/ProgressBar';
import FeedbackModal from '../feedbackModal';

interface WordMapping {
  [key: string]: string;
}

const ReadGame3 = ({ onContinue } : {onContinue : any}) => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const wordMapping: WordMapping = {
    evening: 'gabi',
    morning: 'umaga',
    noon: 'tanghali',
    afternoon: 'hapon',
  };

  const handleChoicePress = (choice: string) => {
    setSelectedChoice(choice);
  };
  
  const englishWords = Object.keys(wordMapping);
  const filipinoWords = Object.values(wordMapping);
  
  const [askedWord, setAskedWord] = useState<string>(englishWords[Math.floor(Math.random() * englishWords.length)]);
  const [choices, setChoices] = useState<string[]>(filipinoWords);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');

  const handleContinuePress = () => {
    if (selectedChoice === wordMapping[askedWord]) {
      setFeedback('Correct!');
      setIsModalVisible(true);
    } else {
      setFeedback('Incorrect. Try again.');
      setIsModalVisible(true);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    if (feedback === 'Correct!' && onContinue) {
      onContinue();
    }
  };
  
  return (
    <View style={{width: '100%'}}>
      <Text style={styles.header}>How do you say "{askedWord}"?</Text>
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
        <TouchableOpacity 
        style={[styles.checkButton, !selectedChoice && styles.disabledButton]}
        onPress={handleContinuePress}
        disabled={!selectedChoice}
      >
        <Text style={styles.checkText}>CHECK</Text>
      </TouchableOpacity>
      </View>
      
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
  backContainer: {
    height: '5%',
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
  container: {
    color: "white",
  },
  header: {
    fontSize: 25,
    fontWeight: "900",
    alignSelf: 'center',
    marginTop: 20,
  },
  choicesContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  row: {
    flexDirection: 'row',
  },
  choices1: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 25,
    borderRadius: 35,
    width: '43%',
    height: 90,
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
    marginTop: 70,
    backgroundColor: '#FD9F10',
    borderRadius: 30,
    width: '100%',
    height: '8%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,    
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
