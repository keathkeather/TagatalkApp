import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, Link } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { handleCourseTree } from '../redux/game/courseTreeSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';

interface Course {
  gameUnit: string;
  gameUnitNumber: number;
  gameLessonNumber: number;
  gameLesson: string;
  isCompleted: boolean;
}

interface Unit {
  gameUnit: string;
  gameUnitNumber: number;
  lessons: {
      gameLessonNumber: number;
      gameLesson: string;
      isCompleted: boolean;
  }[];
}

const WritingSkillPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        const fetchCourseTree = async () => {
          const resultAction = await dispatch(handleCourseTree('Reading'));
          if(handleCourseTree.fulfilled.match(resultAction)){
              console.log("Course Tree fetched successfully");
          }
          else if(handleCourseTree.rejected.match(resultAction)){
              console.log("Course Tree fetch failed");
          }
        };
    
        fetchCourseTree();
      }, [])

    const courses = useSelector((state: RootState) => state.courseTree.course);
    console.log(courses)
    const navigation = useNavigation();

    const handleGoBack = () => {
      navigation.goBack();
    };

    // Group courses by gameUnitNumber and gameUnit
    const unitLessonsMap: { [key: string]: Unit } = {};

    courses.forEach((course: Course) => {
      const unitKey = `${course.gameUnitNumber}-${course.gameUnit}`;
      if (!unitLessonsMap[unitKey]) {
          unitLessonsMap[unitKey] = {
              gameUnit: course.gameUnit,
              gameUnitNumber: course.gameUnitNumber,
              lessons: []
          };
      }
      const existingLesson = unitLessonsMap[unitKey].lessons.find(
          lesson => lesson.gameLessonNumber === course.gameLessonNumber
      );
      if (!existingLesson) {
          unitLessonsMap[unitKey].lessons.push({
              gameLessonNumber: course.gameLessonNumber,
              gameLesson: course.gameLesson,
              isCompleted: course.isCompleted
          });
      }
  });

    // Convert unitLessonsMap to an array for mapping
    const uniqueCourses = Object.values(unitLessonsMap);
    

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <Stack.Screen options={{headerShown: false }} />
        <ScrollView overScrollMode="never">
        <View>
            <View style={styles.headerReading}>
                <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                    <Image source={require('../../app/assets/backButton.png')} style={styles.buttonText} />
                </TouchableOpacity>
                <Text style={styles.headerText}> Writing Skills </Text>
            </View>
            <View style={styles.headerContainer}>
            {/* Map through the unique courses and display the units and lessons */}
            {uniqueCourses.map((course, index) => (
                        <View key={index}>
                            <View style={styles.unitBgContainer}>
                                <Image source={require('../../app/assets/writeUnitBg.png')} style={styles.unitBg} />
                                <Text style={styles.textUnitBg}>Unit {course.gameUnitNumber}</Text>
                                <Text style={styles.subtextUnitBg}>{course.gameUnit}</Text>
                            </View>
                            {/* Map through the lessons and display them */}
                            {course.lessons.map((lesson, index) => (
                              <Link 
                              key={index} 
                              href={'/(gameScreens)/writing'}
                              style={styles.mainContainer}>
                                <View>
                         
                                    <View style={styles.shapeContainer}>
                                     {/* Choose cute illus */}
                                            {index === 0 && <Image source={require('../../app/assets/lesson1Logo.png')} style={styles.lessonLogos} />}
                                            {index === 1 && <Image source={require('../../app/assets/lesson2Logo.png')} style={styles.lessonLogos} />}
                                            {index === 2 && <Image source={require('../../app/assets/lesson3Logo.png')} style={styles.lessonLogos} />}
                                      
                                        <View style={styles.innerContainer} />
                                    </View>
                                    <View style={styles.rectangleContainer}>
                                        <Text style={styles.subtextLesson}>Lesson {lesson.gameLessonNumber}</Text>
                                        <Text style={styles.textLesson}>{lesson.gameLesson}</Text>
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
      backgroundColor: '#7AD635', // color inside the circle
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

export default WritingSkillPage