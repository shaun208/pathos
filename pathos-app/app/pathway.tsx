import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Pathway() {
  const params = useLocalSearchParams();
  
  let steps = [];
  try {
    if (params.data) {
      const rawData = decodeURIComponent(String(params.data));
      steps = JSON.parse(rawData);
    }
  } catch (error) {
    console.error("JSON Parsing Error:", error);
    steps = [{ step: "Error", description: "Could not load the pathway." }];
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Personalized Blueprint</Text>
      <FlatList
        data={steps}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.stepTitle}>{item.step}</Text>
            <Text style={styles.stepDesc}>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fdfdfd' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: { padding: 15, backgroundColor: '#fff', borderRadius: 10, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1 },
  stepTitle: { fontSize: 18, fontWeight: '600', color: '#2c3e50' },
  stepDesc: { fontSize: 14, color: '#555', marginTop: 5 }
});