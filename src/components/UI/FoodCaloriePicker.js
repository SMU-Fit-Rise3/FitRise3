import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

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
      <Text style={styles.foodName}>{foodName}</Text>
      <Text style={styles.calorieText}>{calories.toFixed(0)} kcal</Text>
      <Picker
        selectedValue={selectedWeight}
        onValueChange={handleWeightChange}
        style={styles.pickerStyle}
        itemStyle={styles.pickerItemStyle}
      >
        {Array.from({ length: 5001 }, (_, i) => (
          <Picker.Item label={`${i} g`} value={i} key={i} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  },
  calorieText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10
  },
  pickerStyle: {
    width: 200,
    height: 150,
  },
  pickerItemStyle: {
    height: 150
  }
});

export default FoodCaloriePicker;
