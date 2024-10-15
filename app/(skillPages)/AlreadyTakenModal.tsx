import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

interface AlreadyTakenModalProps {
  visible: boolean;
  onClose: () => void;
  onProceed: () => void;
}

const AlreadyTakenModal: React.FC<AlreadyTakenModalProps> = ({ visible, onClose, onProceed }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Do you want to retake this lesson? No points will be added!</Text>
          <TouchableOpacity style={styles.yesButtonContainer} onPress={onProceed}>
            <Text style={styles.modalButtonText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.noButtonContainer} onPress={onClose}>
            <Text style={styles.modalButtonText}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  yesButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#FD9F10',
    borderRadius: 30,
    width: '40%',
    height: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  noButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FD9F10',
    borderRadius: 30,
    width: '40%',
    height: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  modalButtonText: {
    fontSize: 18,
    color: 'white',
  },
});

export default AlreadyTakenModal;