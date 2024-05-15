// RowBar.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RowBar = ({ ratios }) => {
  const barStyle = (ratio, color) => ({
    flex: ratio,
    backgroundColor: color,
    height: 20
  });

  return (
    <View style={styles.barContainer}>
      <View style={barStyle(ratios.carbs_ratio, '#2e8800')}>
        <Text style={styles.label}>{ratios.carbs_ratio.toFixed(0)}%</Text>
      </View>
      <View style={barStyle(ratios.protein_ratio, '#2ecc71')}>
        <Text style={styles.label}>{ratios.protein_ratio.toFixed(0)}%</Text>
      </View>
      <View style={barStyle(ratios.fat_ratio, '#2fff77')}>
        <Text style={styles.label}>{ratios.fat_ratio.toFixed(0)}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  barContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#ecf0f1',
    borderRadius: 10,
    overflow: 'hidden'
  },
  label: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12
  }
});

export default RowBar;
