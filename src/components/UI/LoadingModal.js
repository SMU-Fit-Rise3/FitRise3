import React from 'react';
import { Modal, View, StyleSheet, Dimensions, Text, StatusBar } from 'react-native';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

const LoadingModal = ({ visible }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
    >
      <StatusBar backgroundColor="rgba(0, 0, 0, 0.5)" barStyle="light-content" />
      <View style={styles.overlay}>
        <LottieView
          style={styles.lottie}
          source={require('../../assets/lottie/run_lottie.json')}
          autoPlay
          loop
        />
        <Text style={styles.text}>Loading...</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  lottie: {
    width: width * 0.4,
    height: width * 0.4,
  },
  text: {
    fontFamily: "Jua",
    fontSize: 20,
    color: "#ffffff"
  }
});

export default LoadingModal;
