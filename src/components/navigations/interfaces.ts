import { NativeStackScreenProps } from '@react-navigation/native-stack';

export enum RouteNames {
  HomeScreen = 'HomeScreen',
  SchedulesScreen = 'SchedulesScreen',
  FactsScreen = 'FactsScreen',
  TagsScreen = 'TagsScreen',
  SettingsScreen = 'SettingsScreen',
  HeroesScreen = 'HeroesScreen',
}

export type RootParamListBase = {
  HomeScreen: undefined;
  SchedulesScreen: undefined;
  FactsScreen: undefined;
  TagsScreen: undefined;
  SettingsScreen: undefined;
  HeroesScreen: undefined;
};

export type ScrenProps<T extends keyof RootParamListBase> = NativeStackScreenProps<RootParamListBase, T>;
