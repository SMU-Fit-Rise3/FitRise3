import React from 'react';
import { Pressable, StyleSheet, Image, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window'); // Get the screen dimensions

const FloatingBtn = ({ onPress, imageSource, buttonStyle }) => (
  <Pressable style={[styles.button, buttonStyle]} onPress={onPress}>
    <Image source={imageSource} style={styles.image} />
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 10,
    bottom: height* 0.01, // 탭바의 높이를 고려하여 조정하세요
    width: 50,
    height: 50,
    backgroundColor: '#abb6f9',
    justifyContent: 'center', // 이미지를 버튼 중앙에 위치시키기 위해 추가
    alignItems: 'center', // 이미지를 버튼 중앙에 위치시키기 위해 추가
    borderRadius: 30,
    shadowColor: "#555",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2.62,
    elevation: 10,
  },
  image: {
    width: 25, // 이미지의 크기, 버튼에 맞게 조정하세요
    height: 25, // 이미지의 크기, 버튼에 맞게 조정하세요
    resizeMode: 'contain', // 이미지의 비율을 유지하면서 컨테이너 안에 맞춤
  }
});

export default FloatingBtn;