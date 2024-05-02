import React from 'react';
import { Text, Modal, View, Image, TouchableOpacity, TextInput, Button } from 'react-native';
import icons from '../../constants/icons'
import { styles } from './helpDeskModalStyles';

const FeedbackModal = ({ 
    feedbackModalVisible, 
    setFeedbackModalVisible, 
    setModalVisible, 
    feedbackDescription, 
    setFeedbackDescription,
    feedbackTitle,
    setFeedbackTitle 
}: {
    feedbackModalVisible: boolean,
    setFeedbackModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
    feedbackDescription: string,
    setFeedbackDescription: React.Dispatch<React.SetStateAction<string>>,
    feedbackTitle: string,
    setFeedbackTitle: React.Dispatch<React.SetStateAction<string>>
}) => (
  <Modal
    transparent={true}
    visible={feedbackModalVisible}
    onRequestClose={() => {
    setFeedbackModalVisible(!feedbackModalVisible);
    }}
  >
    <View style={styles.centeredView}>
      <View style={styles.repModalView}>
        <Image source={icons.feedback} style={{ height: 40, width: 40 }}/>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            setFeedbackModalVisible(false);
            setModalVisible(true);
          }}
        >
          <Image source={icons.modbackarrow} style={{ height: 35,  width: 30 }}/>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            setFeedbackModalVisible(false);
            setModalVisible(false);
          }}
        >              
          <Image source={icons.xButton} style={{ height: 38, width: 38 }}/>
        </TouchableOpacity>
        <TextInput
          style={styles.feedbackTitle}
          onChangeText={setFeedbackTitle}
          value={feedbackTitle}
          placeholder="Ex: Notification feature"
        />
        <TextInput
          style={styles.feedbackDescription}
          onChangeText={setFeedbackDescription}
          value={feedbackDescription}
          placeholder="Do you have an idea for an improvement or new functionality? How do you like TagaTalk? Tell us!"
        />
        <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
            setFeedbackModalVisible(false);}}>
                <Text style={styles.saveText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default FeedbackModal;
