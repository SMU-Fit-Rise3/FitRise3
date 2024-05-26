// SearchInput.js
import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const SearchInput = ({ query, handleSearch }) => {
  return (
    <TextInput
      style={styles.input}
      placeholder="음식 이름 또는 제조사 검색"
      value={query}
      onChangeText={handleSearch}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 45,
    borderColor: 'gray',
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius:30,
    backgroundColor:"#fff"
  }
});

export default SearchInput;
