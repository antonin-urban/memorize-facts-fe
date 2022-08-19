import { View, Text } from 'react-native';
import { RouteNames, ScreenProps } from '../components/navigations/interfaces';

function SchedulesScreen(props: ScreenProps<RouteNames.SchedulesScreen>): React.ReactElement {
  console.log(props);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Schedules page </Text>
    </View>
  );
}

export default SchedulesScreen;
