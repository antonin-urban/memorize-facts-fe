import { View, Text } from 'react-native';
import { RouteNames, ScrenProps } from '../components/navigations/interfaces';

function HomeScreen(props: ScrenProps<RouteNames.HomeScreen>): React.ReactElement {
  console.log(props);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home page </Text>
    </View>
  );
}

export default HomeScreen;
