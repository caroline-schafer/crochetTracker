import { View, Text, TextInput, Button, StyleSheet, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import api from '../../services/api';

async function saveToken(token) {
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem('userToken', token);
  } else {
    await SecureStore.setItemAsync('userToken', token);
  }
}

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter username and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/users/login/', { username, password });
      // Assuming your backend returns the access token under "access"
      const { access } = response.data;

      if (!access) {
        Alert.alert('Login Failed', 'Invalid response from server.');
        setLoading(false);
        return;
      }

      await saveToken(access);
      router.replace('(tabs)'); // Navigate to protected tabs on success
    } catch (error) {
      // You can improve this by inspecting error.response for backend errors
      const message = error.response?.data?.error || 'Failed to connect to server.';
      Alert.alert('Login Failed', message);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title={loading ? 'Logging In...' : 'Log In'} onPress={onLogin} disabled={loading} />
      <Button title="Go to Signup" onPress={() => router.push('(auth)/signup')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', paddingHorizontal: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
});
