import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import HeroesScreen from '../../screens/HereosScreen';
import HomeScreen from '../../screens/HomeScreen';
import SettingsScreen from '../../screens/SettingsScreen';
import { RootParamListBase, RouteNames } from './interfaces';
import SettingsButton from './SettingsButton';

const Stack = createStackNavigator<RootParamListBase>();

function HomeStackNavigator(): React.ReactElement {
  return (
    <Stack.Navigator initialRouteName={RouteNames.HomeScreen}>
      <Stack.Screen
        name={RouteNames.HomeScreen}
        component={HomeScreen}
        options={(navigation) => ({
          title: 'Home',
          headerRight: () => SettingsButton<RouteNames.HomeScreen>(navigation.navigation),
        })}
      />
      <Stack.Screen name={RouteNames.HeroesScreen} component={HeroesScreen} />
      <Stack.Screen name={RouteNames.SettingsScreen} component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default HomeStackNavigator;
