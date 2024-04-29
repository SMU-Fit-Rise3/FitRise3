import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const StepIndicator = ({ steps, currentStep }) => {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <TouchableOpacity key={step} style={[
          styles.step,
          index === currentStep ? styles.current : index < currentStep ? styles.completed : styles.incomplete
        ]}>
          <Text style={styles.stepText}>{index + 1}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  step: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal:5,
    marginVertical:5,
    marginBottom:30
  },
  current: {
    backgroundColor: '#333',
  },
  completed: {
    backgroundColor: '#aaa',
  },
  incomplete: {
    backgroundColor: '#aaa',
  },
  stepText: {
    color: '#fff',
  }
});

export default StepIndicator;
