import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import { useRouter, useSegments, Slot } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider, Theme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/useColorScheme';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

async function getToken() {
  if (Platform.OS === 'web') {
    return await AsyncStorage.getItem('userToken');
  } else {
    return await SecureStore.getItemAsync('userToken');
  }
}

export function isTokenExpired(token) {
  try {
    // Decode JWT payload
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch (error) {
    console.error('Failed to parse token:', error);
    return true; // Treat as expired if parsing fails
  }
}

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const colorScheme = useColorScheme();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = await getToken();
        console.log('Token from storage:', token);

        const isOnTabs = segments.length > 0 && segments[0] === '(tabs)';
        const isOnAuth = segments.length > 0 && segments[0] === '(auth)';

        const allowedAuthenticatedSegments = ['(tabs)', 'project']; // add other authenticated top-level routes here

        if (token && !isTokenExpired(token)) {
          // if current segment not in allowed authenticated segments, redirect to (tabs)
          if (!allowedAuthenticatedSegments.includes(segments[0])) {
            router.replace('/(tabs)');
          }
        } else {
          if (!isOnAuth) {
            router.replace('/(auth)');
          }
        }

      } catch (e) {
        console.error('Error checking auth:', e);
        if (!segments.length || segments[0] !== '(auth)') {
          router.replace('/(auth)');
        }
      } finally {
        setCheckingAuth(false);
      }
    }

    checkAuth();
  }, [segments, router]);

  if (checkingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <ThemeProvider value={theme}>
      <StatusBar style="auto" />
      <Slot />
    </ThemeProvider>
  );
}
