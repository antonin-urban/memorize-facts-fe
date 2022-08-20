import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import HeroesScreen from '../../screens/HereosScreen';
import HomeScreen from '../../screens/HomeScreen';
import SettingsScreen from '../../screens/SettingsScreen';
import SettingsButton from './SettingsButton';
import { HomeNavRouteNames, HomeStackNavParamList } from './types';

const Stack = createStackNavigator<HomeStackNavParamList>();

function HomeStackNavigator(): React.ReactElement {
  return (
    <Stack.Navigator initialRouteName={HomeNavRouteNames.HomeScreen}>
      <Stack.Screen
        name={HomeNavRouteNames.HomeScreen}
        component={HomeScreen}
        options={({ navigation, route }) => ({
          title: 'Home',
          headerRight: () =>
            SettingsButton<HomeNavRouteNames.HomeScreen>({
              navigation: navigation,
              route: route,
            }),
        })}
      />
      <Stack.Screen name={HomeNavRouteNames.HeroesScreen} component={HeroesScreen} />
      <Stack.Screen name={HomeNavRouteNames.SettingsScreen} component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default HomeStackNavigator;
