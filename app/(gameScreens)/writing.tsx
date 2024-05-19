import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, {useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack } from 'expo-router'
import icons from '../../constants/icons';
import { useNavigation } from '@react-navigation/native';
import ProgressBar from '../../components/ProgressBar'; 
import { Container } from '../../tamagui.config';
import WriteGame1 from '../writingGames/writeGame1';
import WriteGame2 from '../writingGames/writeGame2';
import WriteGame3 from '../writingGames/writeGame3';

const Writing = () => {
    const navigation = useNavigation();
    
    const handleGoBack = () => {
        navigation.goBack();
    };
    
    return (
        <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
            <Stack.Screen options={{headerShown: false }} />
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={handleGoBack}>
                    <Image source={icons.modbackarrow} style={styles.backArrow} />
                </TouchableOpacity>
                <View style={styles.progressBarContainer}>
                    <ProgressBar value={0} indicatorColor={'#FD9F10'}/>
                </View>              
            </View>
            <Container style={{
                width: '100%',
                height: '100%',
            }}>
                   {/* //TODO: Map the 3 gametypes of Writing skill here (WriteGame1, WriteGame2, WriteGame3) */}
                    <WriteGame3 />
            </Container>
        </SafeAreaView>
    )
}

export default Writing

const styles = StyleSheet.create({
    backArrow: {
        resizeMode: 'cover',
        width: 34,
        height: 34,
        borderColor: 'white',
        borderWidth: 1,
      },
      headerContainer: {
        height: '5%',
        marginTop: 25,
        flexDirection: 'row',
        width: '90%',
        marginLeft: 15,
      },
      progressBarContainer: {
        marginTop: 10,
        marginLeft: 20,
        alignSelf: 'center',
        width: '80%',
        height: '100%',
      },
      buttonContainer: {
        width: '90%',
        alignSelf: 'center',
        margin: 20,
      },
})