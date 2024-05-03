import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import images from '../../../constants/images';

const StressLevelIndicator = ({ stressLevel }) => {

  return (
    <View style={styles.container}>
      <Text style={styles.header}>스트레스 지수: {stressLevel}</Text>
      <Image 
        source={images.stress_bar} // Replace with your gauge image path
        style={styles.gauge}
      />
      <View style={[styles.arrow, { left: `${(stressLevel / 10) * 100}%` }]} />
      <Text style={styles.footer}>😄 행복한 상태 😄</Text>
    </View>
  );
};

const getRotationForStressLevel = (level) => {
  // Convert stress level to rotation in degrees
  // This is a placeholder function, adjust as necessary for your gauge
  const degreePerLevel = 180 / 10; // Example for a gauge that spans 180 degrees with 10 levels
  return (level * degreePerLevel) - 90; // Adjusting for the initial rotation
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555',
  },
  gauge: {
    width: "100%", // Set according to your image
    height: 100, // Set according to your image
    resizeMode: "contain",
  },
  arrow: {
    position: 'absolute',
    bottom: 40, // Adjust this value as needed to place the arrow under the bar
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 20,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#555', // Adjust the color as needed
    transform: [{ translateX: 75 }], // Adjust this value to center the arrow under the bar
  },
  footer: {
    fontSize: 20,
    color: 'grey',
    marginTop: 10,
    fontWeight:"bold"
  },
});

export default StressLevelIndicator;
