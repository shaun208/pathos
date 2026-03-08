import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>HackTJ 13.0</Text>
        </View>
        
        <Text style={styles.title}>Pathos</Text>
        


        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/survey')}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Improve yourself</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F9FAFB' 
  },
  content: { 
    flex: 1, 
    padding: 32, 
    justifyContent: 'center', 
    alignItems: 'flex-start' 
  },
  badge: { 
    backgroundColor: '#111827', 
    paddingVertical: 6, 
    paddingHorizontal: 12, 
    borderRadius: 12, 
    marginBottom: 24 
  },
  badgeText: { 
    color: '#ffffff', 
    fontSize: 12, 
    fontWeight: '800', 
    letterSpacing: 1.5 
  },
  title: { 
    fontSize: 48, 
    fontWeight: '900', 
    color: '#111827', 
    lineHeight: 54, 
    marginBottom: 20 
  },
  subtitle: { 
    fontSize: 18, 
    color: '#6B7280', 
    lineHeight: 28, 
    marginBottom: 48, 
    fontWeight: '500' 
  },
  button: { 
    backgroundColor: '#111827', 
    paddingVertical: 20, 
    paddingHorizontal: 32, 
    borderRadius: 16, 
    width: '100%', 
    alignItems: 'center', 
    shadowColor: '#111827', 
    shadowOffset: { width: 0, height: 8 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 12, 
    elevation: 6 
  },
  buttonText: { 
    color: '#ffffff', 
    fontSize: 18, 
    fontWeight: '800' 
  }
});