import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import API from '../../api'

const MacroCalculator = ({ totalCalories, goal }) => {
  const [macros, setMacros] = useState({
    carbs: 0,
    protein: 0,
    fat: 0
  });

  useEffect(() => {
    calculateMacros(totalCalories, goal);
  }, [totalCalories, goal]);

  const calculateMacros = (calories, goal) => {
    let ratios = { carbs: 0.5, protein: 0.3, fat: 0.2 }; // Default to health
    if (goal === 'cut') {
      ratios = { carbs: 0.65, protein: 0.25, fat: 0.1 };
    } else if (goal === 'muscle') {
      ratios = { carbs: 0.6, protein: 0.2, fat: 0.2 };
    }

    const carbsCalories = Math.round(calories * ratios.carbs);
    const proteinCalories = Math.round(calories * ratios.protein);
    const fatCalories = Math.round(calories * ratios.fat);

    setMacros({
      carbs: carbsCalories,
      protein: proteinCalories,
      fat: fatCalories
    });
  };

  //update button click
  const handleButtonPress = async () => {
    //Calculated Macros
    calculateMacros(totalCalories, goal);
    console.log('Calculated Macros:', macros);
    //Send server
    API.insertCalories("6637163419548b4c14803d6e",Number(totalCalories),macros.carbs,macros.protein,macros.fat)
      .then((result) => {
        console.log('Response from server:', result);
        setMacros({
          carbs: result.updateCalorie.carbs,
          protein: result.updateCalorie.protein,
          fat: result.updateCalorie.fat
        });
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Nutrient Distribution</Text>
      <View style={styles.row}>
        <Text>Carbs ({macros.carbs} kcal):</Text>
        <TextInput
          style={styles.input}
          value={macros.carbs.toString()}
          keyboardType="numeric"
          onChangeText={(text) => setMacros({ ...macros, carbs: parseInt(text || 0, 10) })}
        />
      </View>
      <View style={styles.row}>
        <Text>Protein ({macros.protein} kcal):</Text>
        <TextInput
          style={styles.input}
          value={macros.protein.toString()}
          keyboardType="numeric"
          onChangeText={(text) => setMacros({ ...macros, protein: parseInt(text || 0, 10) })}
        />
      </View>
      <View style={styles.row}>
        <Text>Fat ({macros.fat} kcal):</Text>
        <TextInput
          style={styles.input}
          value={macros.fat.toString()}
          keyboardType="numeric"
          onChangeText={(text) => setMacros({ ...macros, fat: parseInt(text || 0, 10) })}
        />
      </View>
      <Button title="Update" onPress={handleButtonPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    flex: 1,
    padding: 8,
    marginLeft: 10
  }
});

export default MacroCalculator;
