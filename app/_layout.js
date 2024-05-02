import { Stack } from "expo-router";
import store from '../src/store';
import { Provider } from 'react-redux';

const Layout = () => {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="login" />
      </Stack>
    </Provider>
  )
}

export default Layout