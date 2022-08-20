import { View, Text } from 'react-native';
import { HomeNavRouteNames, HomeScreenProps } from '../components/navigations/types';

function SettingsScreen({ navigation, route }: HomeScreenProps<HomeNavRouteNames.SettingsScreen>): React.ReactElement {
  console.log(navigation, route);
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings page </Text>
    </View>
  );
}

export default SettingsScreen;
