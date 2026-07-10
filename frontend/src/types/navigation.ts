import {
    CompositeNavigationProp,
    NavigationProp,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
    Splash: undefined;
};

export type BottomTabsParamList = {
    HomeTab: undefined;
};

export type CustomNavigationProps = CompositeNavigationProp<
    NativeStackNavigationProp<RootStackParamList>,
    BottomTabNavigationProp<BottomTabsParamList>
>;

export type StackNavigation = NavigationProp<RootStackParamList>;