// MealList.js
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet  } from 'react-native';
import ColorToggleButton from "../UI/ColorToggleButton";

const mealTypes = [
  { label: 'Breakfast', value: 'Breakfast', icon: 'coffee' },
  { label: 'Lunch', value: 'Lunch', icon: 'food-variant' },
  { label: 'Dinner', value: 'Dinner', icon: 'silverware-fork-knife' },
  { label: 'Snack', value: 'Snack', icon: 'cupcake' },
];

const MealList = ({ mealData }) => {
  const [selectedMealType, setSelectedMealType] = useState('Breakfast');
  const meals = mealData[selectedMealType] || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>오늘의 식단</Text>
        <ColorToggleButton
          mealTypes={mealTypes}
          onMealTypeChange={setSelectedMealType}
        />
      </View>
      <FlatList
        data={meals}
        keyExtractor={(item) => item.food}
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
        <Text style={styles.mealname}>{meal.food}</Text>
      </View>
      <Text style={styles.kcalText}>{meal.calories} kcal</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop:10,
    marginBottom:20,
    fontFamily:"Jua"
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
  mealname: {
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily:"Jua"
  },
  kcalText: {
    fontSize: 14,
    color: 'grey',
    fontFamily:"Jua"
  },
});

export default MealList;
