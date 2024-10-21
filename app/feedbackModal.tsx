import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

type FeedbackModalProps = {
  visible: boolean;
  feedback: string | null;
  onClose: () => void;
};

const FeedbackModal = ({ visible, feedback, onClose }: FeedbackModalProps) => {
  const getTextColor = () => {
    if (feedback === 'Correct!' || feedback === 'All words matched!') {
      return '#58CC02';
    } else if (feedback === 'Woopsie Daisy!') {
      return '#FF5B59';
    } else {
      return 'black';
    }
  };

  const getAdditionalText = () => {
    if (feedback === 'Correct!' || feedback === 'All words matched!') {
      return 'You are awesome!';
    } else {
      return 'Try again, kaibigan. You got this!';
    }
  };

  const getButtonColor = () => {
    if (feedback === 'Correct!' || feedback === 'All words matched!') {
      return '#58CC02';
    } else {
      return '#FF5B59';
    }
  };


  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={[styles.modalText, { color: getTextColor() }]}>{feedback}</Text>
          <Text style={styles.additionalText}>{getAdditionalText()}</Text>
          <TouchableOpacity style={[styles.closeButton, { backgroundColor: getButtonColor() }]} onPress={onClose}>
            <Text style={styles.closeButtonText} >CONTINUE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  additionalText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#9BA5B7', // Change color if needed
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    width: '65%', // Adjust the width here
    height: '28%', // Adjust the max height here
    justifyContent: 'center',
  },
  modalText: {
    fontWeight: 'bold',
    fontSize: 28,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  closeButton: {
    fontSize: 18,
    color: 'white',
    marginTop: 10,
    paddingHorizontal: 30,
    paddingVertical: 5,
    backgroundColor: '#344054',
    borderRadius: 20,
    width: '70%',
    height: '20%',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default FeedbackModal;
