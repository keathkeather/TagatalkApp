import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Stack } from 'expo-router'
import FeedbackModal from '../feedbackModal';
import { useNavigation } from '@react-navigation/native';
import icons from '../../constants/icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgressBar from '../../components/ProgressBar'; 
import { Audio } from 'expo-av';

const ListenGame3= () => {    

  const initialWords = [
    { audio: require('../assets/umaga.mp3'), match: 'morning', isMatched: false },
    { audio: require('../assets/gabi.mp3'), match: 'night', isMatched: false },
    { audio: require('../assets/tanghali.mp3'), match: 'noon', isMatched: false },
    { audio: require('../assets/hapon.mp3'), match: 'afternoon', isMatched: false },
    // Add more audio files here
  ]
    
  const [matchedWords, setMatchedWords] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<{ type: 'audio' | 'match', value: string } | null>(null);
  const initialAudios = initialWords.map(word => ({ audio: word.audio, match: word.match }));
  const initialMatches = initialWords.map(word => word.match);
  const [audios, setAudios] = useState(initialAudios);
  const [matches, setMatches] = useState(initialMatches);
  const isMatched = (match: string) => matchedWords.includes(match);
  
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };
  
  useEffect(() => {
    setMatches(shuffleArray([...initialMatches]));
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
    }
  };
  
  const handleMatchSelection = (match: string) => {
    if (selectedItem && selectedItem.type === 'audio' && selectedItem.value === match) {
      setMatchedWords(prevMatchedWords => [...prevMatchedWords, match]);
      setSelectedItem(null);
    } else {
      setSelectedItem({ type: 'match', value: match });
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

export default ListenGame3

const styles = StyleSheet.create({
  backContainer: {
    height: 43,
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
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 40,
  },
  choicesContainer: {
    flexDirection: 'column',
    marginTop: 55,
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
    width: 180,
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
    width: 180,
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
     marginLeft: 20,
     backgroundColor: '#FD9F10',
     borderRadius: 30,
     width: 390,
     height: 48,
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
  speakerIcon: {
    width: 43,
    height: 43,
  },
})