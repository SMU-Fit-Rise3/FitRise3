import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PointsDisplay = () => (
  <View style={styles.container}>
    <Text style={styles.text}>🏆 500P</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',

  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
    color:"#444"
  },
});

export default PointsDisplay;