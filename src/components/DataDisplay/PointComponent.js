import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PointsComponent = ({ points }) => (
  <View style={styles.pointsContainer}>
    <Text style={styles.pointsText}>{points} 포인트 획득 😆</Text>
  </View>
);

const styles = StyleSheet.create({
    pointsContainer: {
        padding: 50,
        marginHorizontal: 50,
        borderRadius: 30,
        backgroundColor: '#F6F6F6', // Use the color you want here
        alignItems: 'center',
        justifyContent: 'center',
    },
    pointsText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#000', // Adjust text color as needed
    },
});

export default PointsComponent;
