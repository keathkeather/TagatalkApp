import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import icons from '../../constants/icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgressBar from '../../components/ProgressBar';
import FeedbackModal from '../feedbackModal';

const WriteGame3 = () => {
    const [typedText, setTypedText] = useState('');
    const [currentItem, setCurrentItem] = useState<{ word: string, correctText: string } | null>(null);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [feedback, setFeedback] = useState<string>('');
  
    const navigation = useNavigation();
    const handleGoBack = () => {
      navigation.goBack();
    };
  
    // Array of words and their correct answers
    const items = [
      { word: 'Good morning', correctText: 'Magandang umaga' },
      { word: 'Good noon', correctText: 'Magandang tanghali' },
      { word: 'Good afternoon', correctText: 'Magandang hapon' },
      { word: 'Good evening', correctText: 'Magandang gabi' },
      // Add more items here...
    ];
  
    useEffect(() => {
      // Select a random item from the array
      const randomItem = items[Math.floor(Math.random() * items.length)];
      setCurrentItem(randomItem);
    }, []);
  
    const handleTextChange = (text: any) => {
      setTypedText(text);
      
    };
  
    const checkAnswer = () => {
      if (!currentItem) return;
  
      if (typedText.trim().toLowerCase() === currentItem.correctText.toLowerCase()) {
        setFeedback('Correct!');
        setIsModalVisible(true);
      } else {
        setFeedback('Incorrect. Try again.');
        setIsModalVisible(true);
      }
    };
  
    return (
      <View style={{backgroundColor: 'white'}}>
      <Text style={styles.header}>Read and Translate.</Text>
          <View style={styles.contentContainer}>
            {currentItem && (
              <Text style={styles.word}>{currentItem.word}</Text>
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
          onClose={() => setIsModalVisible(false)}
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
      height: '60%',
      borderColor: '#D4D4D8',
      borderWidth: 1,
      borderRadius: 20,
      marginTop: 110,
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