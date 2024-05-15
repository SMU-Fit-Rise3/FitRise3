import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const { width, height } = Dimensions.get('window');

const FoodCaloriePicker = ({ foodName, energyPer100g, onSave }) => {
  const [selectedWeight, setSelectedWeight] = useState(100);
  const [calories, setCalories] = useState((energyPer100g / 100) * selectedWeight);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 초기 값을 onSave로 저장
    onSave(selectedWeight, calories);
  }, []); // 빈 배열을 의존성 배열로 사용하여 컴포넌트가 처음 마운트될 때만 실행

  const handleWeightChange = (itemValue) => {
    setSelectedWeight(itemValue);
    const newCalories = (energyPer100g / 100) * itemValue;
    setCalories(newCalories);
    onSave(itemValue, newCalories);
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.foodName} numberOfLines={4} ellipsizeMode="tail">{foodName}</Text>
        <Text style={styles.calorieText}>{calories.toFixed(0)} kcal</Text>
      </View>
      <Picker
        selectedValue={selectedWeight}
        onValueChange={handleWeightChange}
        style={styles.pickerStyle}
        itemStyle={styles.pickerItemStyle}
      >
        {Array.from({ length: 501 }, (_, i) => (
          <Picker.Item label={`${i * 5} g`} value={i * 5} key={i} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20
  },
  textContainer: {
    width: width * 0.3, // 텍스트 컨테이너 너비 설정
    alignItems: 'flex-start',
    marginRight: 20
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333'
  },
  calorieText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10
  },
  pickerStyle: {
    width: width * 0.4, // Picker의 너비를 텍스트 컨테이너와 동일하게 설정
    height: height * 0.16,
  },
  pickerItemStyle: {
    height: 150
  }
});

export default FoodCaloriePicker;
