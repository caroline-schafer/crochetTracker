import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getToken() {
  try {
    const token = await AsyncStorage.getItem('access');
    return token;
  } catch (e) {
    console.error('Failed to fetch token:', e);
    return null;
  }
}
