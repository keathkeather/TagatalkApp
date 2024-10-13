import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, Link, router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { handleCourseTree } from '../redux/game/courseTreeSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';

interface Course {
    unitName: string;
    unitNumber: number;
    lesson: Lesson[];   
}

interface Lesson {
    id: string;
    lessonNumber: number;
    lessonName: string;
}

const SpeakingSkillPage = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const fetchCourseTree = async () => {
          const resultAction = await dispatch(handleCourseTree('SPEAKING'));
          if(handleCourseTree.fulfilled.match(resultAction)){
              console.log("Course Tree fetched successfully");
          }
          else if(handleCourseTree.rejected.match(resultAction)){
              console.log("Course Tree fetch failed");
          }
        };
    
        fetchCourseTree();
      }, [dispatch])

    const courses = useSelector((state: RootState) => state.courseTree.course);
    console.log(courses)
    const navigation = useNavigation();

    const handleGoBack = () => {
        router.push('/(tabs)');
    };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <Stack.Screen options={{headerShown: false }} />
        <ScrollView overScrollMode="never">
        <View>
            <View style={styles.headerReading}>
                <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                    <Image source={require('../../app/assets/backButton.png')} style={styles.buttonText} />
                </TouchableOpacity>
                <Text style={styles.headerText}> Speaking Skills </Text>
            </View>
                <View style={styles.headerContainer}>
                        {/* Map through the courses and display the units and lessons */}
                        {courses.map((course, index) => (
                            <View key={index}>
                                <View style={styles.unitBgContainer}>
                                    <Image source={require('../../app/assets/speakUnitBg.png')} style={styles.unitBg} />
                                    <Text style={styles.textUnitBg}>Unit {course.unitNumber}</Text>
                                    <Text style={styles.subtextUnitBg}>{course.unitName}</Text>
                                </View>
                                 {/* Map through the lessons and display them */}
                                 {course.lesson.map((lesson, lessonIndex) => (
                                    <Link
                                        key={lessonIndex}
                                        href={`/(gameScreens)/speaking?lessonIndex=${lessonIndex}&unitIndex=${index}`}
                                        style={styles.mainContainer}
                                    >
                                        <View>
                                            <View style={styles.shapeContainer}>
                                                {/* Choose cute illustration */}
                                                {lessonIndex === 0 && <Image source={require('../../app/assets/lesson1Logo.png')} style={styles.lessonLogos} />}
                                                {lessonIndex === 1 && <Image source={require('../../app/assets/lesson2Logo.png')} style={styles.lessonLogos} />}
                                                {lessonIndex === 2 && <Image source={require('../../app/assets/lesson3Logo.png')} style={styles.lessonLogos} />}
                                                <View style={styles.innerContainer} />
                                            </View>
                                            <View style={styles.rectangleContainer}>
                                                <Text style={styles.subtextLesson}>Lesson {lesson.lessonNumber}</Text>
                                                <Text style={styles.textLesson}>{lesson.lessonName}</Text>
                                            </View>
                                        </View>
                                    </Link>
                                ))}
                            </View>
                        ))}
                </View>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
      marginTop: 30,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    position: 'absolute',
    marginTop: 13,
    marginLeft: 60,
    color: 'white',
  },
  headerReading: {
      backgroundColor: '#FD9F10',
      width: 430,
      height: 50,
  },
  backButton: {
      marginLeft: 15,
      position: 'absolute',
      marginTop: 12,
  },
  buttonText: {
      width: 28,
      height: 28,
  },
  unitBgContainer: {
      alignItems: 'center',
      marginBottom: 25,
  },
  unitBg: { 
      width: '90%',
      height: 130,
      resizeMode: 'contain',
  },
  textUnitBg: {
      position: 'absolute',
      marginTop: 15,
      fontSize: 30,
      fontWeight: 'bold',
      color: 'white',
  },
  subtextUnitBg: {
      position: 'absolute',
      marginTop: 60,
      fontSize: 14,
      fontWeight: 'normal',
      color: 'white',
  },
  subtextLesson: {
      position: 'absolute',
      fontSize: 14,
      fontWeight: 'normal',
      color: '#A5A5A5',
      marginLeft: 105,
      marginTop: 15,
      width: 150,
  },
  textLesson: {
      position: 'absolute',
      fontSize: 16,
      fontWeight: 'bold',
      color: '#545F71',
      marginLeft: 105,
      marginTop: 35,
  },
  lessonLogos: {
      width: 48,
      height: 48,
      position: 'absolute',
      zIndex: 1,
  },
  shapeContainer: {
      width: 126,
      height: 126,
      borderRadius: 63, // half of w & h
      borderWidth: 8,
      borderColor: '#EDF0F5', // color of border
      backgroundColor: '#FFFFFF', // color between border & circle
      alignItems: 'center',
      justifyContent: 'center',
    },
    innerContainer: {
      width: 100,
      height: 100, 
      borderRadius: 50, // half of w & h
      backgroundColor: '#9C40F9', // color inside the circle
    },
    mainContainer: {
      marginBottom: 25,
      width: '90%',
      alignSelf: 'center',
      marginLeft: 28,
    },
    rectangleContainer: {
      width: 295,
      height: 97,
      marginLeft: 36,
      marginTop: 15,
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
      backgroundColor: 'white',
      position: 'absolute',
      zIndex: -1,
      borderColor: '#EDF0F5',
      borderWidth: 2,
    },
});

export default SpeakingSkillPage