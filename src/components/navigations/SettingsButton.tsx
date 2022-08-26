import IonicIcons from '@expo/vector-icons/Ionicons';
import { useTheme } from '@react-navigation/native';
import { NotificationsScreenProps, NotificationsStackNavParamList, NotificationsNavRouteNames } from './types';

function SettingsButton<T extends keyof NotificationsStackNavParamList>({
  navigation,
}: NotificationsScreenProps<T>): React.ReactElement {
  const colors = useTheme().colors;

  return (
    <IonicIcons.Button
      name="settings"
      iconStyle={{ marginRight: 5 }}
      color={colors.text}
      backgroundColor="transparent"
      underlayColor="transparent"
      onPress={() => {
        navigation.navigate(NotificationsNavRouteNames.SettingsScreen);
      }}
    />
  );
}

export default SettingsButton;
