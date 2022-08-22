import AntIcons from '@expo/vector-icons/AntDesign';
import IoinicIcons from '@expo/vector-icons/Ionicons';
import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import FactsScreen from '../../screens/FactsScreen';
import SchedulesScreen from '../../screens/SchedulesScreen';
import TagsScreen from '../../screens/TagsScreen';
import { FONT_EXTRA_BIG } from '../../styleConstants';
import HomeStackNavigator from './HomeNavigator';
import { RootNavRouteNames, RootStackParamList } from './types';

const Tab = createBottomTabNavigator<RootStackParamList>();

const screenOptions = ({ route }): BottomTabNavigationOptions => ({
  headerShown: route.name !== RootNavRouteNames.HomeStackNavigator,
  headerTitleStyle: {
    fontWeight: 'bold',
    fontSize: FONT_EXTRA_BIG,
  },
  tabBarIcon: ({ focused, color, size }) => {
    let iconName;

    if (route.name === RootNavRouteNames.HomeStackNavigator) {
      if (focused) {
        iconName = 'home';
      } else {
        iconName = 'home-outline';
      }

      return <IoinicIcons name={iconName} size={size} color={color} />;
    } else if (route.name === RootNavRouteNames.SchedulesScreen) {
      if (focused) {
        iconName = 'calendar';
      } else {
        iconName = 'calendar-outline';
      }

      return <IoinicIcons name={iconName} size={size} color={color} />;
    } else if (route.name === RootNavRouteNames.FactsScreen) {
      if (focused) {
        iconName = 'infocirlce';
      } else {
        iconName = 'infocirlceo';
      }

      return <AntIcons name={iconName} size={size} color={color} />;
    } else if (route.name === RootNavRouteNames.TagsScreen) {
      if (focused) {
        iconName = 'tag';
      } else {
        iconName = 'tago';
      }

      return <AntIcons name={iconName} size={size} color={color} />;
    }
  },
});

function RootTabNavigatior(): React.ReactElement {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen
          name={RootNavRouteNames.HomeStackNavigator}
          component={HomeStackNavigator}
          options={{
            title: 'Home',
          }}
        />
        <Tab.Screen
          name={RootNavRouteNames.SchedulesScreen}
          component={SchedulesScreen}
          options={{
            title: 'Schedules',
          }}
        />
        <Tab.Screen
          name={RootNavRouteNames.FactsScreen}
          component={FactsScreen}
          options={{
            title: 'Facts',
          }}
        />
        <Tab.Screen
          name={RootNavRouteNames.TagsScreen}
          component={TagsScreen}
          options={{
            title: 'Tags',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default RootTabNavigatior;
