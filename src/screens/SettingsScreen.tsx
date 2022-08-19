import { View, Text } from 'react-native';
import { RouteNames, ScreenProps } from '../components/navigations/interfaces';

function SettingsScreen(props: ScreenProps<RouteNames.SettingsScreen>): React.ReactElement {
  console.log(props);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings page </Text>
    </View>
  );
}

export default SettingsScreen;
