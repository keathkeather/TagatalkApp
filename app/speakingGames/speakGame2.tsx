import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import icons from '../../constants/icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgressBar from '../../components/ProgressBar';
import FeedbackModal from '../feedbackModal';

const SpeakGame2 = () => {
  const [started, setStarted] = useState(false);
  const [results, setResults] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [recognizedText, setRecognizedText] = useState('');
  const [matchFound, setMatchFound] = useState(false);
  const targetText = 'hindi';
  const simulatedCorrect = 'hindi';
  const simulatedWrong = 'oo';
  
  const navigation = useNavigation();
  const handleGoBack = () => {
    navigation.goBack();
  };

  // FOR simulation
  const handleMicPress = () => {
    if (started) {
      // Simulate stopping the recording
      setStarted(false);
      
      // Randomly choose between simulatedText and simulatedWrong
      const recognized = Math.random() < 0.5 ? simulatedCorrect : simulatedWrong;
      setRecognizedText(recognized);

      const matchFound = recognized.toLowerCase() === targetText.toLowerCase();
      setMatchFound(matchFound);
      if (!matchFound) {
        setFeedback('Incorrect. Try again.');
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.backContainer}>
        <TouchableOpacity onPress={handleGoBack}>
          <Image source={icons.modbackarrow} style={styles.backArrow} />
        </TouchableOpacity>
        <View style={styles.progressBarContainer}>
          <ProgressBar value={20} indicatorColor={'#FD9F10'} />
        </View>
      </View>
      <Text style={styles.header}>Complete the conversation.</Text>
      <Text style={styles.subheader}>In this scenario, you haven't eaten yet.</Text>
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <Image source={require('../assets/TeeTeex4.png')} style={styles.icon} />
        </View>
        <View style={styles.formContainer}>
            <Text style={styles.subSubheaderText}>Kumain ka na ba?</Text>
        </View>
        <View style={styles.icon2Container}>
          <Image source={require('../assets/woman.png')} style={styles.icon2} />
        </View>
        <View style={styles.subformContainer}>
            <TouchableOpacity
                style={[styles.micButton, started ? styles.micButtonActive : null]}
                onPress={handleMicPress}
                disabled={matchFound}>
                <Image source={icons.mic2} style={styles.micIcon} />
            </TouchableOpacity>
            <View style={styles.subheaderContainer}>
                <Text style={styles.subheaderText}>
                    {!started ? 'I-tap para magsalita' : 'Magsalita ka...'}
                </Text>
            </View>
        </View>
        <TouchableOpacity
          style={[styles.continueButton, !matchFound ? styles.disabledButton : null]}
          disabled={!matchFound}>
          <Text style={styles.continueText}>CONTINUE</Text>
        </TouchableOpacity>
      </View>
      <FeedbackModal
        visible={isModalVisible}
        feedback={feedback}
        onClose={() => setIsModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default SpeakGame2;

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
    width: '40%',
    padding: 10,
    marginTop: -80,
    marginLeft: 20,
    marginBottom: 30,
    backgroundColor: '#DA9EFF',
    flexDirection: 'column',
    borderRadius: 10,
  },
  subformContainer: {
    width: '35%',
    height: 90,
    padding: 10,
    marginTop: -70,
    marginLeft: 75,
    marginBottom: 320,
    backgroundColor: '#FFB4C4',
    flexDirection: 'column',
    borderRadius: 10,
    alignItems: "center"
  },
  subSubheaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: "#F4F4F4",
  },
  subheaderContainer: {
    alignItems: "center",
  },
  subheaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: "#F4F4F4"
  },
  micIcon: {
    width: 30,
    height: 30,
  },
  icon: {
    width: 100,
    height: 80,
  },
  iconContainer: {
    marginTop: 10,
    marginRight: 260,
    marginBottom: 10,
    alignItems: "center",
  },
  icon2: {
    width: 60,
    height: 60,
  },
  icon2Container: {
    marginTop: 10,
    marginLeft: 300,
    marginBottom: 10,
    alignItems: "center",
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
  subheader: {
    fontSize: 16,
    fontWeight: "normal",
    marginLeft: 20,
    marginTop: 10,
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 55,
  },
  micButton: {
    fontSize: 14,
    borderRadius: 35,
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFB4C4",
  },
  micButtonActive: {
    backgroundColor: '#FFB4C4',
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
});
