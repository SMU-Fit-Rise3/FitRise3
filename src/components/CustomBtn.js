import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomButton = ({ onPress, title }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    width: '100%', // 버튼 너비를 원하는 대로 조절하세요.
    padding: 15,
    backgroundColor: '#FFD700', // 버튼 배경색을 원하는 대로 조절하세요.
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF', // 버튼 글씨 색상을 원하는 대로 조절하세요.
  },
});

export default CustomButton;
