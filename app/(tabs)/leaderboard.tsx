import { View, Text, StyleSheet, } from 'react-native'
import { Container } from '~/tamagui.config'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const LeaderboardScreen = () => {
  return (
    <SafeAreaView style={{backgroundColor:'white', flex:1,}}>
      <View >
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Leaderboard</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default LeaderboardScreen

const styles = StyleSheet.create({
  headerContainer: {
    height: 80,
    marginBottom: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FD9F10',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  
})