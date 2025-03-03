import { Stack } from "expo-router";

export default function RootLayout() {
  return( 
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{title: "AC9692's Login"}} />
      <Stack.Screen name="home" options={{title: "AC9692's list"}} />
    </Stack>
  )
}
