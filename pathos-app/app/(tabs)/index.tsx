import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Welcome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Become your best self.</Text>
      <Text style={styles.subtitle}>Let AI build your emotional and mental roadmap.</Text>
      <Button title="Start Survey" onPress={() => router.push('/survey')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 16, textAlign: 'center', marginVertical: 20, color: '#666' }
});