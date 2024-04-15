import React from 'react';
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, Image,Dimensions } from 'react-native';
import { images } from '../constants';
import CustomButton from '../src/components/CustomBtn'; // 경로는 실제 위치에 맞게 수정하세요.

const { width, height } = Dimensions.get('window'); // Get the screen dimensions

const login = () => {
    const router = useRouter();
    
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
        <CustomButton 
          title="가입으로 계속하기" 
          onPress={() => router.push('/InfoInput')}
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
