import React from 'react';
import { View, Text } from 'react-native';
import { HomeScreenProps, HomeNavRouteNames } from '../components/navigations/types';

function HomeScreen({ navigation, route }: HomeScreenProps<HomeNavRouteNames.HomeScreen>): React.ReactElement {
  console.log(navigation, route);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home page </Text>
    </View>
  );
}

export default HomeScreen;
