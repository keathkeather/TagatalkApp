import React, { useEffect, useState } from 'react';
import { Text, Modal, View, Image, TouchableOpacity, TextInput, Button } from 'react-native';
import icons from '../../constants/icons'
import { styles } from './sharedStyles';

const ReportModal = ({ 
    reportModalVisible, 
    setReportModalVisible, 
    setModalVisible, 
    reportDescription, 
    setReportDescription,
    reportTitle,
    setReportTitle 
}: {
    reportModalVisible: boolean,
    setReportModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
    reportDescription: string,
    setReportDescription: React.Dispatch<React.SetStateAction<string>>,
    reportTitle: string,
    setReportTitle: React.Dispatch<React.SetStateAction<string>>
}) => {
    
    return (
        <Modal
            transparent={true}
            visible={reportModalVisible}
            onRequestClose={() => {
            setReportModalVisible(!reportModalVisible);
            }}
        >
            <View style={styles.centeredView}>
            <View style={styles.repModalView}>
                <Image source={icons.bug} style={{ height: 40, width: 40 }}/>
                <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                    setReportModalVisible(false);
                    setModalVisible(true);
                }}
                >
                <Image source={icons.modbackarrow} style={{ height: 35,  width: 30 }}/>
                </TouchableOpacity>
                <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                    setReportModalVisible(false);
                    setModalVisible(false);
                }}
                >              
                <Image source={icons.xButton} style={{ height: 38, width: 38 }}/>
                </TouchableOpacity>
                <TextInput
                style={styles.bugTitle}
                onChangeText={setReportTitle}
                value={reportTitle}
                placeholder="Ex: Title not working as expected"
                />
                <TextInput
                style={styles.bugDescription}
                onChangeText={setReportDescription}
                value={reportDescription}
                placeholder="Is something not working well? We want to fix it. Tell us in detail what happened..."
                />
                <TouchableOpacity
                    style={styles.saveButton}onPress={() => {
                        setReportModalVisible(false);
                    }}
                    >
                    <Text style={styles.saveText}>Send</Text>
                </TouchableOpacity>
            </View>
            </View>
        </Modal>
    );
};
export default ReportModal;

