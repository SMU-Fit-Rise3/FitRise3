import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const StressLevelIndicator = ({ stressLevel }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: stressLevel,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [stressLevel]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 10],
    outputRange: [0, width * 0.7], // Adjust the width as needed
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>스트레스 지수: {stressLevel}</Text>
      <View style={styles.progressBarContainer}>
        <LinearGradient
          colors={['#D1F7E8', '#E1F8FE', '#C2C2C2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
        </LinearGradient>
        <Animated.View style={[styles.iconContainer, { left: progressWidth }]}>
          <View style={styles.icon} />
        </Animated.View>
      </View>
      <View style={styles.labelsContainer}>
        <Text style={styles.label}>낮음</Text>
        <Text style={styles.label}>높음</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    backgroundColor:"#fff"
  },
  header: {
    fontFamily: "Jua",
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 50,
  },
  progressBarContainer: {
    width: width * 0.8,
    height: 30,
    backgroundColor: '#e0e0e0',
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
  },
  gradient: {
    flex: 1,
    borderRadius: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'transparent', // Background color will be determined by gradient
  },
  iconContainer: {
    position: 'absolute',
    top: -10,
    width: 30,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#777',
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.8,
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    color: '#555',
    fontFamily:"Jua"
  },
});

export default StressLevelIndicator;
