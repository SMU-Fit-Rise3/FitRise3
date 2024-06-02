import React, { useEffect, useState } from 'react';
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { images } from '../../constants';
import { CustomBtn } from '../../src/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from "../../src/api";
import * as Font from "expo-font";

const { width, height } = Dimensions.get('window'); // Get the screen dimensions

const Login = () => {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function loadResourcesAndData() {
      try {
        // Pre-load fonts
        await Font.loadAsync({
          Bold: require('../../src/assets/font/Gaegu-Bold.ttf'),
          Regular: require('../../src/assets/font/Gaegu-Regular.ttf'),
          Light: require('../../src/assets/font/Gaegu-Light.ttf'),
          Jua: require('../../src/assets/font/Jua-Regular.ttf'),
        });

        // Check if the user is already logged in
        const userNickName = await AsyncStorage.getItem('key');
        if (userNickName) {
          const res = await API.checkNickName(userNickName);
          if (res.ok) {
            console.log("로그인 닉네임:" + userNickName);
            router.push('tabs/mainScreen');
            return; // Return early if user is logged in
          }
        }
        
        setIsReady(true); // Set ready state only if fonts are loaded and user is not logged in
      } catch (error) {
        console.error("Error loading resources and data", error);
      }
    }

    loadResourcesAndData();
  }, []);

  if (!isReady) {
    return null; // 리소스 로딩 중에는 렌더링을 방지
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={images.login_image}
          style={styles.image}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.quoteText}>건강보다 나은 재산은 없다 💪🏼</Text>
        <Text style={styles.descriptionText}>
          저희 FitRise가 몸 건강, 정신 건강까지{"\n"} 챙길 수 있도록 함께할게요. :)
        </Text>
      </View>
      <CustomBtn
        title="가입으로 계속하기"
        textStyle={{fontFamily:"Jua", fontSize:24}}
        onPress={() => router.push('screens/InfoInput')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: height,
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quoteText: {
    fontFamily:"Jua",
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000',
  },
  descriptionText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#555',
    fontFamily:"Bold"
  },
});

export default Login;
