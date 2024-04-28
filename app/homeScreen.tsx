import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack, Link } from 'expo-router';
import PagerView from 'react-native-pager-view';

const HomeScreen = () => {
    
  return (
    <View style={styles.container}>
      <Stack.Screen options={{headerShown: false }} />
        <View style={styles.headerContainer}>
          <Text style={styles.textHeader}>Kumusta, John!</Text>
          <Text style={styles.subtextHeader}>You can choose any skill you want to improve!</Text>
          <Text style={styles.subtextHeader2}>Just swipe anywhere!</Text>
        </View>
        <PagerView style={styles.container} initialPage={0} overScrollMode="never">
        <View key="1">
        <View style={styles.imgRedRectangleContainer}>
          <Image source={require('../app/assets/redRectangle.png')} style={styles.imgRedRectangle} />
          <Text style={styles.imgtextHeader}>Reading Skills</Text>
          <Text style={styles.imgsubtextHeader}>Let's start speaking Filipino like a pro!</Text>
          <Image source={require('../app/assets/readLogo.png')} style={styles.imgReading} />
          <TouchableOpacity style={styles.continueButton}>
            <Link href={'/readGame1'}>
              <Text style={styles.continueText}>Start</Text>
            </Link>
          </TouchableOpacity>
        </View>
        </View>
        <View key="2">
        <View style={styles.imgRedRectangleContainer}>
          <Image source={require('../app/assets/purpleRectangle.png')} style={styles.imgRedRectangle} />
          <Text style={styles.imgtextHeader}>Speaking Skills</Text>
          <Text style={styles.imgsubtextHeader}>Let's start speaking Filipino like a pro!</Text>
          <Image source={require('../app/assets/speakLogo.png')} style={styles.imgReading} />
          <TouchableOpacity style={styles.continueButton}>
            <Link href={'/readGame1'}>
              <Text style={styles.continueText}>Start</Text>
            </Link>
          </TouchableOpacity>
        </View>
        </View>
        {/* Third Page */}
        <View key="3">
        <View style={styles.imgRedRectangleContainer}>
          <Image source={require('../app/assets/blueRectangle.png')} style={styles.imgRedRectangle} />
          <Text style={styles.imgtextHeader}>Listening Skills</Text>
          <Text style={styles.imgsubtextHeader}>Let's start speaking Filipino like a pro!</Text>
          <Image source={require('../app/assets/listenLogo.png')} style={styles.imgReading} />
          <TouchableOpacity style={styles.continueButton}>
            <Link href={'/readGame1'}>
              <Text style={styles.continueText}>Start</Text>
            </Link>
          </TouchableOpacity>
        </View>
        </View>
        {/* Fourth Page */}
        <View key="4">
        <View style={styles.imgRedRectangleContainer}>
          <Image source={require('../app/assets/greenRectangle.png')} style={styles.imgRedRectangle} />
          <Text style={styles.imgtextHeader}>Writing Skills</Text>
          <Text style={styles.imgsubtextHeader}>Let's start speaking Filipino like a pro!</Text>
          <Image source={require('../app/assets/writeLogo.png')} style={styles.imgReading} />
          <TouchableOpacity style={styles.continueButton}>
            <Link href={'/readGame1'}>
              <Text style={styles.continueText}>Start</Text>
            </Link>
          </TouchableOpacity>
        </View>
        </View>
        </PagerView>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    headerContainer: {
        marginLeft: 20,
    },
    textHeader: {
      fontSize: 30,
      fontWeight: "bold",
      marginTop: 100,
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

export default HomeScreen