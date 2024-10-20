import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import FeedbackModal from '../feedbackModal';
import icons from '../../constants/icons';
import { Audio } from 'expo-av';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { GameAsset, TextAsset, FileAsset } from '../redux/game/courseTreeSlice';

const ListenGame3= ({gameId, onContinue, onWrongAttempt} : {gameId : any, onContinue : any, onWrongAttempt: any}) => {    
  // Get courses from the redux store
  const courses = useSelector((state: RootState) => state.courseTree.course);

  // TODO: GET GAME ASSETS OF THE CURRENT GAME
  // find the specific game by passed gameId
  const game = courses
    .flatMap(course => course.lesson) 
    .flatMap(lesson => lesson.game) 
    .find(game => game.id === gameId);

  // Extract game assets from the game
  const gameAsset: GameAsset[] = game ? 
    (Array.isArray(game.gameAssets) ? game.gameAssets : [game.gameAssets]) : [];

  //Extract text assets
  const textAssets: TextAsset[] = gameAsset.flatMap(asset => asset.textAssets);

  // Extract file assets
  const fileAssets: FileAsset[] = gameAsset.flatMap(asset => asset.fileAssets);

  //console.log(fileAssets.map(file => file.filename));

  const initialWords = fileAssets.map((fileAsset) => {
    // Safeguard against undefined fileName
    const fileName = fileAsset?.filename ? fileAsset.filename.replace(/\.[^/.]+$/, "") : null;

    if (!fileName) {
      return null; // skip if fileName is invalid
    }

    // find the corresponding text asset with matching content
    const matchedTextAsset = textAssets.find(textAsset => {
      return fileName === textAsset.textContent;
    });

    // Return the object containing audio file URL and the match (textContent)
    return {
      audio: { uri: fileAsset.fileUrl }, 
      match: matchedTextAsset?.textContent || '',  // Fallback to empty string if not found
      isMatched: false,
    };
  }).filter(Boolean); // Filter out any null values

  // *Optional: Log to see if everything is matched correctly
  // console.log('Initial Words:', initialWords.map(word => word?.match));

  const [matchedWords, setMatchedWords] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<{ type: 'audio' | 'match', value: string } | null>(null);

    // Extract the audio files and matches from the initial words
    const initialAudios = initialWords
      .filter((word): word is NonNullable<typeof word> => word !== null)
      .map(word => ({ audio: word.audio, match: word.match }));

    // Extract the matches from the initial words
    const initialMatches = initialWords
      .filter((word): word is NonNullable<typeof word> => word !== null)
      .map(word => word.match);

  const [audios, setAudios] = useState(initialAudios);
  const [matches, setMatches] = useState(initialMatches);
  const isMatched = (match: string) => matchedWords.includes(match);
  
  useEffect(() => {
    setMatches(shuffleArray([...initialMatches]));
    if (matchedWords.length === initialWords.length) {
        setIsModalVisible(true);
        }
  }, []);

  const playSound = async (audio: any) => {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(audio);
      await soundObject.playAsync();
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
      console.log(error);
    }
  }

  const handleAudioSelection = async (audio: any, match: string) => {
    if (selectedItem && selectedItem.type === 'match' && selectedItem.value === match) {
      setMatchedWords(prevMatchedWords => [...prevMatchedWords, match]);
      setSelectedItem(null);
    } else {
      setSelectedItem({ type: 'audio', value: match });
      await playSound(audio); // Play the audio
      if (selectedItem && selectedItem.type === 'match' && selectedItem.value !== match && onWrongAttempt) {
        onWrongAttempt();
      }
    }
  };
  
  const handleMatchSelection = (match: string) => {
    if (selectedItem && selectedItem.type === 'audio' && selectedItem.value === match) {
      setMatchedWords(prevMatchedWords => [...prevMatchedWords, match]);
      setSelectedItem(null);
    } else {
      setSelectedItem({ type: 'match', value: match });
      if (selectedItem && selectedItem.type === 'audio' && selectedItem.value !== match && onWrongAttempt) {
        onWrongAttempt();
      }
    }
  };
  
  const shuffleArray = (array: any[]) => {
          for (let i = array.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [array[i], array[j]] = [array[j], array[i]];
          }
          return array;
  }

const [isModalVisible, setIsModalVisible] = useState(false)

    useEffect(() => {
        if (matchedWords.length === initialWords.length) {
        setIsModalVisible(true);
        }
    }, [matchedWords]);

    const handleContinue = () => {
      setIsModalVisible(false);
      if (onContinue) {
        onContinue();
      }
    };
  
  return (
    <View style={{backgroundColor: 'white', width: '100%', flex: 1, justifyContent: 'space-between'}}>
      <Text style={styles.header}>Match the correct word.</Text>
      <View style={styles.choicesContainer}>
      {audios.map((audio, index) => (
        <View key={index} style={styles.row}>
            <TouchableOpacity
            style={[styles.choices1, isMatched(audio.match) ? styles.disabledButton : {}]}
            onPress={() => handleAudioSelection(audio.audio, audio.match)}
            disabled={isMatched(audio.match)}
            >
            <Image source={icons.speaker} style={styles.speakerIcon} />
            </TouchableOpacity>
            <TouchableOpacity
            style={[styles.choices1, isMatched(matches[index]) ? styles.disabledButton : {}]}
            onPress={() => handleMatchSelection(matches[index])}
            disabled={isMatched(matches[index])}
            >
            <Text style={styles.choicesText}>{matches[index]}</Text>
            </TouchableOpacity>
        </View>
        ))}
      </View>
    <TouchableOpacity  
        style={[styles.continueButton, matchedWords.length !== initialWords.length ? styles.disabledButton : {}]}
        disabled={matchedWords.length !== initialWords.length}
    >
        <Text style={styles.continueText}>CHECK</Text>
    </TouchableOpacity>
          {/* Feedback Modals are subject to change */}
        <FeedbackModal visible={isModalVisible}
          feedback={"All words matched!"}
          onClose={handleContinue}
        />
    </View>
)
}

export default ListenGame3

const styles = StyleSheet.create({
  header: {
    marginTop: 20,
    fontSize: 25,
    fontWeight: "900",
  },
  choicesContainer: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  choices1: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 20,
    marginLeft: 15,
    borderRadius: 35,
    width: '43%',
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#BF85FA",
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
     height: '7%',
     alignItems: 'center',
     justifyContent: 'center',
    elevation: 4,    
  },
  continueText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    letterSpacing: 1,
    height: '55%',
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
  speakerIcon: {
    width: 43,
    height: 43,
  },
})