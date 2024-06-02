import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // For icons

const InfoAlertComponent = ({ feedbackData }) => {

  const AlertMessages = (data) => {
    const messages = [];
    if (data.calorieDeficit > 0) {
      messages.push(`칼로리가 ${data.calorieDeficit} kcal 부족합니다`);
    }
    if (data.carbsDeficit > 0) {
      messages.push(`탄수화물이 ${data.carbsDeficit} g 부족합니다`);
    }
    if (data.proteinDeficit > 0) {
      messages.push(`단백질이 ${data.proteinDeficit} g 부족합니다`);
    }
    if (data.fatDeficit > 0) {
      messages.push(`지방이 ${data.fatDeficit} g 부족합니다`);
    }
    return messages;
  };

  const alertMessages = AlertMessages(feedbackData);

  return (
    <View style={styles.alertContainer}>
      <Text style={styles.titleText}>최근 7일 부족 영양소</Text>
      {alertMessages.length > 0 ? (
        alertMessages.map((message, index) => (
          <View key={index} style={styles.messageContainer}>
            <FontAwesome name="exclamation-circle" size={20} color="#d30430" />
            <Text style={styles.alertText}>{message}</Text>
          </View>
        ))
      ) : (
        <View style={styles.messageContainer}>
          <FontAwesome name="check-circle" size={20} color="#4CAF50" />
          <Text style={[styles.alertText, styles.successText]}>
            🎉 7일동안 목표 달성치를 달성했습니다!
          </Text>
        </View>
      )}
    </View>
  );
};

// Add styles for the component
const styles = StyleSheet.create({
  alertContainer: {
    width: "90%",
    padding: 15,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: '#eeefff', // Lighter red background for alert
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  titleText: {
    fontFamily:"Jua",
    fontSize: 18,
    fontWeight: "bold",
    color: '#d30430', // Dark red text color
    textAlign: 'center',
    marginBottom: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  alertText: {
    fontFamily:"Jua",
    fontSize: 16,
    color: '#d30430', // Dark red text color
    marginLeft: 10,
  },
  successText: {
    fontFamily:"Jua",
    color: '#4CAF50', // Green color for success message
  },
});

export default InfoAlertComponent;
