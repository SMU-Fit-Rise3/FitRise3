import React from 'react';
import { View, TextInput, Text, StyleSheet, Dimensions } from 'react-native';
import InputLabelView from './InputLabelView';

const { width, height } = Dimensions.get('window'); // Get the screen dimensions

const InputField = ({ label, textInputProps, viewStyle, inputStyle, placeholder, unit, unitStyle }) => (
  <InputLabelView label={label}>
    <View 
      style={[styles.inputContainer, viewStyle, { flexDirection: 'row', alignItems: 'center' }]}  
    >
      <TextInput
        style={[styles.input, inputStyle]}
        placeholderTextColor="#000"
        placeholder={placeholder}
        {...textInputProps} //text 관련 모든 props
        keyboardType="numeric"
      />
      <Text 
        style={[styles.unitLabel, unitStyle]}
      >{unit}</Text>
    </View>
  </InputLabelView>
);

const styles = StyleSheet.create({
  inputContainer: {
    width: width * 0.42,
    height: 45,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'space-between' // 입력 필드와 라벨을 양 끝으로 분리합니다.
  },
  input: {
    flex: 1,
    height: 30, // 고정 높이를 주어 입력 필드의 크기를 일관되게 만듭니다.
    textAlign: 'right'
  },
  unitLabel: {
    marginLeft: 10, // 단위 라벨과 입력 필드 사이에 간격을 줍니다.
    fontSize: 16
  }
});

export default InputField;
