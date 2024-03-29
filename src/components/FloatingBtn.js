import React from 'react';
import { Pressable, StyleSheet, Image } from 'react-native';

const FloatingBtn = ({ onPress, imageSource, buttonStyle }) => (
  <Pressable style={[styles.button, buttonStyle]} onPress={onPress}>
    <Image source={imageSource} style={styles.image} />
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 30,
    bottom: 80, // 탭바의 높이를 고려하여 조정하세요
    width: 60,
    height: 60,
    backgroundColor: '#CECEF6',
    justifyContent: 'center', // 이미지를 버튼 중앙에 위치시키기 위해 추가
    alignItems: 'center', // 이미지를 버튼 중앙에 위치시키기 위해 추가
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 10,
  },
  image: {
    width: 30, // 이미지의 크기, 버튼에 맞게 조정하세요
    height: 30, // 이미지의 크기, 버튼에 맞게 조정하세요
    resizeMode: 'contain', // 이미지의 비율을 유지하면서 컨테이너 안에 맞춤
  }
});

export default FloatingBtn;