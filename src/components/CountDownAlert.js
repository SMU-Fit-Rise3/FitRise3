import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';

const CountdownAlert = ({ onFinish }) => {
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (countdown === 0) {
            onFinish(); // Call the onFinish callback when countdown ends
            return;
        }

        // Countdown logic
        const timerId = setTimeout(() => {
            setCountdown(countdown - 1);
        }, 1000);

        return () => clearTimeout(timerId);
    }, [countdown, onFinish]);

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={countdown > 0}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>{countdown}</Text>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 200, // Big font size for the countdown numbers
        fontWeight: 'bold',
        color:'white',
    }
});

export default CountdownAlert;
