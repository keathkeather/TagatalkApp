import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, {useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack } from 'expo-router'
import icons from '../../constants/icons';
import { useNavigation } from '@react-navigation/native';
import ProgressBar from '../../components/ProgressBar'; 
import { Container } from '../../tamagui.config';
import WriteGame1 from '../writingGames/writeGame1';
import WriteGame2 from '../writingGames/writeGame2';
import WriteGame3 from '../writingGames/writeGame3';
import LessonComplete from './lessonComplete';

const Writing = () => {
    const navigation = useNavigation();
    const [currentStep, setCurrentStep] = useState(1);
    const [progress, setProgress] = useState(0);
    const totalSteps = 3; // total number of items
    const progressIncrement = 100 / totalSteps; // calculate progress increment
    
    const handleGoBack = () => {
        navigation.goBack();
    };
    
    const handleContinue = () => {
        setCurrentStep(prevStep => prevStep + 1);
        setProgress(prevProgress => prevProgress + progressIncrement);
      };
    
      const renderCurrentGame = () => {
        switch (currentStep) {
          case 1:
            console.log(currentStep);
            return <WriteGame1 onContinue={handleContinue} />;
          case 2:
            console.log(currentStep);
            return <WriteGame2 onContinue={handleContinue} />;
          case 3:
            console.log(currentStep);
            return <WriteGame3 onContinue={handleContinue} />;
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
                   {/* //TODO: Map the 3 gametypes of Writing skill here (WriteGame1, WriteGame2, WriteGame3) */}
                   {renderCurrentGame()}
            </Container>
        </SafeAreaView>
    )
}

export default Writing

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