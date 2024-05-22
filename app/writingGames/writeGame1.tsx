import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import icons from '../../constants/icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgressBar from '../../components/ProgressBar';
import FeedbackModal from '../feedbackModal';

const WriteGame1 = () => {
    const [typedText, setTypedText] = useState('');
    const [currentItem, setCurrentItem] = useState<{ image: any, correctText: string } | null>(null);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [feedback, setFeedback] = useState<string>('');
  
    // Array of images and their correct answers
    const items = [
      { image: require('../assets/palabok.png'), correctText: 'Palabok' },
      { image: require('../assets/bibingka.png'), correctText: 'Bibingka' },
      { image: require('../assets/lechon.jpg'), correctText: 'Lechon Baboy' },
      { image: require('../assets/halohalo.jpg'), correctText: 'Halohalo' },
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
    <View style={{backgroundColor: 'white', flex: 1, justifyContent: 'space-between'}}>
      <Text style={styles.header}>Write what you see.</Text>
          <View style={styles.contentContainer}>
            {currentItem && (
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
          onClose={() => setIsModalVisible(false)}
        />
        </View>
    );
  };
export default WriteGame1

const styles = StyleSheet.create({
    image: {
      marginTop: 25,
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
      alignItems: 'center',
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
  })