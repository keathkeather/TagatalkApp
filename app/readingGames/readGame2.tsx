import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Stack } from 'expo-router'
import FeedbackModal from '../feedbackModal';
import { useNavigation } from '@react-navigation/native';
import icons from '../../constants/icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgressBar from '../../components/ProgressBar'; 

const ReadGame2 = ({onContinue} : {onContinue : any}) => {
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

    const handleContinue = () => {
      setIsModalVisible(false);
      if (onContinue) {
        onContinue();
      }
    };
    return (
      <View style={{backgroundColor: 'white', width: '100%', flex: 1, justifyContent: 'space-between'}}>
          <Text style={styles.header}>Match the correct word.</Text>
        <View style={styles.contentContainer}>
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
            <TouchableOpacity 
              style={[
                  styles.continueButton, 
                  (!items.every(item => item.isMatched) || !matches.every(match => match.isMatched)) ? styles.disabledButton : null
              ]}
              disabled={!items.every(item => item.isMatched) || !matches.every(match => match.isMatched)}
              >
              <Text style={styles.continueText}>CHECK</Text>
            </TouchableOpacity>
          </View>
          {/* Feedback Modals are subject to change */}
          <FeedbackModal visible={isModalVisible}
          feedback={"All words matched!"}
          onClose={handleContinue}
          />
        </View>
    )
}

export default ReadGame2

const styles = StyleSheet.create({
  contentContainer: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 25,
    fontWeight: "900",
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
  },
  choices1: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 25,
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
    marginTop: 25,
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
     marginTop: 100,
     backgroundColor: '#FD9F10',
     borderRadius: 30,
     width: '100%',
     height: '8%',
     alignItems: 'center',
     justifyContent: 'center',
     elevation: 4,    
  },
  continueText: {
    fontSize: 18,
    letterSpacing: 1,
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