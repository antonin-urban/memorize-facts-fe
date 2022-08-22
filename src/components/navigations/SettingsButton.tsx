import IonicIcons from '@expo/vector-icons/Ionicons';
import { useTheme } from '@react-navigation/native';
import { HomeScreenProps, HomeStackNavParamList, HomeNavRouteNames } from './types';

function SettingsButton<T extends keyof HomeStackNavParamList>({ navigation }: HomeScreenProps<T>): React.ReactElement {
  const colors = useTheme().colors;

  return (
    <IonicIcons.Button
      name="settings"
      iconStyle={{ marginRight: 5 }}
      color={colors.text}
      backgroundColor="transparent"
      underlayColor="transparent"
      onPress={() => {
        navigation.navigate(HomeNavRouteNames.SettingsScreen);
      }}
    />
  );
}

export default SettingsButton;
