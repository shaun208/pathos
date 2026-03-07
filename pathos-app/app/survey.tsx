
import React, { useState, useRef } from 'react'; // <-- 1. Add useRef here
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

const API_URL = 'http://10.180.8.239:3000/api/survey'; // (Keep your actual IP)

export default function Survey() {
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [question, setQuestion] = useState('What area of your life needs a boost?');
  const [loading, setLoading] = useState(false);
  
  // 2. Create the lock
  const isSubmitting = useRef(false); 

  const handleNext = async () => {
    // 3. If input is empty OR if we are already submitting, ignore the press entirely
    if (!input.trim() || isSubmitting.current) return; 
    
    isSubmitting.current = true; // Lock the door
    setLoading(true);

    const newHistory = [...history, { role: 'user', content: input }];
    try {
      console.log("SENDING TO BACKEND:", newHistory);
      const response = await axios.post(API_URL, { messages: newHistory });
      console.log("RECEIVED FROM BACKEND:", response.data);

      const data = response.data;
      if (data.isComplete) {
        const encodedPathway = encodeURIComponent(JSON.stringify(data.pathway));
        router.push({ pathname: '/pathway', params: { data: encodedPathway } });
      } else {
        setQuestion(data.nextQuestion);
        setHistory([...newHistory, { role: 'model', content: data.nextQuestion }]);
        setInput('');
      }
    } catch (err) {
      console.error("AXIOS ERROR:", err);
    } finally {
      // 4. Unlock the door when the request is totally finished
      isSubmitting.current = false; 
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{question}</Text>
      <TextInput style={styles.input} value={input} onChangeText={setInput} />
      {/* 5. Add disabled={loading} as a secondary backup */}
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <Button title="Continue" onPress={handleNext} disabled={loading} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, backgroundColor: '#fff' },
  text: { fontSize: 18, marginBottom: 20, lineHeight: 26 },
  input: { borderBottomWidth: 1, padding: 10, fontSize: 16, marginBottom: 30 }
});