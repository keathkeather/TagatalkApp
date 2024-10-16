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
            <Text style={styles.yesModalButtonText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.noButtonContainer} onPress={onClose}>
            <Text style={styles.noModalButtonText}>No</Text>
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
    width: '74%',
    height: '20%',
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
    right: 35,
    backgroundColor: '#FD9F10',
    borderRadius: 30,
    width: '40%',
    height: '40%',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  noButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 35,
    backgroundColor: '#FFF',
    borderRadius: 30,
    width: '40%',
    height: '40%',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  yesModalButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  noModalButtonText: {
    color: '#D0D5DD',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AlreadyTakenModal;