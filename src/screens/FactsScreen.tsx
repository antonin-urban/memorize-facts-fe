import { View, Text } from 'react-native';
import { RouteNames, ScrenProps } from '../components/navigations/interfaces';

function FactsScreen(props: ScrenProps<RouteNames.FactsScreen>): React.ReactElement {
  console.log(props);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Facts page </Text>
    </View>
  );
}

export default FactsScreen;
