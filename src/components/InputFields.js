import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import InputLabelView from './InputLabelView';

const InputField = ({ label, textInputProps, extraStyle }) => (
  <InputLabelView label={label}>
    <View style={styles.inputContainer}>
      <TextInput
        style={[styles.input, extraStyle]}
        placeholderTextColor="#999"
        {...textInputProps} //text 관련 모든 props
      />
    </View>
  </InputLabelView>
);

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  input: {
    height: 40, // 고정 높이를 주어 입력 필드의 크기를 일관되게 만듭니다.
  },
});

export default InputField;
