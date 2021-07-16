import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { useNavigation, DrawerActions} from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Icon } from "react-native-elements";
import { Navigation } from 'react-native-navigation';
import { createDrawerNavigator } from '@react-navigation/drawer';

export default function Header() {

    const HeaderLeft = () => {
        const navigation = useNavigation();
        return (
            <View style={{ flexDirection: 'row', position: 'absolute', left: 16}}>
                <TouchableOpacity onPress={() => { navigation.dispatch(DrawerActions.openDrawer()); }} style={{ flexDirection: "row", paddingTop: 33 }}>
                    <Icon
                        name='md-menu'
                        type='ionicon'
                        color='white'
                        size={40}
                    />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.header}>
            <HeaderLeft/>
            <Text style={styles.title}>Current Usage</Text>
        </View>
    )
}
//<MaterialIcons name='menu' size={40} /*onPress ={}*/ style={styles.icon} />
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
