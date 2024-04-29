import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NutrientBar = ({ name, value, totalValue, icon }) => {
  const filledBarWidth = (value / totalValue) * 100 + '%';
  
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.nutrientName}>{name} {icon}</Text>
        <Text style={styles.nutrientValue}>{value} / {totalValue}</Text>
      </View>
      <View style={styles.barOutline}>
        <View style={[styles.filledBar, { width: filledBarWidth }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  barOutline: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
    marginTop: 5,
    overflow: 'hidden',
  },
  filledBar: {
    height: '100%',
    backgroundColor: '#C5D8FF',
    borderRadius: 5,
  },
  nutrientValue: {
    fontSize: 14,
    color: "#999",
  },
  nutrientName: {
    fontSize: 17,
    fontWeight: "bold",
  },
});

export default NutrientBar;
