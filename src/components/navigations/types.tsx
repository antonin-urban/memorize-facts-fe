import { ParamListBase, NavigatorScreenParams, CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

// export type ScreenProps<
//   ParamList extends ParamListBase,
//   RouteName extends keyof ParamList = string,
// > = NativeStackScreenProps<ParamList, RouteName>;

// export type ScreenNavigationProp<
//   ParamList extends ParamListBase,
//   RouteName extends keyof ParamList = string,
// > = ScreenProps<ParamList, RouteName>['navigation'];

// export type ScreenRouteProp<ParamList extends ParamListBase, RouteName extends keyof ParamList = string> = ScreenProps<
//   ParamList,
//   RouteName
// >['route'];

export enum RootNavRouteNames {
  HomeScreen = 'HomeScreen',
  SchedulesScreen = 'SchedulesScreen',
  FactsScreen = 'FactsScreen',
  TagsScreen = 'TagsScreen',
  SettingsScreen = 'SettingsScreen',
  HeroesScreen = 'HeroesScreen',
  HomeStackNavigator = 'HomeStackNavigator',
}

export interface RootStackParamList extends ParamListBase {
  HomeStackNavigator: NavigatorScreenParams<HomeStackNavParamList>;
  SchedulesScreen: undefined;
  FactsScreen: undefined;
  TagsScreen: undefined;
}

export type RootTabNavigationProp<T extends keyof RootStackParamList> = StackScreenProps<RootStackParamList, T>;

export enum HomeNavRouteNames {
  HomeScreen = 'HomeScreen',
  HeroesScreen = 'HeroesScreen',
  SettingsScreen = 'SettingsScreen',
}

export type HomeStackNavParamList = {
  HomeScreen: undefined;
  SettingsScreen: undefined;
  HeroesScreen: undefined;
};

export type HomeScreenProps<T extends keyof HomeStackNavParamList> = CompositeScreenProps<
  StackScreenProps<HomeStackNavParamList, T>,
  RootTabNavigationProp<keyof RootStackParamList>
>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface RootParamList extends RootStackParamList {}
  }
}
