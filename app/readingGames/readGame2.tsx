import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Stack } from 'expo-router'
import FeedbackModal from '../feedbackModal';
import { useNavigation } from '@react-navigation/native';
import icons from '../../constants/icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgressBar from '../../components/ProgressBar'; 

const ReadGame2 = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };
  const initialWords = [
    { word: 'umaga', match: 'morning', isMatched: false },
    { word: 'gabi', match: 'night', isMatched: false },
    { word: 'tanghali', match: 'noon', isMatched: false },
    { word: 'hapon', match: 'afternoon', isMatched: false },
      // Add more words here
  ]
  const shuffleArray = (array: any[]) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
  }
  const shuffledWords = shuffleArray([...initialWords])
  const [items, setItems] = useState(shuffledWords)
  const [matches, setMatches] = useState(shuffleArray([...shuffledWords.map(w => ({ word: w.match, match: w.word, isMatched: false }))]))
  const [selectedItem, setSelectedItem] = useState<{ word: string, match: string, isMatched: boolean } | null>(null)

  const handlePress = (item: { word: string, match: string, isMatched: boolean }) => {
    if (item.isMatched) return      
      if (selectedItem === null) {
        setSelectedItem(item)
      } else if (selectedItem.match === item.word) {
        setItems(items.map(i => {
        if (i.word === selectedItem.word || i.word === item.word) {
          return { ...i, isMatched: true }
          }
          return i
        }))
        setMatches(matches.map(m => {
          if (m.word === selectedItem.match || m.word === item.word) {
            return { ...m, isMatched: true }
          }
          return m
        }))
        setSelectedItem(null)
      } else {
        setSelectedItem(item)
      }
  }
  const [isModalVisible, setIsModalVisible] = useState(false)
    useEffect(() => {
      if (items.every(item => item.isMatched) && matches.every(match => match.isMatched)) {
        setIsModalVisible(true)
      }
    }, [items, matches])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <Stack.Screen options={{headerShown: false }} />
        <View style={styles.backContainer}>
          <TouchableOpacity onPress={handleGoBack}>
            <Image source={icons.modbackarrow} style={styles.backArrow} />
          </TouchableOpacity>
          <View style={styles.progressBarContainer}>
            <ProgressBar value={20} indicatorColor={'#FD9F10'}/>
          </View>
        </View>
          <Text style={styles.header}>Match the correct word.</Text>
          <View style={styles.choicesContainer}>
          {items.map((item, index) => (
            <View style={styles.row} key={index}>
                <TouchableOpacity 
                style={[styles.choices1, item.isMatched ? styles.matched : null]} 
                onPress={() => handlePress(item)}
                disabled={item.isMatched}
                key={`${item.word}-${item.isMatched}`}
                >
                <Text style={styles.choicesText}>{item.word}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                style={[styles.choices2, matches[index].isMatched ? styles.matched : null]} 
                onPress={() => handlePress(matches[index])}
                disabled={matches[index].isMatched}
                key={`${matches[index].word}-${matches[index].isMatched}`}
                >
                <Text style={styles.choicesText}>{matches[index].word}</Text>
                </TouchableOpacity>
            </View>
            ))}
          </View>
          <TouchableOpacity 
            style={[
                styles.continueButton, 
                (!items.every(item => item.isMatched) || !matches.every(match => match.isMatched)) ? styles.disabledButton : null
            ]}
            disabled={!items.every(item => item.isMatched) || !matches.every(match => match.isMatched)}
            >
            <Text style={styles.continueText}>CONTINUE</Text>
          </TouchableOpacity>
          {/* Feedback Modals are subject to change */}
          <FeedbackModal visible={isModalVisible}
          feedback={"All words matched!"}
          onClose={() => setIsModalVisible(false)}
          />
        </SafeAreaView>
    )
}

export default ReadGame2

const styles = StyleSheet.create({
  backContainer: {
    height: '5%',
    marginTop: 40,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarContainer: {
    marginLeft: 20,
  },
  backArrow: {
    width: 38,
    height: 38,
  },
  container: {
    color: "white",
  },
  header: {
    fontSize: 25,
    fontWeight: "900",
    marginLeft: 20,
    marginTop: 40,
  },
  choicesContainer: {
    flexDirection: 'column',
    marginTop: 40,
  },
  row: {
    flexDirection: 'row',
  },
  choices1: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 20,
    marginLeft: 20,
    borderRadius: 35,
    width: '43%',
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#BF85FA",
    elevation: 5,
  },
  choices2: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 20,
    marginLeft: 20,
    borderRadius: 35,
    width: '43%',
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#02B7E8",
    elevation: 5,
  },
   choicesText: {
    fontSize: 23,
    fontWeight: "600",
    color: "white",
  },
   continueButton: {
     marginTop: 80,
     marginLeft: 20,
     backgroundColor: '#FD9F10',
     borderRadius: 30,
     width: '90%',
     height: '6%',
     alignItems: 'center',
     justifyContent: 'center',
     elevation: 4,    
  },
  continueText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  success: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: 'gray',
  },
  matched: {
    backgroundColor: 'gray',
  },
})