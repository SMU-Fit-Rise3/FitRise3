// FoodItem.js
import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

const FoodItem = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.foodName}>{item.Food_Name} {item.MAKER_NM || ''}</Text>
      <Text style={styles.calories}>{item.Energy_kcal} kcal, 100g </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  foodName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom:3
  },
  calories: {
    fontSize: 12,
    color: '#666',
  }
});

export default FoodItem;
