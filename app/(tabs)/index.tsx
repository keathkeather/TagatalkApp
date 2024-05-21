import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import PagerView from 'react-native-pager-view';
import {useUser} from '../context/UserContext'
import { User } from '~/components/user';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const pages = [
  {
    header: "Reading Skills",
    subheader: "Let's start reading Filipino like a pro!",
    image: require('../assets/readLogo.png'),
    imageRectangle: require('../assets/redRectangle.png'),
  },
  {
    header: "Speaking Skills",
    subheader: "Let's start speaking Filipino like a pro!",
    image: require('../assets/speakLogo.png'),
    imageRectangle: require('../assets/purpleRectangle.png'),
  },
  {
    header: "Listening Skills",
    subheader: "Let's start listening Filipino like a pro!",
    image: require('../assets/listenLogo.png'),
    imageRectangle: require('../assets/blueRectangle.png'),
  },
  {
    header: "Writing Skills",
    subheader: "Let's start writing Filipino like a pro!",
    image: require('../assets/writeLogo.png'),
    imageRectangle: require('../assets/greenRectangle.png'),
  },
];


const Index = () => {
  const username = useSelector((state: RootState) => state.user.name);


  return (
    <View style={styles.container}>
      <Stack.Screen options={{headerShown: false }} />
      <View style={styles.headerContainer}>
        <Text style={styles.textHeader}>Kumusta, {username}!</Text>
        <Text style={styles.subtextHeader}>You can choose any skill you want to improve!</Text>
        <Text style={styles.subtextHeader2}>Just swipe anywhere!</Text>
      </View>
      <PagerView style={styles.container} initialPage={0} overScrollMode="never">
        {pages.map((page, index) => (
          <View key={index}>
            <View style={styles.imgRedRectangleContainer}>
              <Image source={page.imageRectangle} style={styles.imgRedRectangle} />
              <Text style={styles.imgtextHeader}>{page.header}</Text>
              <Text style={styles.imgsubtextHeader}>{page.subheader}</Text>
              <Image source={page.image} style={styles.imgReading} />
              <TouchableOpacity 
                style={styles.continueButton}
                onPress={() => {
                  switch (index) {
                    case 0:
                      router.push('/(skillPages)/ReadingSkillPage');
                      break;
                    case 1:
                      router.push('/(skillPages)/SpeakingSkillPage');
                      break;
                    case 2:
                      router.push('/(skillPages)/ListeningSkillPage');
                      break;
                    case 3:
                      router.push('/(skillPages)/WritingSkillPage');
                      break;
                    default:
                      // Do something if index is out of range
                      break;
                  }
                }}
                >
                  <Text style={styles.continueText}>Start</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </PagerView>
    </View>
  );
};

export default Index

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    headerContainer: {
        marginLeft: 20,
    },
    textHeader: {
      fontSize: 30,
      fontWeight: "bold",
      marginTop: 70,
    },
    subtextHeader: {
        fontSize: 14,
        marginTop: 10,
    },
      subtextHeader2: {
        fontSize: 14,
        marginTop: 5,
        marginBottom: 30,
    },
      imgRedRectangleContainer: {
        alignItems: 'center',
    },
      imgRedRectangle: {
        width: 344, // Adjust as needed
        height: 506, // Adjust as needed
        resizeMode: 'contain',
    },
    imgtextHeader: {
        color: '#f8f8ff',
        fontSize: 30,
        fontWeight: "bold",
        position: 'absolute',
        marginTop: 37,
    },
    imgsubtextHeader: {
        color: '#f8f8ff',
        fontSize: 12,
        position: 'absolute',
        marginTop: 90,
    },
    imgReading: {
        position: 'absolute',
        marginTop: 150,
    },
    continueButton: {
        marginTop: 420,
        backgroundColor: '#282B2B',
        borderRadius: 30,
        width: 300,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
    },
      continueText: {
        fontSize: 25,
        color: '#f8f8ff',
        fontWeight: '500',
    },
});