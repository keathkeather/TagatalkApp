import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const GameScreen = () => {
  return (
    <SafeAreaView style={{backgroundColor:'white', flex:1,}}>
        <View >
            <View>
            <Text>Game Screen</Text>
            </View>
            <View>
            <Text>
                This is the game screen. Have fun playing!
            </Text>
            </View>
        </View>
    </SafeAreaView>
  )
}

export default GameScreen

const styles = StyleSheet.create({})