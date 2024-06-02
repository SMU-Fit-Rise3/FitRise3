import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const InputLabelView = ({ label, children }) => {
  return (
    <View style={styles.labelContainer}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  labelContainer: {
    marginVertical: 20, // 라벨이 있는 View 사이의 간격을 조절할 수 있습니다.
  },
  label: {
    position: 'absolute', // 라벨을 자식 컴포넌트의 위에 띄우기 위함입니다.
    top: -30, // 라벨의 상단 위치를 자식 컴포넌트에 맞게 조정할 수 있습니다.
    margin: 10, // 라벨의 패딩을 조절할 수 있습니다.
    zIndex: 10, // 라벨을 다른 요소들 위에 띄우기 위함입니다.
    fontWeight: 'bold', // 라벨의 글씨 두께입니다.
    fontSize: 20,
    color:"#333",
    fontFamily:"Jua"
  },
});

export default InputLabelView;
