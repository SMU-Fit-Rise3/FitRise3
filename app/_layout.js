import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Layout = () => {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          // Hide the header for all other routes.
          headerShown: true,
        }}>
        <Stack.Screen name="login" />
      </Stack>
    </SafeAreaProvider>
  )
}

export default Layout