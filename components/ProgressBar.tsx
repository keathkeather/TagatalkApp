import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Progress } from 'tamagui';

const ProgressBar = ({ value, indicatorColor }: { value: number, indicatorColor: string}) => {
    return (
        <View style={{marginBottom:5}}>
            <Progress value={value} style={{
              width: '100%',
              height: 25,
            }}>
                <View style={{ backgroundColor: '#EEF1F4', flex: 1 }}>
                    <Progress.Indicator animation="bouncy" style={{ backgroundColor: indicatorColor, borderRadius: 20 }}/>
                </View>
            </Progress>
        </View>
      )
    }
    
export default ProgressBar

const styles = StyleSheet.create({})