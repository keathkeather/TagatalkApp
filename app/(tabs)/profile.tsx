import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView} from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import icons from '../../constants/icons';
import React from 'react'
import ProgressBar from '../../components/ProgressBar'; 

const Profile = () => {
  //*Change the progress based of the logged in user
  const readingProgress = 90;
  const speakingProgress = 20;
  const writingProgress = 40;
  const listeningProgress = 65;
  const streak = 12;
  const life = 5;
  const bio = 'Hello! I am a student and I love Filipino. I love to kill time. Help me. I am not keribels for the coding huhuhuhuhuhuh 😀';
  const username = 'cheese.maddy13';

  return (
    <SafeAreaView style={{backgroundColor:'white', flex:1,}}>
      <ScrollView >
      <View style={styles.mainContainer}> 
        <View style={styles.cover}>
          <TouchableOpacity onPress={() =>router.push('/(editProfile)/EditProfile')}>
          <Image 
                    source={icons.edit}
                      style={{
                        resizeMode: 'contain',
                        height: 24, 
                        width: 24,
                        zIndex: 0,
                        alignSelf: 'flex-end',
                        margin: 15,
                    }}
            />
            </TouchableOpacity>
        </View>
      </View>
      <View style={{flex: 1, alignItems: 'center', zIndex:10 }}>
          <Image
            source={require('../assets/rynze.jpg')} 
            resizeMode='cover'
            style={{
              height: 130,
              width: 130,
              borderRadius: 100,
              marginTop: -80,
              borderWidth: 5,
              borderColor: 'white',
            }}
          />
        
      <Text
      //*Change the username based of the logged in user
          style={styles.username}
      >
        {username}
      </Text>
        <Text style={{
          color: '#545F71',
          fontSize: 14,
          textAlign: 'center', 
          marginHorizontal:18,
          height: 70,
          width: 300,
        }}>
          {bio}
        </Text>
      <View style={styles.line}/>
      <Text style={{
        fontSize: 20,
        fontWeight: 'bold',
        color: '#344054',
        marginBottom: 10,
        alignSelf: 'flex-start',
        marginHorizontal: 30,
      }}>
        Statistics
      </Text>
      <View style={{flex:1, flexDirection: 'row', marginHorizontal: 30, }}>
        <View style={styles.statsContainer} >
          <Image 
                source={icons.flame}
                  style={{
                    resizeMode: 'contain',
                    height: 28, 
                    width: 28,
                }}
            />
          <View>
            <Text style={{fontSize: 16, color: '#545F71', fontWeight:'bold', width:80}}>{streak}</Text>
            <Text style={{fontSize: 16, color: '#D0D5DD', fontWeight:'500', width:80}}>day streak!</Text>
          </View>
        </View>
        <View style={{margin:5}}/>
        <View style={styles.statsContainer} >
          <Image 
              source={icons.heart}
                style={{
                  resizeMode: 'contain',
                  height: 24, 
                  width: 24,
              }}
          />
          <View>
            <Text style={{fontSize: 16, color: '#545F71', fontWeight:'bold', width:80}}>{life}</Text>
            <Text style={{fontSize: 16, color: '#D0D5DD', fontWeight:'500', width:80}}>full life!</Text>
          </View>
        </View>
      </View>
      <View style={styles.progressContainer}>
        <Text style={styles.skillText}>
          Reading
        </Text>
        <ProgressBar value={readingProgress} indicatorColor='#E33230'/>
        <Text style={styles.skillText}>
          Speaking
        </Text>
        <ProgressBar value={speakingProgress} indicatorColor='#BF85FA'/>
        <Text style={styles.skillText}>
          Writing
        </Text>
        <ProgressBar value={writingProgress} indicatorColor='#58CC02'/>
        <Text style={styles.skillText}>
          Listening
        </Text>
        <ProgressBar value={listeningProgress}indicatorColor='#02B7E8'/>
      </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'center',
    width: '100%',
  },
  cover: {
    width: '100%',
    height: 140,
    backgroundColor: '#FD9F10',
  },
  username: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#344054',
    marginVertical: 5,
  },
  line: {
    height: 0,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#D0D5DD',
    marginVertical: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderColor: '#D0D5DD',
    borderWidth: 1,
    borderRadius: 10,
    height: 72,
    width: 160,
    alignItems: 'center',
  },
  progressContainer: {
    flex: 3.5,
    marginHorizontal:30,
    marginVertical:10,
  },
  skillText: {
    fontSize: 16,
    color: '#D0D5DD',
    marginBottom: 5,
    alignSelf: 'flex-start',
  }
})