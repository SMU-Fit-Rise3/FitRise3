import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

const Card = ({ animationSource, title, description }) => {
  return (
    <View style={styles.card}>
      <LottieView
        style={styles.lottie}
        source={animationSource}
        autoPlay
        loop
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    marginVertical: 10,
    marginHorizontal: 20,
    width: width * 0.8,
    height: width * 0.4,
    // iOS 그림자
    shadowColor: '#555',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    // Android 그림자
    elevation: 8,
  },
  lottie: {
    width: width * 0.4,
    height: width * 0.4,
  },
  cardContent: {
    flex: 1,
    padding: 10,
    justifyContent: "center"
  },
  cardTitle: {
    fontFamily: "Jua",
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDescription: {
    fontFamily: "Jua",
    fontSize: 14,
    color: '#555',
  },
});

export default Card;
