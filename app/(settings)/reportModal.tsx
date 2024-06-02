import React, { useEffect, useState } from 'react';
import { Text, Modal, View, Image, TouchableOpacity, TextInput, Button, Alert } from 'react-native';
import icons from '../../constants/icons'
import { styles } from './helpDeskModalStyles';
import { report } from '~/components/report';
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
    const [newReportTitle , setNewReportTitle] = useState('');
    const [newReportDescription , setNewReportDescription] = useState('');
    const [shouldReport, setShouldReport] = useState(false);
    useEffect(()=>{
        const handleReport = async()=>{
            const succesful =await report(newReportTitle, newReportDescription);
            if(succesful == true){
                setReportModalVisible(false);
                // Success message to be improved
                Alert.alert("Success!", "Your report has been sent.");
            }
        };
        if (shouldReport) {
            handleReport();
            setShouldReport(false);  // reset the trigger
        }
    },[shouldReport])
    const ReportHandler = () => {
        if (!newReportTitle || !newReportDescription) {
          // Show an alert if either of the inputs is blank
          Alert.alert("Error", "Please fill in both title and description.");
        } else {
          // If both inputs are filled, trigger the report
          setShouldReport(true);
        }
      }
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
                onChangeText={text=>setNewReportTitle(text)}
                placeholder="Ex: Title not working as expected"
                />
                <TextInput
                style={styles.bugDescription}
                multiline
                onChangeText={text=>setNewReportDescription(text)}
                placeholder="Is something not working well? We want to fix it. Tell us in detail what happened..."
                />
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => {
                        if (!newReportTitle || !newReportDescription) {
                            // Show an alert if either of the inputs is null
                            Alert.alert("Error", "Please fill in both title and description.");
                        } else {
                            ReportHandler();
                            setReportModalVisible(false);
                        }
                    }}>
                    <Text style={styles.saveText}>Send</Text>
                </TouchableOpacity>
            </View>
            </View>
        </Modal>
    );
};
export default ReportModal;

