import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { images } from '../../../constants';

const CharacterImage = () => (
  <View style={styles.container}>
    <Image source={images.character} style={styles.image} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  image: {
    width: 200,
    height: 300,
    resizeMode: 'contain',
  },
});

export default CharacterImage;
