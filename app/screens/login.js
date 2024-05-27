import React, { useEffect } from 'react';
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { images } from '../../constants';
import { CustomBtn } from '../../src/components'
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from "../../src/api"

const { width, height } = Dimensions.get('window'); // Get the screen dimensions

const login = () => {
  const router = useRouter();

  // 이미 로그인된 유저일시 메인 스크린으로 이동
  useEffect(() => {
    const checkStorageAndNavigate = async () => {
      const userNickName = await AsyncStorage.getItem('key');
      API.checkNickName(userNickName).then((res) => {
        if (res.ok) {        
          console.log("로그인 닉네임:" + userNickName)
          router.push('tabs/mainScreen');
        }
      })
    };
    checkStorageAndNavigate();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={images.login_image}
          style={styles.image}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.quoteText}>“건강보다 나은 재산은 없다”</Text>
        <Text style={styles.descriptionText}>
          저희 FitRise가 볼 건강, 정신 건강까지 챙길 수 있도록 함께할게요. :)
        </Text>
      </View>
      <CustomBtn
        title="가입으로 계속하기"
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
    backgroundColor: '#FFFFFF', // 여기서 배경색을 원하는 색상으로 설정하세요.
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width, // 이미지 크기를 원하는 대로 조절하세요.
    height: height, // 이미지 높이를 원하는 대로 조절하세요.
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quoteText: {
    fontFamily: 'jua',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#000', // 글씨 색상을 원하는 대로 조절하세요.
  },
  descriptionText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#555', // 글씨 색상을 원하는 대로 조절하세요.
  },
});

export default login;
