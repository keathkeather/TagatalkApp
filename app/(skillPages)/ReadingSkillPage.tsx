import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { Stack, Link } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ReadingSkillPage = () => {
    const navigation = useNavigation();

    const handleGoBack = () => {
      navigation.goBack();
    };

    const unit1Lessons = [
      {
        number: 'Lesson 1',
        title: 'Greetings and Introductions',
        logo: require('../../app/assets/lesson1Logo.png'),
      },
      {
        number: 'Lesson 2',
        title: 'Basic\nDialogues',
        logo: require('../../app/assets/lesson2Logo.png'),
      },
      {
        number: 'Lesson 3',
        title: 'Requests and\nAsking for Help',
        logo: require('../../app/assets/lesson3Logo.png'),
      },
      // Add more lessons as needed
    ];

    const unit2Lessons = [
      {
        number: 'Lesson 1',
        title: 'Vocabulary for Daily\nActivities',
        logo: require('../../app/assets/lesson1Logo.png'),
      },
      {
        number: 'Lesson 2',
        title: 'Talk About Daily\nSchedules',
        logo: require('../../app/assets/lesson2Logo.png'),
      },
      {
        number: 'Lesson 3',
        title: 'Household Chores\nand Responsibilities',
        logo: require('../../app/assets/lesson3Logo.png'),
      },
      // Add more lessons as needed
    ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <Stack.Screen options={{headerShown: false }} />
        <ScrollView overScrollMode="never">
        <View>
            <View style={styles.headerReading}>
                <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                    <Image source={require('../../app/assets/backButton.png')} style={styles.buttonText} />
                </TouchableOpacity>
                <Text style={styles.headerText}> Reading Skills </Text>
            </View>
            <View style={styles.headerContainer}>
                <View style={styles.unitBgContainer}>
                    <Image source={require('../../app/assets/readUnitBg.png')} style={styles.unitBg} />
                    <Text style={styles.textUnitBg}> Unit 1 </Text>
                    <Text style={styles.subtextUnitBg}> Let's learn basic conversations!</Text>
                </View>
                {unit1Lessons.map((lesson, index) => (
                <Link key={index} href={'/readGame1'} style={styles.mainContainer}>
                  <View>
                    <View style={styles.shapeContainer}>
                        <Image source={lesson.logo} style={styles.lessonLogos} />
                    <View style={styles.innerContainer} />
                    </View>
                    <View style={styles.rectangleContainer}>
                        <Text style={styles.subtextLesson}>{lesson.number}</Text> 
                        <Text style={styles.textLesson}>{lesson.title}</Text> 
                    </View>
                  </View>
                </Link>
                ))}
                <View style={styles.unitBgContainer}>
                    <Image source={require('../../app/assets/readUnitBg.png')} style={styles.unitBg} />
                    <Text style={styles.textUnitBg}> Unit 2 </Text>
                    <Text style={styles.subtextUnitBg}> Try talking about your daily act!</Text>
                </View>
                {unit2Lessons.map((lesson, index) => (
                  <Link href={'/readGame1'} style={styles.mainContainer}>
                  <View key={index}>
                    <View style={styles.shapeContainer}>
                        <Image source={lesson.logo} style={styles.lessonLogos} />
                    <View style={styles.innerContainer} />
                    </View>
                    <View style={styles.rectangleContainer}>
                        <Text style={styles.subtextLesson}>{lesson.number}</Text> 
                        <Text style={styles.textLesson}>{lesson.title}</Text> 
                    </View>
                  </View>
                </Link>
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
        width: 371,
        height: 130,
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
        backgroundColor: '#FA643F', // color inside the circle
      },
      mainContainer: {
        marginLeft: 36,
        marginBottom: 25,
      },
      rectangleContainer: {
        width: 325,
        height: 97,
        marginLeft: 36,
        marginTop: 15,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        backgroundColor: 'white',
        zIndex: -1,
        position: 'absolute',
        borderColor: '#EDF0F5',
        borderWidth: 2,
      },
});

export default ReadingSkillPage