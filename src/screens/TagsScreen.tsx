import { View, Text } from 'react-native';
import { ScrenProps, RouteNames } from '../components/navigations/interfaces';

function TagsScreen(props: ScrenProps<RouteNames.TagsScreen>): React.ReactElement {
  console.log(props);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Tags page </Text>
    </View>
  );
}

export default TagsScreen;
