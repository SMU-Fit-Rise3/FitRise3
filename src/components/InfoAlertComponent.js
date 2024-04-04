import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const InfoAlertComponent = ({ infoName, amount }) => {
  return (
    <View style={styles.alertContainer}>
      <Text style={styles.alertText}>
      ‼️ {infoName} 섭취량이 {amount} 부족합니다
      </Text>
    </View>
  );
};

// Add styles for the component
const styles = StyleSheet.create({
  alertContainer: {
    width:"90%",
    padding: 15,
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#FFE3E3', // Light red background for alert
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  alertText: {
    fontSize: 20,
    fontWeight:"bold",
    color: '#D8000C', // Dark red text color
    textAlign: 'center',
  },
});

export default InfoAlertComponent;
