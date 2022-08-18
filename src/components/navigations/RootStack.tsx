import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import FactsScreen from '../../screens/FactsScreen';
import HeroesScreen from '../../screens/HereosScreen';
import SchedulesScreen from '../../screens/SchedulesScreen';
import TagsScreen from '../../screens/TagsScreen';
import { RootParamListBase, RouteNames } from './interfaces';

const Stack = createStackNavigator<RootParamListBase>();

function RootStack(): React.ReactElement {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={RouteNames.HomeScreen}>
        <Stack.Screen name={RouteNames.HeroesScreen} component={HeroesScreen} />
        <Stack.Screen name={RouteNames.SchedulesScreen} component={SchedulesScreen} />
        <Stack.Screen name={RouteNames.FactsScreen} component={FactsScreen} />
        <Stack.Screen name={RouteNames.TagsScreen} component={TagsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootStack;
