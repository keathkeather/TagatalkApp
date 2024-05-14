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

const ReadGame3 = () => {
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
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Stack.Screen options={{headerShown: false }} />
      <View style={styles.backContainer}>
        <TouchableOpacity onPress={handleGoBack}>
          <Image source={icons.modbackarrow} style={styles.backArrow} />
        </TouchableOpacity>
        <View style={styles.progressBarContainer}>
          <ProgressBar value={20} indicatorColor={'#FD9F10'}/>
        </View>
      </View>
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
      </View>
      <TouchableOpacity 
        style={[styles.continueButton, !selectedChoice && styles.disabledButton]}
        onPress={handleContinuePress}
        disabled={!selectedChoice}
      >
        <Text style={styles.continueText}>CONTINUE</Text>
      </TouchableOpacity>
      <FeedbackModal visible={isModalVisible}
        feedback={feedback}
        onClose={() => setIsModalVisible(false)}
      />
    </SafeAreaView>
  )
}

export default ReadGame3

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
  container: {
    color: "white",
  },
  header: {
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 40,
  },
  choicesContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 55,
  },
  row: {
    flexDirection: 'row',
  },
  choices1: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 25,
    marginLeft: 20,
    borderRadius: 35,
    width: 180,
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
   continueButton: {
     marginTop: 100,
     marginLeft: 20,
     backgroundColor: '#FD9F10',
     borderRadius: 30,
     width: 390,
     height: 48,
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