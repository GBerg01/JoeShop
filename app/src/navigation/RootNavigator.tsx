import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '../store/authStore';
import { MainTabNavigator } from './MainTabNavigator';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { SizeSelectScreen } from '../screens/onboarding/SizeSelectScreen';
import { BrandSelectScreen } from '../screens/onboarding/BrandSelectScreen';
import { CategorySelectScreen } from '../screens/onboarding/CategorySelectScreen';
import { Colors } from '../constants/colors';

const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SizeSelect" component={SizeSelectScreen} />
      <Stack.Screen name="BrandSelect" component={BrandSelectScreen} />
      <Stack.Screen name="CategorySelect" component={CategorySelectScreen} />
    </Stack.Navigator>
  );
}

export function RootNavigator() {
  const { isLoading, isAuthenticated, user, loadStoredAuth } = useAuthStore();

  useEffect(() => {
    loadStoredAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.black, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthStack />
      ) : !user?.onboarded ? (
        <OnboardingStack />
      ) : (
        <MainTabNavigator />
      )}
    </NavigationContainer>
  );
}
