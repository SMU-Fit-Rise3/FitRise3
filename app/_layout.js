import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import store from '../src/store';
import { Provider } from 'react-redux';

const Layout = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            // Hide the header for all other routes.
            headerShown: true,
          }}>
          <Stack.Screen name="login" />
        </Stack>
      </SafeAreaProvider>
    </Provider>
  )
}

export default Layout