import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native'
import { Stack } from 'expo-router'
import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

const CreateStory = () => {

    const navigation = useNavigation();
    const scrollViewRef = useRef<ScrollView>(null);
    const [isAtTop, setIsAtTop] = useState(true);

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleButtonPress = () => {
        if (isAtTop) {
          // Scroll to bottom
          scrollViewRef.current?.scrollToEnd({ animated: true });
        } else {
          // Scroll to top
          scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        }
        setIsAtTop(!isAtTop);
      };
      
    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        if (offsetY === 0) {
            setIsAtTop(true);
        } else if (offsetY < 0 && isAtTop) {
            setIsAtTop(false);
        }
      };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <Stack.Screen options={{headerShown: false }} />
            <ScrollView overScrollMode="never" ref={scrollViewRef} onScroll={handleScroll}>
                <View>
                    <View style={styles.headerReading}>
                        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                            <Image source={require('../../app/assets/backButton.png')} style={styles.buttonText} />
                        </TouchableOpacity>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.headerText}> Create Story </Text>
                        </View>
                    </View>
                    <View style={styles.storyContainer}>
                        <Image source={require('../../app/assets/sandboxImage1.png')} style={styles.sandboxImage} />
                        <TextInput style={styles.storyTextBox}
                        placeholder='Start typing your story here!'>
                        </TextInput>
                    </View>
                    <View style={styles.storyContainer}>
                        <Image source={require('../../app/assets/sandboxImage1.png')} style={styles.sandboxImage} />
                        <TextInput style={styles.storyTextBox}
                        placeholder='Start typing your story here!'>
                        </TextInput>
                    </View>
                    <View style={styles.storyContainer}>
                        <Image source={require('../../app/assets/sandboxImage1.png')} style={styles.sandboxImage} />
                        <TextInput style={styles.storyTextBox}
                        placeholder='Start typing your story here!'>
                        </TextInput>
                    </View>
                    <View style={styles.storyContainer}>
                        <Image source={require('../../app/assets/sandboxImage1.png')} style={styles.sandboxImage} />
                        <TextInput style={styles.storyTextBox}
                        placeholder='Start typing your story here!'>
                        </TextInput>
                    </View>
                    <View style={styles.storyContainer}>
                        <Image source={require('../../app/assets/sandboxImage1.png')} style={styles.sandboxImage} />
                        <TextInput style={styles.storyTextBox}
                        placeholder='Start typing your story here!'>
                        </TextInput>
                    </View>
                </View>
            </ScrollView>
            <TouchableOpacity style={styles.backToTopButton} onPress={handleButtonPress}>
                <Image source={require('../../app/assets/icons/arrowDown.png')}   style={[styles.topArrow, !isAtTop && { transform: [{ scaleY: -1 }] }]} />
            </TouchableOpacity>
        </SafeAreaView>
      )
}

export default CreateStory

const styles = StyleSheet.create({
    headerContainer: {
        marginTop: 30,
    },
    headerText: {
      fontSize: 30,
      fontWeight: "bold",
      color: 'white',
    },
    headerTextContainer: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerReading: {
        backgroundColor: '#FD9F10',
        width: 430,
        height: 80,
    },
    backButton: {
        marginLeft: 15,
        position: 'absolute',
        marginTop: 20,
    },
    buttonText: {
        width: 46,
        height: 46,
    },
    sandboxImage: {
        width: 390,
        height: 240,
    },
    storyContainer: {
        alignItems: 'center',
        marginTop: 25,
    },
    storyTextBox: {
        width: 390,
        height: 215,
        backgroundColor: '#FFFFFF',
        marginTop: 25,
        borderColor: '#9BA5B7',
        borderWidth: 1,
        borderRadius: 5,
        fontSize: 16,
        fontWeight: 'normal',
        color: '#9BA5B7',
        textAlign: 'left',
        textAlignVertical: 'top',
        padding: 13,
    },
    backToTopButton: {
      position: 'absolute',
      bottom: 20,
      right: 22,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#F4F4F4',
      alignItems: 'center',
      justifyContent: 'center',  
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    topArrow: {
      width: 26,
      height: 30,
    },
})