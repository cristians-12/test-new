import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BottomTabsParamList } from '../../types/navigation';
import CustomBottomTab from '../../components/organisms/custom-bottom-tab';
import { colors } from '../../utils/colors';
import HomeScreen from '../../screens/home';
import CartScreen from '../../screens/cart';
import PaymentHistoryScreen from '../../screens/payment-history';
import { styles } from './style';


const Tab = createBottomTabNavigator<BottomTabsParamList>();

export default function BottomTabs() {

    return (
        <Tab.Navigator
            tabBar={(props) => <CustomBottomTab {...props} />}

            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: 'white',
                tabBarStyle: {
                    height: 60,
                },
                tabBarHideOnKeyboard: true,
                tabBarIcon: ({ color, size }) => {
                    let iconName: string = 'home';
                    if (route.name === 'CartTab') iconName = 'cart';
                    else if (route.name === 'PaymentHistoryTab') iconName = 'time';
                    return (
                        <Ionicons name={iconName} size={size} color={color} />
                    );
                },
            })}

        >
            <Tab.Screen
                name="HomeTab"
                component={HomeScreen}
                options={
                    {
                        headerShown: false,
                        title: 'Inicio'
                    }}

            />
            <Tab.Screen
                name='CartTab'
                component={CartScreen}
                options={
                    {
                        headerShown: true,
                        title: 'Carrito',
                        headerStyle: styles.headerStyle,
                        headerTitleStyle: styles.titleStyle2

                    }}
            />
            <Tab.Screen
                name='PaymentHistoryTab'
                component={PaymentHistoryScreen}
                options={
                    {
                        headerShown: false,
                        title: 'Historial',
                    }}
            />

        </Tab.Navigator>
    );
}