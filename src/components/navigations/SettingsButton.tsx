import IonicIcons from '@expo/vector-icons/Ionicons';
import { useTheme } from '@react-navigation/native';
import { RootParamListBase, RouteNames, ScreenNavigationProp } from './interfaces';

function SettingsButton<T extends keyof RootParamListBase>(navigation: ScreenNavigationProp<T>): JSX.Element {
  console.log(navigation);
  const colors = useTheme().colors;
  return (
    <IonicIcons.Button
      name="settings"
      iconStyle={{ marginRight: 5 }}
      color={colors.text}
      backgroundColor="transparent"
      underlayColor="transparent"
      onPress={() => {
        navigation.navigate(RouteNames.SettingsScreen);
      }}
    />
  );
}

export default SettingsButton;
