import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
          <Text key={index} style={styles.alertText}>
            {message} !!
          </Text>
        ))
      ) : (
        <Text style={styles.alertText}>
          🎉 7일동안 목표 달성치를 달성했습니다!
        </Text>
      )}
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
    marginBottom:20,
    backgroundColor: '#FFE3E3', // Light red background for alert
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: '#D8000C', // Dark red text color
    textAlign: 'center',
    marginBottom: 10,
  },
  alertText: {
    fontSize: 18,
    fontWeight:"bold",
    color: '#D8000C', // Dark red text color
    textAlign: 'center',
  },
});

export default InfoAlertComponent;
