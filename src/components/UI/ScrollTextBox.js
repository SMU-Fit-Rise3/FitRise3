import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const ScrollTextBox = ({ message }) => (
    <View style={styles.container}>
      <Text style={styles.titleText}>FeedBack</Text>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.descriptionText}>{message}</Text>
      </ScrollView>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex:1,
        padding: 30,
        margin: 30,
        marginHorizontal: 50,
        borderRadius: 30,
        backgroundColor: '#F1EFFF',
        justifyContent: 'center',
    },
    scrollContainer: {
        marginTop:10,
        borderRadius: 10,
        backgroundColor: '#F1EFFF',
    },
    descriptionText: {
        fontSize: 18,
        color: '#666',
    },
    titleText: {
        fontSize: 24,
        color: '#000',
        fontWeight:"bold",        
    },
});

export default ScrollTextBox;
