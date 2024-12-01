import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import icons from '../../constants/icons';
import { useNavigation } from '@react-navigation/native';
import ProgressBar from '../../components/ProgressBar';
import { Container } from '../../tamagui.config';
import WriteGame1 from '../writingGames/writeGame1';
import WriteGame2 from '../writingGames/writeGame2';
import WriteGame3 from '../writingGames/writeGame3';
import LessonComplete from './lessonComplete';
import { AppDispatch, RootState } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import FeedbackModal from '../feedbackModal';

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
};

const Writing = () => {
  const dispatch = useDispatch<AppDispatch>();

  const courses = useSelector((state: RootState) => state.courseTree.course);
  const route = useRoute();
  const { lessonIndex, unitIndex } = route.params as { lessonIndex: number, unitIndex: number }; //current lesson clicked by the user
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const totalSteps = 3; // total number of items
  const progressIncrement = 100 / totalSteps; // calculate progress increment
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Access current course using the passed unitIndex
  const currentCourse = courses[unitIndex];
  
  // Access the current lesson
  const currentLesson = currentCourse.lesson[lessonIndex]; // Change this index based on your needs
  if (!currentLesson) {
    console.error(`No lesson found in course.`);
    return null; // or handle the error accordingly
  } else {
    console.log('Current Lesson:', currentLesson);
  }
  
  const [games, setGames] = useState(currentLesson.game || []);

  const handleGoBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    // Shuffle games when component mounts
    setGames(prevGames => shuffleArray([...prevGames]));

    return () => {
      // Reset state when component is unmounted
      setCurrentStep(0);
      setProgress(0);
      setWrongAttempts(0);
    };
  }, []);

  // Debugging logs
  console.log('Route Params:', route.params);
  console.log('Courses:', courses);
  console.log('Unit Index:', unitIndex);
  console.log('Lesson Index:', lessonIndex);

  const handleContinue = () => {
    setCurrentStep(prevStep => prevStep + 1);
    setProgress(prevProgress => prevProgress + progressIncrement);
    setWrongAttempts(0);
  };
  
  const handleWrongAttempt = () => {
    setWrongAttempts(prevAttempts => {
      if (prevAttempts + 1 >= 5) {
        setFeedback('Woopsie Daisy!');
        setIsModalVisible(true);
        return 0;
      }
      return prevAttempts + 1;
    });
  };
  
  const handleModalClose = () => {
    if (feedback === 'Correct!' || feedback === 'Woopsie Daisy!') {
      handleContinue();
    }
    setIsModalVisible(false);
  };
  
  const renderCurrentGame = () => {
    const currentGame = games[currentStep]; // Get the current game based on step
  
    if (!currentGame) {
      return <LessonComplete lessonId={currentLesson.id} />; // No more games to play
    }
  
    console.log('Current Game:', currentGame);
  
    switch (currentGame.gameType) {
      case 1:
        console.log(`Current Question:${Number(currentStep) + 1}`);
        console.log(`Game type: ${currentGame.id} Lesson: ${Number(lessonIndex) + 1} Unit: ${Number(unitIndex) + 1}`); //! this is for debugging purposes only
        return <WriteGame1 gameId={currentGame.id} onContinue={handleContinue} onWrongAttempt={handleWrongAttempt} />;
      case 2:
        console.log(`${Number(currentStep) + 1}`);
        console.log(`Game type: ${currentGame.id} Lesson: ${Number(lessonIndex) + 1} Unit: ${Number(unitIndex) + 1}`);
        return <WriteGame2 gameId={currentGame.id} onContinue={handleContinue} onWrongAttempt={handleWrongAttempt} />;
      case 3:
        console.log(`${Number(currentStep) + 1}`);
        console.log(`Game type: ${currentGame.gameType} Lesson: ${Number(lessonIndex) + 1} Unit: ${Number(unitIndex) + 1}`);
        return <WriteGame3 gameId={currentGame.id} onContinue={handleContinue} onWrongAttempt={handleWrongAttempt} />;
      default:
        return <LessonComplete lessonId={currentLesson.id} />;
    }
  };
  
  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleGoBack}>
          <Image source={icons.modbackarrow} style={styles.backArrow} />
        </TouchableOpacity>
        <View style={styles.progressBarContainer}>
          <ProgressBar value={progress} indicatorColor={'#FD9F10'} />
        </View>
      </View>
      <Container style={{
        width: '100%',
        height: '100%',
      }}>
        {renderCurrentGame()}
        <FeedbackModal
          visible={isModalVisible}
          feedback={feedback}
          onClose={handleModalClose}
        />
      </Container>
    </SafeAreaView>
  );
};

export default Writing;

const styles = StyleSheet.create({
  backArrow: {
    resizeMode: 'cover',
    width: 34,
    height: 34,
    borderColor: 'white',
    borderWidth: 1,
  },
  headerContainer: {
    height: '5%',
    marginTop: 25,
    flexDirection: 'row',
    width: '90%',
    marginLeft: 15,
  },
  progressBarContainer: {
    marginTop: 10,
    marginLeft: 20,
    alignSelf: 'center',
    width: '80%',
    height: '100%',
  },
  buttonContainer: {
    width: '90%',
    alignSelf: 'center',
    margin: 20,
  },
});