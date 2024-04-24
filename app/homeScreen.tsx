import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack, Link } from 'expo-router';

const HomeScreen = () => {
    
  return (
    <View>
        <Stack.Screen options={{headerShown: false }} />
            <View style={styles.headerContainer}>
                <Text style={styles.textHeader}>Kumusta, John!</Text>
                <Text style={styles.subtextHeader}>You can choose any skill you want to improve!</Text>
                <Text style={styles.subtextHeader2}>Just swipe anywhere!</Text>
            </View>
            <View style={styles.imgRedRectangleContainer}>
                <Image source={require('../app/assets/redRectangle.png')} style={styles.imgRedRectangle} />
                <Text style={styles.imgtextHeader}>Reading Skills</Text>
                <Text style={styles.imgsubtextHeader}>Let’s start speaking Filipino like a pro!</Text>
                <Image source={require('../app/assets/readLogo.png')} style={styles.imgReading} />
                <TouchableOpacity style={styles.continueButton}>
                    <Link href={'/readGame1'}>
                        <Text style={styles.continueText}>Proceed to Unit 1</Text>
                    </Link>
                </TouchableOpacity>
            </View>
    </View>
  )
}

const styles = StyleSheet.create({
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
        zIndex: -1,
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
        marginTop: 180,
    },
    continueButton: {
        marginTop: 420,
        backgroundColor: '#BF85FA',
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