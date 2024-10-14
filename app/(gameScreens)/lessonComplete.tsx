import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { addUserProgress } from '~/components/userProgress';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Dispatch } from 'redux';

const LessonComplete = ({ lessonId }: { lessonId: string }) => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0); // Points for the first completion
  const [isLessonCompleted, setLessonCompleted] = useState(false); // State to determine if modal shows points or retake message

  const courses = useSelector((state: RootState) => state.courseTree.course);
  const dispatch = useDispatch<Dispatch>();

  // Check if the lesson is complete
  const isComplete = courses
    .flatMap(course => course.lesson)
    .find(lesson => lesson.id === lessonId)?.isComplete;

    console.log(isComplete);
  const handleGoBack = () => {
    if (isComplete) {
      // Show modal for retake completed lessons
      setLessonCompleted(true);
      setModalVisible(true);
    } else {
      // Show points earned modal for new lesson completion
      setLessonCompleted(false);
      setModalVisible(true);
      const points = 100; 
      setEarnedPoints(points);
      addUserProgress(lessonId);
    }
  };

  const handleCloseModal = () => {
    // Close modal and navigate back
    setModalVisible(false);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.questionContainer}>
        <Image source={require('../../app/assets/TeeTeex4.png')} style={styles.teetee} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Lesson Complete!</Text>
        <Text style={styles.subtitle}>Way to go, kaibigan! You're making great strides!</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for showing earned points or retake completion message */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {isLessonCompleted ? (
              <>
                <Text style={styles.modalTitle}>Good Job!</Text>
                <Text style={styles.modalSubtitle}>You did it again!</Text>
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>Points Earned</Text>
                <Text style={styles.modalPoints}>{earnedPoints} Points!</Text>
              </>
            )}
            <TouchableOpacity style={styles.modalButton} onPress={handleCloseModal}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teetee: {
    width: '35%',
    height: 130,
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FD9F10',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#A5A5A5',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: '#FD9F10',
    borderRadius: 30,
    width: '100%',
    height: '7%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#FD9F10',
  },
  modalSubtitle: {
    fontSize: 20,
    marginBottom: 20,
    color: '#333',
  },
  modalPoints: {
    fontSize: 22,
    marginBottom: 20,
    color: '#333',
  },
  modalButton: {
    backgroundColor: '#FD9F10',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default LessonComplete;