import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import FeedbackModal from '../feedbackModal';
import { useNavigation } from '@react-navigation/native';
import { GameAsset, TextAsset } from '../redux/game/courseTreeSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';

const ReadGame2 = ({ gameId, onContinue } : { gameId: string, onContinue: any}) => {
  const navigation = useNavigation();
  const [isWrongMatch, setIsWrongMatch] = useState(false);
  const courses = useSelector((state: RootState) => state.courseTree.course);
  const [isModalVisible, setIsModalVisible] = useState(false)
 
  //TODO: GET GAME ASSETS OF THE CURRENT GAME
  // find the specific game by passed gameId
  const game = courses
    .flatMap(course => course.lesson) 
    .flatMap(lesson => lesson.game) 
    .find(game => game.id === gameId); 

  // Extract game assets from the game
  const gameAsset: GameAsset[] = game ? 
    (Array.isArray(game.gameAssets) ? game.gameAssets : [game.gameAssets]) : [];

  // Extract text assets
  const textAssets: TextAsset[] = gameAsset.flatMap(asset => asset.textAssets);

  // Extract choices
  const given = textAssets
  .filter(asset => asset.assetClassifier === "CHOICES") 
  .map(choice => choice.textContent); 

  const handleGoBack = () => {
    navigation.goBack();
  };
  
  // * format of the content should be "word-match" example: "umaga-morning"
  const initialWords = given.map(item => {
    const [word, match] = item.split('-'); // Split the string into word and match
    return { word, match, isMatched: false }; // Return the formatted object
  });
  
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
    if (item.isMatched) return;
  
    if (selectedItem === null) {
      setSelectedItem(item);
    } else if (
      // Check both matching directions (left to right and right to left)
      selectedItem.match === item.word || 
      selectedItem.word === item.match  
    ) {
      // Mark both items as matched
      setItems(prevItems => 
        prevItems.map(i => 
          i.word === selectedItem.word || i.word === item.word 
            ? { ...i, isMatched: true }
            : i
        )
      );
      
      setMatches(prevMatches => 
        prevMatches.map(m => 
          m.word === selectedItem.match || m.word === item.match 
            ? { ...m, isMatched: true }
            : m
        )
      );

      // Clear the selected item
      setSelectedItem(null);
    } else {
      // Incorrect match handling
      setIsWrongMatch(true);
      
      // Reset selected item after a delay
      setTimeout(() => {
        setSelectedItem(null);
        setIsWrongMatch(false); // Reset after showing the wrong color
      }, 500); //duration
      setSelectedItem(item);
    }
  };

  useEffect(() => {
    if (items.every(item => item.isMatched) && matches.every(match => match.isMatched)) {
      setIsModalVisible(true)
    }
  }, [items, matches])

  const handleModalClose = () => {
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
            style={[
              styles.choices1, 
              item.isMatched ? styles.matched : null, 
              isWrongMatch && selectedItem && selectedItem.word === item.word ? styles.wrongMatch : null // Apply wrong match style
            ]} 
            onPress={() => handlePress(item)}
            disabled={item.isMatched} 
            key={`${item.word}-${item.isMatched}`}
          >
            <Text style={styles.choicesText}>{item.word}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.choices2, 
              matches[index].isMatched ? styles.matched : null, 
              isWrongMatch && selectedItem && selectedItem.word === matches[index].word ? styles.wrongMatch : null // Apply wrong match style
            ]} 
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
            <Text style={styles.continueText}>CHECK</Text>
         </TouchableOpacity>
        {/* Feedback Modals are subject to change */}
        <FeedbackModal visible={isModalVisible}
        feedback={"All words matched!"}
        onClose={handleModalClose}
        />
      </View>
  )
}

export default ReadGame2

const styles = StyleSheet.create({
  clickedChoice: {
    backgroundColor: '#FFEB3B', // Change to your preferred clicked color
    borderWidth: 2,
    borderColor: 'black',
  },
  wrongMatch: {
    borderWidth: 2,
    borderColor: 'red',
  },
  contentContainer: {
    alignItems: "center",
    marginVertical: 20,
    width: '100%',
    height: '100%',
  },
  header: {
    fontSize: 23,
    fontWeight: "900",
    marginLeft: '3%',
  },
  row: {
    flexDirection: 'row',
  },
  choices1: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 25,
    borderRadius: 35,
    width: '45%',
    maxWidth: 'auto',
    height: 100,
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
    width: '45%',
    maxWidth: 'auto',
    height: 100,
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
     backgroundColor: '#FD9F10',
     borderRadius: 30,
     width: '100%',
     height: '8%',
     alignItems: 'center',
     justifyContent: 'center',
     elevation: 4,    
    position: 'absolute' ,
    bottom: 0,  
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