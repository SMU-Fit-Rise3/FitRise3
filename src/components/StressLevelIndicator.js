import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import images from '../../constants/images.js';

const StressLevelIndicator = ({ stressLevel }) => {
  // Logic to determine the needle position based on the stress level can go here
  // For example, you could use an animated view to rotate the needle

  return (
    <View style={styles.container}>
      <Text style={styles.header}>스트레스 지수: {stressLevel}</Text>
      <Image 
        source={images.stress_level} // Replace with your gauge image path
        style={styles.gauge}
      />
      {/* This view represents the needle which will rotate according to the stress level */}
      <View style={[styles.needle, { transform: [{ rotate: `${getRotationForStressLevel(stressLevel)}deg` }] }]}/>
      <Text style={styles.footer}>충전 필요</Text>
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  gauge: {
    width: 500, // Set according to your image
    height: 200, // Set according to your image
  },
  needle: {
    width: 4,
    height: 88, // Half of your gauge image height
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: '0%', 
    left:"42%"
  },
  footer: {
    fontSize: 16,
    color: 'grey',
    marginTop: 10,
  },
});

export default StressLevelIndicator;
