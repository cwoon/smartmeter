import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Icon } from "react-native-elements";

import HomeScreen from './screen/home';
import calendar from './screen/calendar';
import Bill from './screen/bill';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function BillScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Calendar" component={calendar}
        options={(props) => {
          const { navigation, route } = props;
          return ({
            title: 'Calendar',
            headerStyle: {
              backgroundColor: 'coral',
              height: 80,
            },
            headerTitleAlign: "center",
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ flexDirection: "row", paddingLeft: 16, paddindTop: 34 }}>
                <Icon
                  name='md-menu'
                  type='ionicon'
                  color='white'
                  size={40}
                />
              </TouchableOpacity>
            )
          })
        }}
      />
      <Stack.Screen name="TotalBill" component={Bill} />
    </Stack.Navigator>
  )
};

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Usage" component={HomeScreen} />
        <Drawer.Screen name="Calculate Bill" component={BillScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}