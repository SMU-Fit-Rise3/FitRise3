import React from 'react';
import { View, TextInput, StyleSheet,Dimensions } from 'react-native';
import InputLabelView from './InputLabelView';

const { width, height } = Dimensions.get('window'); // Get the screen dimensions

const InputField = ({ label, textInputProps, viewStyle, inputStyle, placeholder }) => (
  <InputLabelView label={label}>
    <View 
      style={[styles.inputContainer, viewStyle]}  
    >
      <TextInput
        style={[styles.input, inputStyle]}
        placeholderTextColor="#000"
        placeholder ={placeholder}
        {...textInputProps} //text 관련 모든 props
      />
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
  },
  input: {
    height: 30, // 고정 높이를 주어 입력 필드의 크기를 일관되게 만듭니다.
    textAlign: 'right'
  },
});

export default InputField;
