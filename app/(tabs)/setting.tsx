import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Container } from '~/tamagui.config'
import HelpDesk from '../(settings)/helpDesk'

const Settings = () => {
  const [modalVisible, setModalVisible] = useState(false);
  
  return (
    <Container>
      <View style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Settings</Text>
        </View>
        <View style={styles.subHeaderContainer}>
          <Text style={styles.subHeaderText}>Account</Text>
        </View>
        <View style={styles.menu1Container}>
          <TouchableOpacity
            onPress={() =>router.push('/(settings)/changePassword')}>
            <Text style={styles.menu1Text}>Change Password</Text>
          </TouchableOpacity>
          <View style={styles.line} />
          <TouchableOpacity>
            <Text style={styles.menu1Text}>Logout</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.subHeaderContainer}>
          <Text style={styles.subHeaderText}>Help Desk</Text>
        </View>
        <View style={styles.menu1Container}>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}>
            <Text style={styles.menu1Text}>Send Report or Feedback</Text>
          </TouchableOpacity>
        </View>
      </View>
      <HelpDesk modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </Container>
  )
}

export default Settings

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  headerContainer: {
    marginTop: 50,
    marginBottom: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subHeaderContainer: {
    alignItems: 'flex-start',
    marginLeft: 10,
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 18,
    fontWeight: '500',
  },
  menu1Container: {
    marginHorizontal: 10,
    paddingHorizontal: 25,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    marginVertical: 22,
  },
  menu1Text: {
    fontSize: 16,
    marginVertical: 22,

  },
  line: {
    height: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#D0D5DD',
  },
})