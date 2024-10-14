import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Button,
} from 'react-native';
import { Stack, Link, router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { handleCourseTree } from '../redux/game/courseTreeSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { useFocusEffect } from '@react-navigation/native';

const WritingSkillPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [modalVisible, setModalVisible] = useState(false);

  // Refetch course tree whenever the page regains focus
  useFocusEffect(
    useCallback(() => {
      const fetchCourseTree = async () => {
        const resultAction = await dispatch(handleCourseTree('WRITING'));
        if (handleCourseTree.fulfilled.match(resultAction)) {
          console.log('Course Tree fetched successfully');
        } else if (handleCourseTree.rejected.match(resultAction)) {
          console.log('Course Tree fetch failed');
        }
      };

      fetchCourseTree();
    }, [dispatch])
  );
  const courses = useSelector((state: RootState) => state.courseTree.course);
  //console.log(courses)
  const navigation = useNavigation();

  const handleGoBack = () => {
    router.push('/(tabs)');
  };

  const handleLessonClick = (lessonIndex: number, index: number) => {
    if (lessonIndex > 0 && !courses[index].lesson[lessonIndex - 1].isComplete) {
      console.log(lessonIndex);
      setModalVisible(true);
      return false;
    }
    return true;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView overScrollMode="never">
        <View>
          <View style={styles.headerReading}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <Image
                source={require('../../app/assets/backButton.png')}
                style={styles.buttonText}
              />
            </TouchableOpacity>
            <Text style={styles.headerText}> Writing Skills </Text>
          </View>
          <View style={styles.headerContainer}>
            {/* Map through the courses and display the units and lessons */}
            {courses.map((course, index) => (
              <View key={index}>
                <View style={styles.unitBgContainer}>
                  <Image
                    source={require('../../app/assets/writeUnitBg.png')}
                    style={styles.unitBg}
                  />
                  <Text style={styles.textUnitBg}>Unit {course.unitNumber}</Text>
                  <Text style={styles.subtextUnitBg}>{course.unitName}</Text>
                </View>
                {/* Map through the lessons and display them */}
                {course.lesson.map((lesson, lessonIndex) => (
                  <Link
                    key={lessonIndex}
                    href={`/(gameScreens)/writing?lessonIndex=${lessonIndex}&unitIndex=${index}`}
                    style={styles.mainContainer}
                    onPress={(e) => {
                      if (!handleLessonClick(lessonIndex, index)) {
                        e.preventDefault();
                      }
                    }}>
                    <View>
                      <View style={styles.shapeContainer}>
                        {/* Choose cute illustration */}
                        {lessonIndex === 0 && (
                          <Image
                            source={require('../../app/assets/lesson1Logo.png')}
                            style={styles.lessonLogos}
                          />
                        )}
                        {lessonIndex === 1 && (
                          <Image
                            source={require('../../app/assets/lesson2Logo.png')}
                            style={styles.lessonLogos}
                          />
                        )}
                        {lessonIndex === 2 && (
                          <Image
                            source={require('../../app/assets/lesson3Logo.png')}
                            style={styles.lessonLogos}
                          />
                        )}
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
      {/* Modal for warning */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Please complete the previous lesson first.</Text>
            <Button onPress={() => setModalVisible(false)} title="Okay" color="#FD9F10" />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 30,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
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
    marginTop: '7%',
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  subtextUnitBg: {
    width: '70%',
    position: 'absolute',
    marginTop: '18%',
    fontSize: 16,
    fontWeight: 'normal',
    color: 'white',
    textAlign: 'center',
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
    width: '100%',
    height: '100%',
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
    width: 290,
    height: 97,
    marginLeft: 25,
    marginTop: 15,
    borderRadius: 20,
    backgroundColor: 'white',
    position: 'absolute',
    zIndex: -1,
    borderColor: '#EDF0F5',
    borderWidth: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default WritingSkillPage;
