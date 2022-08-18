import { View, Text } from 'react-native';
import { RouteNames, ScrenProps } from '../components/navigations/interfaces';

function SchedulesScreen(props: ScrenProps<RouteNames.SchedulesScreen>): React.ReactElement {
  console.log(props);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Schedules page </Text>
    </View>
  );
}

export default SchedulesScreen;
