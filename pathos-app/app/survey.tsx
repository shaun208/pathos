import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

// 🛑 REPLACE WITH YOUR ACTUAL WINDOWS IPV4 ADDRESS 🛑
const API_URL = 'http://192.168.56.1:3000/api/survey'; 

export default function Survey() {
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [question, setQuestion] = useState('What area of your life (social, mental, emotional) needs a boost?');
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const newHistory = [...history, { role: 'user', content: input }];
    try {
      const response = await axios.post(API_URL, { messages: newHistory });
      const data = response.data;

      if (data.isComplete) {
        // Encode the JSON to prevent the crash we fixed earlier
        const encodedPathway = encodeURIComponent(JSON.stringify(data.pathway));
        router.push({ pathname: '/pathway', params: { data: encodedPathway } });
      } else {
        setQuestion(data.nextQuestion);
        setHistory([...newHistory, { role: 'model', content: data.nextQuestion }]);
        setInput('');
      }
    } catch (err) {
      console.error("Backend Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{question}</Text>
      <TextInput style={styles.input} value={input} onChangeText={setInput} placeholder="Type here..." />
      {loading ? <ActivityIndicator size="large" color="#000" /> : <Button title="Continue" onPress={handleNext} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, backgroundColor: '#fff' },
  text: { fontSize: 18, marginBottom: 20, lineHeight: 26 },
  input: { borderBottomWidth: 1, padding: 10, fontSize: 16, marginBottom: 30 }
});