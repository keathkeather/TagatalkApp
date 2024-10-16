import React from 'react';
import { View, Text, Modal, Button, StyleSheet } from 'react-native';

interface LessonIncompleteModalProps {
  visible: boolean;
  onClose: () => void;
}

const LessonIncompleteModal: React.FC<LessonIncompleteModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Please complete the previous lesson first.</Text>
          <Button onPress={onClose} title="Okay" color="#FD9F10" />
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
});

export default LessonIncompleteModal;