import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, Text, Button } from 'react-native';
import { RootStackParamList } from '../components/navigations/RootStack';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

function Home(props: Props): React.ReactElement {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>React native rxdb example </Text>
      <Button testID="btn-navigate" onPress={(): void => props.navigation.navigate('Heroes')} title="Go to Heroes" />
    </View>
  );
}

export default Home;
