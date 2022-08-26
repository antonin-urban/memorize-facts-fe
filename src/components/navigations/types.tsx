import { ParamListBase, NavigatorScreenParams, CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

export enum RootNavRouteNames {
  NotificationsScreen = 'NotificationsScreen',
  SchedulesScreen = 'SchedulesScreen',
  FactsScreen = 'FactsScreen',
  TagsScreen = 'TagsScreen',
  SettingsScreen = 'SettingsScreen',
  NotificationsStackNavigator = 'HomeStackNavigator',
}

export interface RootStackParamList extends ParamListBase {
  NotificationsStackNavigator: NavigatorScreenParams<NotificationsStackNavParamList>;
  SchedulesScreen: undefined;
  FactsScreen: undefined;
  TagsScreen: undefined;
}

export type RootTabNavigationProp<T extends keyof RootStackParamList> = StackScreenProps<RootStackParamList, T>;

export enum NotificationsNavRouteNames {
  NotificationsScreen = 'NotificationsScreen',
  SettingsScreen = 'SettingsScreen',
}

export type NotificationsStackNavParamList = {
  NotificationsScreen: undefined;
  SettingsScreen: undefined;
  HeroesScreen: undefined;
};

export type NotificationsScreenProps<T extends keyof NotificationsStackNavParamList> = CompositeScreenProps<
  StackScreenProps<NotificationsStackNavParamList, T>,
  RootTabNavigationProp<keyof RootStackParamList>
>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface RootParamList extends RootStackParamList {}
  }
}
