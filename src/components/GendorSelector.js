import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';


const GenderSelector = ({ onSelectGender }) => {
  const [selectedGender, setSelectedGender] = useState(null);

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender); // 선택된 성별 상태 업데이트
    onSelectGender(gender); // 부모 컴포넌트로 선택된 성별 전달
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => handleGenderSelect('female')}
        style={[
          styles.genderOption,
          selectedGender === 'female' && styles.selectedGender, // 조건부 스타일 적용
        ]}
      >
        <Text style={styles.icon}>👩🏻</Text>
      </Pressable>
      <Pressable
        onPress={() => handleGenderSelect('male')}
        style={[
          styles.genderOption,
          selectedGender === 'male' && styles.selectedGender, // 조건부 스타일 적용
        ]}
      >
        <Text style={styles.icon}>👨🏻</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
  },
  genderOption: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    // borderRadius: '50%', 안드로이드 오류 발생
  },
  icon: {
      fontSize: 45,
  },
  selectedGender: {
    backgroundColor: '#D3D3D3', // 선택된 항목의 배경색 변경
  },
});

export default GenderSelector;
