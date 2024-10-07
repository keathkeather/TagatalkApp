import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, {useState, useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack } from 'expo-router'
import icons from '../../constants/icons';
import { useNavigation } from '@react-navigation/native';
import ProgressBar from '../../components/ProgressBar'; 
import { Container } from '../../tamagui.config';
import ReadGame2 from '../readingGames/readGame2';
import ReadGame3 from '../readingGames/readGame3';
import ReadGame1 from '../readingGames/readGame1';
import LessonComplete from './lessonComplete';
import { AppDispatch, RootState } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/native';


  const Reading = () => {
    const dispatch = useDispatch<AppDispatch>();

    const courses = useSelector((state: RootState) => state.courseTree.course);
    const route = useRoute();
    const { lessonIndex, unitIndex } = route.params as { lessonIndex: number, unitIndex: number }; //current lesson clicked by the user
    const navigation = useNavigation();
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);
    const totalSteps = 3; // total number of items
    const progressIncrement = 100 / totalSteps; // calculate progress increment

    useEffect(() => {
      return () => {
          // Reset state when component is unmounted
          setCurrentStep(1);
          setProgress(0);
        };
    }, []);

    const handleGoBack = () => {
      navigation.goBack();
    };

    //access current course using the passed unitIndex 
    const currentCourse = courses[unitIndex];

    // Access the current lesson
    const currentLesson = currentCourse.lesson[lessonIndex]; // Change this index based on your needs
    if (!currentLesson) {
        console.error(`No lesson found in course.`);
        return null; // or handle the error accordingly
    } else {
        console.log(currentLesson);
    }

    // Access the games safely - debbug purposes only (//!will delete this later)
    const games = currentLesson.game || []; 
    // if (games.length > 0) {
    //     console.log(`Game Length: ${games.length}`); // Access game type
    // } else {
    //     console.log("No games available for the current lesson.");
    // }

    const handleContinue = () => {
      setCurrentStep(prevStep => prevStep + 1);
      setProgress(prevProgress => prevProgress + progressIncrement);
    };
    
    const renderCurrentGame = () => {
      const currentGame = games[currentStep]; // Get the current game based on step

      if (!currentGame) {
        return <LessonComplete />; // No more games to play
      }

      switch (currentGame.gameType) {
        case 1:
          console.log(`Current Question:${Number(currentStep) + 1}`);
          console.log(`Game type: ${currentGame.id} Lesson: ${Number(lessonIndex) + 1} Unit: ${Number(unitIndex) + 1}`); //! this is for debugging purposes only
          return <ReadGame1 gameId={currentGame.id} onContinue={handleContinue} />;
        case 2:
          console.log(`${Number(currentStep) + 1}`);
          console.log(`Game type: ${currentGame.id} Lesson: ${Number(lessonIndex) + 1} Unit: ${Number(unitIndex) + 1}`);
          return <ReadGame2 gameId={currentGame.id}  onContinue={handleContinue} />;
        case 3:
          console.log(`${Number(currentStep) + 1}`);
          console.log(`Game type: ${currentGame.gameType} Lesson: ${Number(lessonIndex) + 1} Unit: ${Number(unitIndex) + 1}`);
          return <ReadGame3  gameId={currentGame.id}  onContinue={handleContinue}/>;
        default:
          return <LessonComplete/>;
      }
    };
    
    return (
        <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
            <Stack.Screen options={{headerShown: false }} />
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={handleGoBack}>
                    <Image source={icons.modbackarrow} style={styles.backArrow} />
                </TouchableOpacity>
                <View style={styles.progressBarContainer}>
                    <ProgressBar value={progress} indicatorColor={'#FD9F10'}/>
                </View>              
            </View>
            <Container style={{
                width: '100%',
                height: '100%',
            }}>
                   {/* Map the 3 gametypes of reading skill here/} */ }
                   {renderCurrentGame()}
            </Container>
        </SafeAreaView>
    )
}

export default Reading

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
})