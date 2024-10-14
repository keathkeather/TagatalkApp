import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Dimensions, StatusBar, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
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

const generateRepeatedPages = (pages: any, repeatCount: any) => Array(repeatCount).fill(pages).flat();

const Index = () => {
  const username = useSelector((state: RootState) => state.user.name);
  const [repeatedPages, setRepeatedPages] = useState(generateRepeatedPages(pages, 10));

  const loadMorePages = () => {
    setRepeatedPages(prevPages => [...prevPages, ...generateRepeatedPages(pages, 10)]);
  };

  const renderItem = ({ item, index } : {item: any, index: any}) => (
    <View style={styles.pageContainer}>
      {Platform.OS === 'ios' && (<StatusBar barStyle="dark-content" backgroundColor={"blue"} />)}
      <View style={styles.imgRedRectangleContainer}>
        <Image source={item.imageRectangle} style={styles.imgRedRectangle} />
        <Text style={styles.imgtextHeader}>{item.header}</Text>
        <Text style={styles.imgsubtextHeader}>{item.subheader}</Text>
        <Image source={item.image} style={styles.imgReading} />
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => {
            switch (index % 4) {
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
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FD9F10" barStyle="light-content" />
      <Stack.Screen options={{headerShown: false }} />
      <View style={styles.headerContainer}>
        <Text style={styles.textHeader}>Kumusta, {username}!</Text>
        <Text style={styles.subtextHeader}>You can choose any skill you want to improve!</Text>
        <Text style={styles.subtextHeader2}>Just swipe left! ➡️</Text>
      </View>
      <FlatList
        data={repeatedPages}
        horizontal
        pagingEnabled
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={loadMorePages}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

export default Index;

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
    fontSize: 16,
    marginTop: 10,
    color: '#344054',
  },
  subtextHeader2: {
    fontSize: 16,
    marginTop: 5,
    marginBottom: '10%',
    color: '#344054',
  },
  pageContainer: {
    width: Dimensions.get('window').width,
  },
  imgRedRectangleContainer: {
    alignItems: 'center',
  },
  imgRedRectangle: {
    width: '90%', // Adjust as needed
    height: '90%', // Adjust as needed
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
    fontSize: 16,
    position: 'absolute',
    marginTop: 90,
  },
  imgReading: {
    position: 'absolute',
    marginTop: 150,
    resizeMode: 'contain',
    width: 400,
    height: 230,
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