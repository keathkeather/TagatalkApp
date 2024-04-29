import { View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native'
import { Container } from '~/tamagui.config'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Sandbox = () => {
  return (
    <SafeAreaView style={{backgroundColor:'white', flex:1,}}>
      <View >
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Story Time!</Text>
        </View>
        <View>
          <Image 
            source={require('../assets/box.png')}
            style={{
              height: 320,
              width: 320,
              marginTop: 40,
              alignSelf: 'center',
            }}/>
            <Text style={styles.paragraphText}>
              Apply what you've learned. Open the box and use the images inside to craft a story!
            </Text>
            <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.createButton}
              >
              <Text style={styles.createText}>Create a Story</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.previousStoriesButton}>
                <Text style={styles.previousStoriesText}>My Previous Stories</Text>
            </TouchableOpacity>
            </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Sandbox

const styles = StyleSheet.create({
  headerContainer: {
    height: 80,
    marginBottom: 22,
    justifyContent: 'center',
    backgroundColor: '#FD9F10',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginHorizontal: 35,
  },
  paragraphText: {
    fontSize: 16,
    color: 'black',
    marginHorizontal: 55,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: '#212121',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: '80%',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.15, 
    shadowRadius: 4, 
    elevation: 2, 
    marginBottom: 20,
  },
  createText: {
    color: '#fff', 
    fontSize: 18,
    fontWeight: 'bold',
  },
  previousStoriesButton: {
    backgroundColor: '#F4F4F4',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: '80%',
    borderWidth: 1,
    borderColor: '#D0D5DD',
  },
  previousStoriesText: {
    color: '#344054', 
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  }
})