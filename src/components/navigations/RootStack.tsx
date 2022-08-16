import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Heroes from '../../screens/Hereos';
import Home from '../../screens/Home';

export type RootStackParamList = {
  Home: undefined;
  Schedules: undefined;
  Facts: undefined;
  Tags: undefined;
  Heroes: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function RootStack(): React.ReactElement {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Heroes" component={Heroes} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootStack;
