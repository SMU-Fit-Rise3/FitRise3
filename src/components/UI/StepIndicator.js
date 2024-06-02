import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Dimensions } from 'react-native';

const { height } = Dimensions.get('window'); // Get the screen width

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
    padding:5,
    marginTop: height * 0.03,
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
    fontFamily:"Jua"
  }
});

export default StepIndicator;
