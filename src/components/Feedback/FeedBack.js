import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const FeedbackComponent = ({viewStyle, containerStyle, text, textStyle}) => {
    return (
        <View style={[styles.mainContainer, viewStyle]}>
            <View style={[styles.textContainer, containerStyle]}>
                <Text style={[styles.quoteText, textStyle]}>{text}</Text>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1, 
        backgroundColor: "#F5F6FB",
        justifyContent:"center",
        alignItems:"center",
    },
    textContainer: {
        height:"80%",
        width:"80%",
        borderRadius: 15, // More pronounced rounded corners
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 20, // More vertical padding
        paddingHorizontal: 20, // More horizontal padding
        marginHorizontal: 10, // Adds some margin on the sides
        shadowColor: '#555', // Shadow color
        shadowOffset: { width: 0, height: 4 }, // Shadow position
        shadowOpacity: 0.3, // Shadow opacity
        shadowRadius: 5, // Shadow blur radius
        elevation: 5, // Elevation for Android
    },
    quoteText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000',
        fontFamily:"Jua"
    },
});

export default FeedbackComponent;
