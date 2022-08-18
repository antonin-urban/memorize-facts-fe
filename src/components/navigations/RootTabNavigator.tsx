import AntIcons from '@expo/vector-icons/AntDesign';
import IoinicIcons from '@expo/vector-icons/Ionicons';
import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import FactsScreen from '../../screens/FactsScreen';
import SchedulesScreen from '../../screens/SchedulesScreen';
import TagsScreen from '../../screens/TagsScreen';
import { RootParamListBase, RouteNames } from './interfaces';

const Tab = createBottomTabNavigator<RootParamListBase>();

const screenOptions = ({ route }): BottomTabNavigationOptions => ({
  tabBarIcon: ({ focused, color, size }) => {
    let iconName;

    console.log(route);

    if (route.name === RouteNames.SchedulesScreen) {
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

function RootTabNavigatior() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen name="SchedulesScreen" component={SchedulesScreen} />
        <Tab.Screen name="FactsScreen" component={FactsScreen} />
        <Tab.Screen name="TagsScreen" component={TagsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default RootTabNavigatior;
