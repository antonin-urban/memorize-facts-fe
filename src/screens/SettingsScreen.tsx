import { View, Text } from 'react-native';
import { NotificationsNavRouteNames, NotificationsScreenProps } from '../components/navigations/types';

function SettingsScreen({
  navigation,
  route,
}: NotificationsScreenProps<NotificationsNavRouteNames.SettingsScreen>): React.ReactElement {
  console.log(navigation, route);
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings page </Text>
    </View>
  );
}

export default SettingsScreen;
