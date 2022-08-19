import AntIcons from '@expo/vector-icons/AntDesign';
import IoinicIcons from '@expo/vector-icons/Ionicons';
import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import FactsScreen from '../../screens/FactsScreen';
import SchedulesScreen from '../../screens/SchedulesScreen';
import TagsScreen from '../../screens/TagsScreen';
import HomeStackNavigator from './HomeStackNavigator';
import { RootParamListBase, RouteNames } from './interfaces';

const Tab = createBottomTabNavigator<RootParamListBase>();

const screenOptions = ({ route }): BottomTabNavigationOptions => ({
  headerShown: route.name !== RouteNames.HomeStackNavigator,
  tabBarIcon: ({ focused, color, size }) => {
    let iconName;

    if (route.name === RouteNames.HomeStackNavigator) {
      if (focused) {
        iconName = 'home';
      } else {
        iconName = 'home-outline';
      }

      return <IoinicIcons name={iconName} size={size} color={color} />;
    } else if (route.name === RouteNames.SchedulesScreen) {
      if (focused) {
        iconName = 'calendar';
      } else {
        iconName = 'calendar-outline';
      }

      return <IoinicIcons name={iconName} size={size} color={color} />;
    } else if (route.name === RouteNames.FactsScreen) {
      if (focused) {
        iconName = 'infocirlce';
      } else {
        iconName = 'infocirlceo';
      }

      return <AntIcons name={iconName} size={size} color={color} />;
    } else if (route.name === RouteNames.TagsScreen) {
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
          name={RouteNames.HomeStackNavigator}
          component={HomeStackNavigator}
          options={{
            title: 'Home',
          }}
        />
        <Tab.Screen
          name={RouteNames.SchedulesScreen}
          component={SchedulesScreen}
          options={{
            title: 'Schedules',
          }}
        />
        <Tab.Screen
          name={RouteNames.FactsScreen}
          component={FactsScreen}
          options={{
            title: 'Facts',
          }}
        />
        <Tab.Screen
          name={RouteNames.TagsScreen}
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
