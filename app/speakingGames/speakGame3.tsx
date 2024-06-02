import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Voice from '@react-native-voice/voice';
import { Stack } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import icons from '../../constants/icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgressBar from '../../components/ProgressBar';
import FeedbackModal from '../feedbackModal';

const SpeakGame3 = ({onContinue} : {onContinue : any})  => {
  const [started, setStarted] = useState(false);
  const [results, setResults] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [recognizedText, setRecognizedText] = useState('');
  const [matchFound, setMatchFound] = useState(false);
  const [currentItem, setCurrentItem] = useState<{ image: any, correctText: string } | null>(null)
  const [targetText, setTargetText] = useState('');
  const simulatedWrong = 'Leche flan';
  
  const navigation = useNavigation();
  const handleGoBack = () => {
    navigation.goBack();
  };

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
    setTargetText(randomItem.correctText);

  }, []);
  
  // FOR simulation
  const handleMicPress = () => {
    if (!currentItem) return;
    if (started) {
      // Simulate stopping the recording
      setStarted(false);
      
      // Randomly choose between simulatedText and simulatedWrong
      const recognized = Math.random() < 0.5 ? currentItem.correctText : simulatedWrong;
      setRecognizedText(recognized);

      const matchFound = recognized.toLowerCase() === targetText.toLowerCase();
      setMatchFound(matchFound);
      if (!matchFound) {
        setFeedback('Woopsie Daisy!');
      } else {
        setFeedback('Correct!');
      }
      setIsModalVisible(true);
    } else {
      // Simulate starting the recording
      setStarted(true);
      setRecognizedText('');
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
    <View style={{backgroundColor: 'white', flex: 1, justifyContent: 'space-between',}}>
      <Text style={styles.header}>Guess the image below.</Text>
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
            {currentItem && (
            <Image source={currentItem.image} style={styles.icon} />
            )}
        </View>
        <TouchableOpacity
          style={[styles.micButton, started ? styles.micButtonActive : null]}
          onPress={handleMicPress}
          disabled={matchFound}>
          <Image source={icons.mic} style={styles.micIcon} />
        </TouchableOpacity>
        <View style={styles.subheaderContainer}>
          <Text style={styles.subheaderText}>
            {!started ? 'I-tap para magsalita' : 'Magsalita ka...'}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.continueButton, !matchFound ? styles.disabledButton : null]}
          disabled={!matchFound}>
          <Text style={styles.continueText}>CHECK</Text>
        </TouchableOpacity>
      </View>
      <FeedbackModal
        visible={isModalVisible}
        feedback={feedback}
        onClose={handleModalClose}
      />
    </View>
  );
};

export default SpeakGame3;

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
    width: 43,
    height: 43,
  },
  formContainer: {
    width: '48%',
    height: 100,
    padding: 18,
    marginTop: -250,
    marginLeft: 60,
    marginBottom: 210,
    backgroundColor: '#ffffff',
    borderColor: '#D0D5DD',
    borderWidth: 1,
    flexDirection: 'column',
    borderRadius: 20,
  },
  subSubheaderContainer: {
    marginBottom: 30,
  },
  subSubheaderText: {
    fontSize: 15,
    fontWeight: '600',
    color: "#344054",
  },
  subheaderContainer: {
    marginBottom: 10,
    alignItems: "center",
  },
  subheaderText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: "#D0D5DD",
    marginBottom: 80,
  },
  micIcon: {
    width: 70,
    height: 70,
  },
  icon: {
    width: 235,
    height: 230,
    resizeMode: 'contain',
  },
  iconContainer: {
    marginTop: 10,
    marginBottom: 75,
    alignItems: "center",
  },
  container: {
    color: "white",
  },
  header: {
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: 20,
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 55,
  },
  micButton: {
    fontSize: 25,
    marginTop: 10,
    marginLeft: 20,
    borderRadius: 35,
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  micButtonActive: {
    backgroundColor: '#ffffff',
  },
  choicesText: {
    fontSize: 23,
    fontWeight: "600",
    color: "white",
  },
  textBox: {
    width: 388,
    height: 300,
    borderColor: '#D4D4D8',
    borderWidth: 1,
    borderRadius: 20,
    marginTop: 70,
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
    height: '8%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    marginBottom: 20,
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
});
