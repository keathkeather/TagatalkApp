import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack, Link } from 'expo-router';
import PagerView from 'react-native-pager-view';

const pages = [
  {
    header: "Reading Skills",
    subheader: "Let's start reading Filipino like a pro!",
    image: require('../assets/readLogo.png'),
    imageRectangle: require('../assets/redRectangle.png'),
    link: '/readingSkillPage',
  },
  {
    header: "Speaking Skills",
    subheader: "Let's start speaking Filipino like a pro!",
    image: require('../assets/speakLogo.png'),
    imageRectangle: require('../assets/purpleRectangle.png'),
    //link: '/readingSkillPage',
  },
  {
    header: "Listening Skills",
    subheader: "Let's start listening Filipino like a pro!",
    image: require('../assets/listenLogo.png'),
    imageRectangle: require('../assets/blueRectangle.png'),
    //link: '/readingSkillPage',
  },
  {
    header: "Writing Skills",
    subheader: "Let's start writing Filipino like a pro!",
    image: require('../assets/writeLogo.png'),
    imageRectangle: require('../assets/greenRectangle.png'),
    //link: '/readingSkillPage',
  },
];

const Index = () => {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{headerShown: false }} />
      <View style={styles.headerContainer}>
        <Text style={styles.textHeader}>Kumusta, John!</Text>
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
              <TouchableOpacity style={styles.continueButton}>
                <Link href={'/readingSkillPage'}>
                  <Text style={styles.continueText}>               Start               </Text>
                </Link>
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
        marginBottom: 50,
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