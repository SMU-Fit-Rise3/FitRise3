// MealList.js
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import ColorToggleButton from "../UI/ColorToggleButton";

const mealTypes = [
  { label: 'Breakfast', value: 'Breakfast', icon: 'coffee' },
  { label: 'Lunch', value: 'Lunch', icon: 'food-variant' },
  { label: 'Dinner', value: 'Dinner', icon: 'silverware-fork-knife' },
  { label: 'Snack', value: 'Snack', icon: 'cupcake' },
];

const mealsData = {
  Breakfast: [
    { id: 'B1', title: '연어 초밥', time: '7am', calories: '450' },
    // ... 다른 아침 식사 데이터
  ],
  Lunch: [
    // ... 점심 식사 데이터
    { id: 'L1', title: '저지방 우유', time: '11am', calories: '90' },
  ],
  Dinner: [
    // ... 저녁 식사 데이터
    { id: 'D1', title: '닭가슴살', time: '5pm', calories: '300' },
  ],
  Snack: [
    // ... 간식 데이터
    { id: 'S1', title: '그릭 요거트', time: '8am', calories: '100' },
    { id: 'S2', title: '벌꿀집', time: '8am', calories: '60' },
  ],
};

const MealList = () => {
  const [selectedMealType, setSelectedMealType] = useState('Breakfast');
  const meals = mealsData[selectedMealType];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>오늘의 식단</Text>
        <ColorToggleButton
          mealTypes={mealTypes}
          onMealTypeChange={setSelectedMealType}
        />
      </View>
      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MealItem meal={item} />}
        style={styles.list}
      />
    </View>
  );
};

const MealItem = ({ meal }) => {
  return (
    <View style={styles.mealItem}>
      <View style={styles.mealDetails}>
        <Text style={styles.mealTitle}>{meal.title}</Text>
        <Text style={styles.mealTime}>섭취 시간 : {meal.time}</Text>
      </View>
      <Text>{meal.calories} kcal</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerButton: {
    backgroundColor: '#blue',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerButtonText: {
    fontSize: 16,
    color: '#444',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop:10,
    marginBottom:20
  },
  list: {
    padding:10
  },
  mealItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 5, // Android shadow
    shadowColor: '#333', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    height:58,
  },
  mealDetails: {
    flex: 1,
  },
  mealTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  mealTime: {
    fontSize: 14,
    color: 'grey',
  },
});

export default MealList;
