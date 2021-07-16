import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Navigation } from 'react-native-navigation';
import { createDrawerNavigator } from '@react-navigation/drawer';

export default function Header1(){
    //const openMenu = () => {
    //    
    //}

    return(
        <View style={styles.header}>
            <MaterialIcons name = 'menu' size ={40} /*onPress ={}*/ style={styles.icon}/>
            <Text style={styles.title}>Calendar</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        height: 80,
        paddingTop: 38,
        backgroundColor: 'coral',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold'
    },
    icon: {
        paddingTop: 34,
        position: 'absolute',
        left: 16
    },
})