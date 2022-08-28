import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import NotificationsScreen from '../../screens/NotificationsScreen';
import SettingsScreen from '../../screens/SettingsScreen';
import { FONT_EXTRA_BIG } from '../../styleConstants';
import SettingsButton from './SettingsButton';
import { NotificationsNavRouteNames, NotificationsStackNavParamList } from './types';

const Stack = createStackNavigator<NotificationsStackNavParamList>();

function HomeStackNavigator(): React.ReactElement {
  return (
    <Stack.Navigator
      initialRouteName={NotificationsNavRouteNames.NotificationsScreen}
      screenOptions={{
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: FONT_EXTRA_BIG,
        },
      }}
    >
      <Stack.Screen
        name={NotificationsNavRouteNames.NotificationsScreen}
        component={NotificationsScreen}
        options={({ navigation, route }) => ({
          title: 'Notifications',
          headerRight: () =>
            SettingsButton<NotificationsNavRouteNames.NotificationsScreen>({
              navigation: navigation,
              route: route,
            }),
        })}
      />
      <Stack.Screen
        name={NotificationsNavRouteNames.SettingsScreen}
        component={SettingsScreen}
        options={() => ({
          title: 'Settings',
        })}
      />
    </Stack.Navigator>
  );
}

export default HomeStackNavigator;
