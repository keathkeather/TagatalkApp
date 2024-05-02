import { StyleSheet, Text, View, Modal, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import icons from '../../constants/icons'
import ReportModal from './reportModal';
import { styles } from './sharedStyles';
import FeedbackModal from './feedbackModal';

type HelpDeskProps = {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const HelpDesk: React.FC<HelpDeskProps> = ({ modalVisible, setModalVisible }) => {

const [reportModalVisible, setReportModalVisible] = useState(false);
const [reportTitle, setReportTitle] = useState('');
const [reportDescription, setReportDescription] = useState('');
const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
const [feedbackTitle, setFeedbackTitle] = useState('');
const [feedbackDescription, setFeedbackDescription] = useState('');

  return (
    <View style={styles.centeredView}>
        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(!modalVisible)}>
              <Image source={icons.xButton} 
                style={{ height: 38, width: 38, }}/>
              </TouchableOpacity>
              <Text style={styles.modalText}>What do you want to cook?</Text>
              <TouchableOpacity style={styles.optionContainer}
                    onPress={() => {setReportModalVisible(true);}}>
                <View style={styles.modalContainer}>
                  <Image source={icons.bug} 
                    style={{ height: 40, width: 40, }}/>
                  <Text style={styles.someTextStyle}>Bug Report or Issue</Text>                
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionContainer}
                  onPress={() => {setFeedbackModalVisible(true);}}>
                <View style={styles.modalContainer}>
                  <Image source={icons.feedback} 
                    style={{ height: 40, width: 40, }}/>
                  <Text style={styles.someTextStyle}>Feedback or Ideas</Text>                
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <ReportModal 
          reportModalVisible={reportModalVisible} 
          setReportModalVisible={setReportModalVisible} 
          setModalVisible={setModalVisible} 
          reportDescription={reportDescription} 
          setReportDescription={setReportDescription}
          reportTitle={reportTitle} 
          setReportTitle={setReportTitle}
        />
        <FeedbackModal 
          feedbackModalVisible={feedbackModalVisible} 
          setFeedbackModalVisible={setFeedbackModalVisible} 
          setModalVisible={setModalVisible} 
          feedbackDescription={feedbackDescription} 
          setFeedbackDescription={setFeedbackDescription}
          feedbackTitle={feedbackTitle} 
          setFeedbackTitle={setFeedbackTitle}
        />
    </View>
  );
}

export default HelpDesk;

