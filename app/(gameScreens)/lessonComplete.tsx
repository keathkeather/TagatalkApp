import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

const LessonComplete = () => {
  const navigation = useNavigation();


  const handleGoBack = () => {
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
});

export default LessonComplete;