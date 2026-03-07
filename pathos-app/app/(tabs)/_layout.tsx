import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: '#f8f9fa' } }}>
      <Stack.Screen name="index" options={{ title: "Pathos" }} />
      <Stack.Screen name="survey" options={{ title: "Your Growth Survey" }} />
      <Stack.Screen name="pathway" options={{ title: "Your Blueprint" }} />
    </Stack>
  );
}