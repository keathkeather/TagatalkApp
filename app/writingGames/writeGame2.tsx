import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import FeedbackModal from '../feedbackModal';

const WriteGame2 = () => {
    const [typedText, setTypedText] = useState('');
    const [currentItem, setCurrentItem] = useState<{ scenario: string, question: string, correctText: string } | null>(null);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [feedback, setFeedback] = useState<string>('');
  
    // Array of scenarios & questions and their correct answers
    const items = [
      {
        scenario: "In this scenario, you already ate.",
        question: 'Kumain ka na ba?',
        correctText: 'Opo',
      },
      {
        scenario: "In this scenario, you didn't eat yet.",
        question: 'Kumain ka na ba?',
        correctText: 'Hindi pa po',
      },
      {
        scenario: "In this scenario, you are tired.",
        question: 'Pagod ka na ba?',
        correctText: 'Opo',
      },
      {
        scenario: "In this scenario, you don't love her.",
        question: 'Mahal mo ba si Alice?',
        correctText: 'Hindi po',
      },
      // Add more items here...
    ];
  
    useEffect(() => {
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
                onClose={() => setIsModalVisible(false)}
              />
      </View>
    );
  };
export default WriteGame2

const styles = StyleSheet.create({
    questionContainer: {
      marginTop: 70,
      flexDirection: 'row',
      alignItems: 'center',
    },
    teetee: {
      width: 130,
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
})