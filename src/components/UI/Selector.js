import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const Selector = ({ options, onSelectOption }) => {
  const [selectedValue, setSelectedValue] = useState(null);

  const handleSelectOption = (option) => {
    setSelectedValue(option.value); // 선택된 옵션 상태 업데이트
    onSelectOption(option.value); // 부모 컴포넌트로 선택된 옵션 값 전달
  };

  return (
    <View style={styles.container}>
      {options.map((option) => (
        <View key={option.value} style={styles.optionContainer}>
          <Pressable
            onPress={() => handleSelectOption(option)}
            style={[
              styles.option,
              selectedValue === option.value && styles.selectedOption, // 조건부 스타일 적용
            ]}
          >
            <Text style={styles.icon}>{option.icon}</Text>
          </Pressable>
          <Text style={styles.labelText}>{option.label}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  optionContainer: {
    alignItems: 'center',
    margin: 10,
  },
  option: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 50,
    marginBottom: 10,
  },
  icon: {
    fontSize: 35,
  },
  selectedOption: {
    backgroundColor: '#D3D3D3',
  },
  labelText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Selector;
