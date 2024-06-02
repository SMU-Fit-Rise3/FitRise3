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
            headerShown: false, // 기본적으로 헤더를 보이게 설정
          }}>
          <Stack.Screen 
            name="screens/login" 
            options={{ 
              title: '로그인',
              headerShown: false, // 로그인 화면에서는 헤더 숨기기
            }} 
          />
          <Stack.Screen name="screens/caloriesScreen" options={{ title: 'Calories Screen'}} />
          <Stack.Screen name="screens/characterGAN" options={{ title: 'Character GAN'}} />
          <Stack.Screen name="screens/chatScreen" options={{ title: 'Chat Screen' }} />
          <Stack.Screen name="screens/dietInput" options={{ title: 'Diet Input' }} />
          <Stack.Screen name="screens/foodSearchScreen" options={{ title: 'Food Search Screen' }} />
          <Stack.Screen name="screens/InfoInput" options={{ title: '정보 입력'}} />
          <Stack.Screen name="screens/postureCorrection" options={{ title: 'Posture Correction' }} />
        </Stack>
      </SafeAreaProvider>
    </Provider>
  )
}

export default Layout;
