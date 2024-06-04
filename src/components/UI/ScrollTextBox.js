import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const ScrollTextBox = ({ message }) => (
    <View style={styles.container}>
      <Text style={styles.titleText}>Feedback</Text>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.descriptionText}>{message}</Text>
      </ScrollView>
    </View>
);

const styles = StyleSheet.create({
    container: {
        height: 320, // 전체 컨테이너 높이를 줄이기 위해 고정된 높이 설정
        padding: 20,
        margin: 20,
        borderRadius: 15,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    scrollContainer: {
        maxHeight: 260, // 스크롤 컨테이너 높이 제한
        marginTop: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    descriptionText: {
        fontSize: 16,
        color: '#495057',
        fontFamily: "Jua",
        lineHeight: 24,
    },
    titleText: {
        fontSize: 24,
        color: '#212529',
        fontWeight: "bold",
        fontFamily: "Jua",
        marginBottom: 10,
    },
});

export default ScrollTextBox;
