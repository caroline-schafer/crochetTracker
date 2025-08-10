import { View, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function AuthLanding() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Login" onPress={() => router.push('(auth)/login')} />
      <Button title="Sign Up" onPress={() => router.push('(auth)/signup')} />
    </View>
  );
}
