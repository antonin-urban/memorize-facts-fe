import { NativeStackScreenProps } from '@react-navigation/native-stack';

export enum RouteNames {
  HomeScreen = 'HomeScreen',
  SchedulesScreen = 'SchedulesScreen',
  FactsScreen = 'FactsScreen',
  TagsScreen = 'TagsScreen',
  SettingsScreen = 'SettingsScreen',
  HeroesScreen = 'HeroesScreen',
  HomeStackNavigator = 'HomeStackNavigator',
}

export type RootParamListBase = {
  HomeScreen: undefined;
  HomeStackNavigator: undefined;
  SchedulesScreen: undefined;
  FactsScreen: undefined;
  TagsScreen: undefined;
  SettingsScreen: undefined;
  HeroesScreen: undefined;
};

export type ScreenProps<T extends keyof RootParamListBase> = NativeStackScreenProps<RootParamListBase, T>;

export type ScreenNavigationProp<T extends keyof RootParamListBase> = ScreenProps<T>['navigation'];

export type ScreenRouteProp<T extends keyof RootParamListBase> = ScreenProps<T>['route'];
