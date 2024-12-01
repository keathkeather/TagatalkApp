import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView} from 'react-native'
import { router, useFocusEffect } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import icons from '../../constants/icons';
import React, { useEffect, useState } from 'react'
import ProgressBar from '../../components/ProfileProgressBar'; 
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { CourseTreeArray, getCourseTree } from '~/components/courseTree';

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [readingCourseTree, setReadingCourseTree] = useState<CourseTreeArray | null>(null);
  const [speakingCourseTree, setSpeakingCourseTree] = useState<CourseTreeArray | null>(null);
  const [writingCourseTree, setWritingCourseTree] = useState<CourseTreeArray | null>(null);
  const [listeningCourseTree, setListeningCourseTree] = useState<CourseTreeArray | null>(null);

  // Get the info of the courses
  useEffect(() => {
    const fetchCourseTree = async () => {
      const reading = await getCourseTree('READING');
      const speaking = await getCourseTree('SPEAKING');
      const writing = await getCourseTree('WRITING');
      const listening = await getCourseTree('LISTENING');
      setReadingCourseTree(reading);
      setSpeakingCourseTree(speaking);
      setWritingCourseTree(writing);
      setListeningCourseTree(listening);
    }
    fetchCourseTree();
  }, [dispatch]);

  // Get the number of lessons for each courses
  const readingLessons = readingCourseTree?.course.reduce((acc, unit) => acc + unit.lesson.length, 0);
  const speakingLessons = speakingCourseTree?.course.reduce((acc, unit) => acc + unit.lesson.length, 0);
  const writingLessons = writingCourseTree?.course.reduce((acc, unit) => acc + unit.lesson.length, 0);
  const listeningLessons = listeningCourseTree?.course.reduce((acc, unit) => acc + unit.lesson.length, 0);

  // Get the number of completed lessons for each courses using course tree info
  const readingCompleted = readingCourseTree?.course.reduce((acc, unit) => acc + unit.lesson.filter(lesson => lesson.isComplete).length, 0);
  const speakingCompleted = speakingCourseTree?.course.reduce((acc, unit) => acc + unit.lesson.filter(lesson => lesson.isComplete).length, 0);
  const writingCompleted = writingCourseTree?.course.reduce((acc, unit) => acc + unit.lesson.filter(lesson => lesson.isComplete).length, 0);
  const listeningCompleted = listeningCourseTree?.course.reduce((acc, unit) => acc + unit.lesson.filter(lesson => lesson.isComplete).length, 0);

  //*Change the progress based of the logged in user
  const readingProgress = readingLessons ? Math.round(((readingCompleted ?? 0) / readingLessons) * 100) : 0;
  const speakingProgress = speakingLessons ? Math.round(((speakingCompleted ?? 0) / speakingLessons) * 100) : 0;
  const writingProgress = writingLessons ? Math.round(((writingCompleted ?? 0) / writingLessons) * 100) : 0;
  const listeningProgress = listeningLessons ? Math.round(((listeningCompleted ?? 0) / listeningLessons) * 100) : 0;

  const bio = useSelector((state: RootState) => state.user.profileDescription);
  const username = useSelector((state: RootState) => state.user.name);
  let profileImage =useSelector((state: RootState) => state.user.profileImage);
  
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
            source={profileImage ? { uri: profileImage } : icons.defaultProfile}
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
          width: 300,
        }}>
          {bio}
        </Text>
      <View style={styles.line}/>
      <Text style={{
        fontSize: 32,
        fontWeight: 'bold',
        color: '#344054',
        marginBottom: 10,
        alignSelf: 'flex-start',
        marginHorizontal: 30,
      }}>
        Overview
      </Text>
      <View style={{flex:1, flexDirection: 'row', marginHorizontal: 30, }}>
        
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
    width: '50%',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 3.5,
    marginHorizontal:30,
    marginVertical:10,
    width: '85%',
  },
  skillText: {
    fontSize: 16,
    color: '#D0D5DD',
    marginBottom: 5,
    alignSelf: 'flex-start',
  }
})